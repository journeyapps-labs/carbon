import * as React from 'react';
import styled from '@emotion/styled';
import { AtomFactory } from '@journeyapps-labs/carbon-core';

export interface CarbonTrayWidgetProps {
  factories: AtomFactory[];
  render: (groups: { group: string; factories: AtomFactory[] }[]) => React.JSX.Element;
}

export const CarbonTrayWidget: React.FC<CarbonTrayWidgetProps> = (props) => {
  const categories = new Map<string, AtomFactory[]>();
  for (let fact of props.factories) {
    let category = fact.options.category;
    if (!category) {
      category = 'Un-categorized';
    }
    if (!categories.has(category)) {
      categories.set(category, []);
    }
    categories.get(category).push(fact);
  }

  return (
    <S.Container>
      {props.render(
        Array.from(categories.entries()).map(([cat, factories]) => {
          return {
            factories: factories,
            group: cat
          };
        })
      )}
    </S.Container>
  );
};
namespace S {
  export const Container = styled.div``;
}
