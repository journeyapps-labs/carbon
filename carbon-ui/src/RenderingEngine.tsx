import { CARBON_DARK, CarbonTheme } from './theme/CarbonTheme';
import * as _ from 'lodash';
import * as React from 'react';
import {
  AnnotationElement,
  Atom,
  AtomFactory,
  BaseProgram,
  BooleanProperty,
  CompileResult,
  ElementFactory,
  EnumProperty,
  MapProperty,
  Molecule,
  MultiBooleanProperty,
  Program,
  TextAnnotationElementFactory,
  TextProperty,
  BaseElement
} from '@journeyapps-labs/carbon-core';
import { BooleanDropDownItem, DropDownItem, InputType, RenderingEngineContext } from './RenderingEngineContext';
import { MouseEvent } from 'react';
import { Logger, LogLevel } from '@journeyapps-labs/common-logger';
import { BaseObserver } from '@journeyapps-labs/common-utils';

export interface RenderingEngineListener {
  themeChanged: () => any;
  programChanged: () => any;
  modelChanged: () => any;
  diagnosticsChanged: () => any;
  atomSelected: (atom: Atom) => any;
  sizeChanged: () => any;
}

export interface RenderingEngineOptions {
  context: RenderingEngineContext;
}

export interface RenderedTrayElement {
  width?: number;
  height?: number;
  element: React.JSX.Element;
}

export abstract class RenderingEngine extends BaseObserver<RenderingEngineListener> {
  // viewport
  width: number;
  height: number;
  theme: CarbonTheme;
  molecule: Molecule;
  program: BaseProgram;
  readonly: boolean;

  diagnostics: CompileResult[];
  devNullLogger: Logger;
  selectedAtom: Atom;

  constructor(protected options: RenderingEngineOptions) {
    super();
    this.selectedAtom = null;
    this.width = 0;
    this.height = 0;
    this.theme = CARBON_DARK;
    this.readonly = false;
    this.diagnostics = [];
    this.devNullLogger = new Logger({
      name: 'devnull',
      level: LogLevel.DEBUG,
      transport: {
        log(level: LogLevel, name: string, d: any[]): any {
          // do nothing
        }
      }
    });
  }

  async renderElementForTray(options: { factory: ElementFactory }): Promise<RenderedTrayElement> {
    if (options.factory.type === TextAnnotationElementFactory.TYPE) {
      return {
        element: <img src={require('../media/text-annotation.png')} />,
        height: 50
      };
    }
  }

  async showOptionsForEnumProperty(property: EnumProperty<any>, event: MouseEvent) {
    await this.options.context.showDropDown({
      event,
      items: property.options.values.map((v) => {
        return {
          label: v.label,
          action: () => {
            property.setValue(v.key);
          }
        } as DropDownItem;
      })
    });
  }

  async showInputForTextProperty(property: TextProperty, event: MouseEvent) {
    const value = await this.options.context.showInput({
      event,
      desc: property.label,
      initialValue: property.value,
      type: InputType.TEXT
    });
    if (value != null) {
      property.setValue(value);
    }
  }

  async showInputForMultiBooleanProperty(property: MultiBooleanProperty, event: MouseEvent) {
    const value = await this.options.context.showCheckboxDropDown({
      event,
      values: _.map(property.options.labels, (label, key) => {
        return {
          key,
          label: property.options.labels[key],
          enabled: property.value.indexOf(key) !== -1
        } as BooleanDropDownItem;
      })
    });
    if (value != null) {
      property.setValue(value);
    }
  }

  async showInputForMapProperty(property: MapProperty, event: MouseEvent) {
    await this.options.context.showMapEditor(property);
  }

  buildOptionsForAtom(atom: Atom, event: MouseEvent) {
    return Array.from(atom.properties.values())
      .map((p) => {
        if (p.type === EnumProperty.TYPE) {
          return {
            label: `Set property: ${p.label}`,
            action: () => {
              this.showOptionsForEnumProperty(p as EnumProperty<any>, event);
            }
          } as DropDownItem;
        }
        if (p.type === TextProperty.TYPE) {
          return {
            label: `Set property: ${p.label}`,
            action: () => {
              this.showInputForTextProperty(p, event);
            }
          } as DropDownItem;
        }
        if (p.type === BooleanProperty.TYPE) {
          return {
            label: !!p.value ? `Disable: ${p.label}` : `Enable: ${p.label}`,
            action: () => {
              p.setValue(!p.value);
            }
          } as DropDownItem;
        }
        if (p.type === MultiBooleanProperty.TYPE) {
          return {
            label: `Set properties: ${p.label}`,
            action: () => {
              this.showInputForMultiBooleanProperty(p as MultiBooleanProperty, event);
            }
          } as DropDownItem;
        }

        if (p.type === MapProperty.TYPE && this.options.context.showMapEditor) {
          return {
            label: `Update properties: ${p.label}`,
            action: () => {
              this.showInputForMapProperty(p as MapProperty, event);
            }
          } as DropDownItem;
        }
      })

      .filter((v) => !!v);
  }

  async showOptionsForElement(element: BaseElement, event: MouseEvent) {
    let properties = [];
    if (element instanceof Atom) {
      properties = this.buildOptionsForAtom(element, event);
    }

    await this.options.context.showDropDown({
      event: event,
      items: [
        {
          label: 'Delete',
          action: () => {
            element.delete();
          }
        },
        ...properties
      ]
    });
  }

  runDiagnostics() {
    const program = new Program(this.generateMolecule(), {
      // use empty logger since we only need it for testing program completeness
      logger: this.devNullLogger
    });
    try {
      this.diagnostics = program.compile({
        throw: false
      });
      this.iterateListeners((cb) => cb.diagnosticsChanged?.());
    } catch (ex) {}
  }

  abstract reDistribute();

  abstract generateMolecule(): Molecule;

  generateElement(factory: ElementFactory): BaseElement {
    return factory.generateElement({
      molecule: this.molecule
    });
  }

  setSelectedAtom = _.debounce((atom: Atom) => {
    this.selectedAtom = atom;
    this.iterateListeners((cb) => cb.atomSelected?.(atom));
  }, 40);

  setReadonly(readonly: boolean) {
    this.readonly = readonly;
  }

  setBounds(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.iterateListeners((cb) => cb.sizeChanged?.());
  }

  setTheme(theme: CarbonTheme) {
    if (_.isEqual(this.theme, theme)) {
      return;
    }
    this.theme = theme;
    this.iterateListeners((cb) => cb.themeChanged?.());
  }

  setProgram(program: BaseProgram) {
    this.program = program;
    this.iterateListeners((cb) => cb.programChanged?.());
  }

  addElement(element: BaseElement, event: { clientX: number; clientY: number }) {
    if (element instanceof Atom) {
      this.addAtom(element, event);
    } else {
      this.addAnnotation(element, event);
    }
  }

  addAtom(atom: Atom, event: { clientX: number; clientY: number }) {
    this.molecule.addAtom(atom);
  }

  addAnnotation(annotation: AnnotationElement, event: { clientX: number; clientY: number }) {
    this.molecule.addAnnotation(annotation);
  }

  removeAtom(atom: Atom) {
    if (this.selectedAtom === atom) {
      this.setSelectedAtom(null);
    }
    atom.delete();
  }

  setMolecule(molecule: Molecule) {
    this.molecule = molecule;
    this.runDiagnostics();
    this.iterateListeners((cb) => cb.modelChanged?.());
  }
}
