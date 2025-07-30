import {
  CARBON_DARK,
  CarbonTheme,
  RenderedTrayElement,
  RenderingEngine,
  RenderingEngineContext
} from '@journeyapps-labs/carbon-ui';
import * as _ from 'lodash';
import { StormUIBank } from './ui/StormUIBank';
import { DagreEngine } from '@projectstorm/react-diagrams';
import {
  AnnotationElement,
  Atom,
  AtomFactory,
  BaseElement,
  ElementFactory,
  EnumProperty,
  MapProperty,
  Molecule,
  MultiBooleanProperty
} from '@journeyapps-labs/carbon-core';
import { generateDiagram } from './hooks/useDiagramEngine';
import { CarbonPortTypeLayerFactory } from './port-labels/CarbonPortTypeLayer';
import { CarbonDiagramModel } from './models/CarbonDiagramModel';
import { BasePositionModel } from '@projectstorm/react-canvas-core';
import { measureAtom } from './hooks/useMeasureWidget';
import { CarbonStormDiagramsEngine } from './CarbonStormDiagramsEngine';
import { AtomNodeModel } from './models/atom/AtomNodeModel';

export interface CarbonStormEngineOptions {
  uiBank?: StormUIBank;
  defaultTheme?: CarbonTheme;
  context: RenderingEngineContext;
}

export class CarbonStormEngine extends RenderingEngine {
  uiBank: StormUIBank;
  diagramEngine: CarbonStormDiagramsEngine;
  dagre: DagreEngine;
  additionalLayers: Set<CarbonPortTypeLayerFactory>;

  private interactionLocks: number;

  queuedDiagnostics = _.debounce(() => {
    this.runDiagnostics();
  }, 100);

  constructor(protected options2: CarbonStormEngineOptions) {
    super({
      context: options2.context
    });
    this.interactionLocks = 0;
    this.theme = options2.defaultTheme || CARBON_DARK;
    this.uiBank = options2?.uiBank || new StormUIBank();
    this.dagre = new DagreEngine({
      includeLinks: false,
      graph: {
        align: 'UL',
        rankdir: 'LR',
        ranker: 'tight-tree',
        marginx: 50,
        marginy: 50,
        nodesep: 10,
        edgesep: 10,
        ranksep: 70
      }
    });

    this.additionalLayers = new Set<CarbonPortTypeLayerFactory>();
    this.diagramEngine = new CarbonStormDiagramsEngine(this);
    this.diagramEngine.setModel(new CarbonDiagramModel(null, this));
    this.updateModel();
  }

  async renderElementForTray(options: { factory: ElementFactory }): Promise<RenderedTrayElement> {
    const element = await super.renderElementForTray(options);
    if (element) {
      return element;
    }

    if (options.factory instanceof AtomFactory) {
      const element = this.uiBank.getUIForAtomType(options.factory.type).render({
        event: {
          model: new AtomNodeModel(options.factory.generateElement(), null)
        },
        engine: null,
        readonly: true
      });

      const [width, height] = await measureAtom({
        atomFactory: options.factory,
        engine: this
      });
      return {
        element: element,
        width,
        height
      };
    }
  }

  acquireInteractionLock() {
    // model is simply in readonly mode anyways
    if (this.interactionLocks === 0 && this.getModel().isLocked()) {
      return () => {};
    }

    // run some locks
    this.interactionLocks++;
    this.setReadonly(true);
    return () => {
      this.interactionLocks--;
      if (this.interactionLocks === 0) {
        this.setReadonly(false);
      }
    };
  }

  private async wrapInInteractionLock<R>(cb: () => Promise<R>): Promise<R> {
    let unlock = this.acquireInteractionLock();
    try {
      let res = await cb();
      await new Promise((resolve) => {
        setTimeout(resolve, 500);
      });
      unlock();
      return res;
    } catch (ex) {
      unlock();
    }
  }

  showOptionsForEnumProperty(property: EnumProperty<any>, event: React.MouseEvent): Promise<void> {
    return this.wrapInInteractionLock(() => {
      return super.showOptionsForEnumProperty(property, event);
    });
  }

