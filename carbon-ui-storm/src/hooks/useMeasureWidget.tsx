import * as React from 'react';
import { useEffect, useState } from 'react';
import { AtomFactory } from '@journeyapps-labs/carbon-core';
import { CarbonStormEngine } from '../CarbonStormEngine';
import { CarbonThemeContainerWidget } from '../CarbonThemeContainerWidget';
import { createRoot } from 'react-dom/client';
import { AtomNodeModel } from '../models/atom/AtomNodeModel';

export const Renderered: React.FC<React.PropsWithChildren<{ completed: () => any }>> = (props) => {
  useEffect(() => {
    props.completed();
  }, []);
  return props.children as React.JSX.Element;
};

export const measureWidget = (render: () => React.JSX.Element) => {
  return new Promise<DOMRect>((resolve) => {
    const element = document.createElement('div') as HTMLDivElement;
    element.style.display = 'inline-block';
    element.style.position = 'fixed';
    element.style.opacity = '0';
    document.body.appendChild(element);
    const renderer = createRoot(element);
    renderer.render(
      <Renderered
        completed={() => {
          const rect = element.getBoundingClientRect();
          resolve(rect);
          setTimeout(() => {
            renderer.unmount();
            element.remove();
          }, 0);
        }}
      >
        <div style={{ display: 'inline-block' }}>{render()}</div>
      </Renderered>
    );
  });
};

let ATOM_SIZE_CACHE = new Map<AtomFactory, [number, number]>();

export const measureAtom = async (options: {
  atomFactory: AtomFactory;
  engine: CarbonStormEngine;
}): Promise<[number, number]> => {
  const { engine, atomFactory } = options;

  if (ATOM_SIZE_CACHE.has(atomFactory)) {
    return ATOM_SIZE_CACHE.get(atomFactory);
  }

  const measure = await measureWidget(() => {
    return (
      <CarbonThemeContainerWidget engine={engine}>
        {engine.uiBank.getUIForAtomType(atomFactory.type).render({
          event: {
            model: new AtomNodeModel(atomFactory.generateAtom(), null)
          },
          engine: null,
          readonly: true
        })}
      </CarbonThemeContainerWidget>
    );
  });

  ATOM_SIZE_CACHE.set(options.atomFactory, [measure.width, measure.height]);
  return [measure.width, measure.height];
};

export const useMeasureAtom = (atomFactory: AtomFactory, carbonEngine: CarbonStormEngine) => {
  const [dim, setDimension] = useState<[number, number]>(() => {
    if (ATOM_SIZE_CACHE.has(atomFactory)) {
      return ATOM_SIZE_CACHE.get(atomFactory);
    }
    return null;
  });
  useEffect(() => {
    if (dim === null) {
      measureAtom({
        atomFactory,
        engine: carbonEngine
      }).then((res) => {
        setDimension(res);
      });
    }
  }, []);
  return dim;
};