  showInputForMultiBooleanProperty(property: MultiBooleanProperty, event: React.MouseEvent): Promise<void> {
    return this.wrapInInteractionLock(() => {
      return super.showInputForMultiBooleanProperty(property, event);
    });
  }

  showOptionsForElement(atom: BaseElement, event: React.MouseEvent): Promise<void> {
    return this.wrapInInteractionLock(() => {
      return super.showOptionsForElement(atom, event);
    });
  }

  showInputForMapProperty(property: MapProperty, event: React.MouseEvent) {
    return this.wrapInInteractionLock(() => {
      return super.showInputForMapProperty(property, event);
    });
  }

  registerPortTypeLayer(layer: CarbonPortTypeLayerFactory) {
    this.additionalLayers.add(layer);
    this.diagramEngine.getLayerFactories().registerFactory(layer);
  }

  reDistribute() {
    this.dagre.redistribute(this.diagramEngine.getModel());
    this.diagramEngine.repaintCanvas();
  }

  getModel() {
    return this.diagramEngine.getModel() as CarbonDiagramModel;
  }

  private setupElement(element: BaseElement, event: { clientX: number; clientY: number }) {
    const position = this.diagramEngine.getRelativeMousePoint(event);
    element.x = position.x;
    element.y = position.y;
  }

  generateStormModelForElement<T extends BasePositionModel>(element: BaseElement): T {
    if (element instanceof Atom) {
      return new AtomNodeModel(element, this) as unknown as T;
    }
    if (element instanceof AnnotationElement) {
      this.diagramEngine.getAnnotationLayer().bank.getFactory(element.type).generateModel({});
    }
  }

  addAtom(atom: Atom, event: { clientX: number; clientY: number }) {
    super.addAtom(atom, event);
    this.setupElement(atom, event);
    const node = this.generateStormModelForElement<AtomNodeModel>(atom);
    this.setupAtomNodeModel(node);
    this.diagramEngine.getModel().addNode(node);
    this.diagramEngine.repaintCanvas();
  }

  addAnnotation(annotation: AnnotationElement, event: { clientX: number; clientY: number }) {
    super.addAnnotation(annotation, event);
    this.setupElement(annotation, event);
    this.diagramEngine.getAnnotationLayer().addAnnotation(annotation);
    this.diagramEngine.repaintCanvas();
  }

  private setupAtomNodeModel(node: AtomNodeModel) {
    const disposer = node.registerListener({
      entityRemoved: () => {
        disposer?.deregister();
      },
      selectionChanged: (event) => {
        if (event.isSelected) {
          this.setSelectedAtom(node.atom);
        } else {
          this.setSelectedAtom(null);
        }
      }
    });
  }

  setReadonly(readonly: boolean) {
    super.setReadonly(readonly);
    this.diagramEngine.getModel().setLocked(readonly);
  }

  setMolecule(molecule: Molecule) {
    const newModel = generateDiagram({
      molecule,
      engine: this
    });

    newModel.setOffsetX(this.getModel().getOffsetX());
    newModel.setOffsetY(this.getModel().getOffsetY());
    newModel.setZoomLevel(this.getModel().getZoomLevel());

    newModel.registerListener({
      nodesUpdated: (event) => {
        this.queuedDiagnostics();
      },
      linksUpdated: (event) => {
        this.queuedDiagnostics();
        const listener = event.link.registerListener({
          entityRemoved(event) {
            listener.deregister();
          },
          sourcePortChanged: (event) => {
            this.queuedDiagnostics();
          },
          targetPortChanged: (event2) => {
            this.queuedDiagnostics();
          }
        });
      }
    });
    newModel.setLocked(this.readonly);
    newModel.getNodes().forEach((n) => {
      if (n instanceof AtomNodeModel) {
        this.setupAtomNodeModel(n);
      }
    });
    this.getModel().dispose();
    this.diagramEngine.setModel(newModel);
    this.updateModel();
    super.setMolecule(molecule);
    this.queuedDiagnostics();
  }

  updateModel() {
    for (let factory of this.additionalLayers) {
      this.diagramEngine.getModel().addLayer(factory.generateModel({}));
    }
  }

  generateMolecule(): Molecule {
    return this.getModel().molecule;
  }
}
