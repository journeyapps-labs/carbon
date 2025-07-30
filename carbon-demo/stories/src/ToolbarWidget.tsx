import * as React from 'react';
import styled from '@emotion/styled';

export interface ToolbarWidgetProps {
  items: { label: string; action: () => any }[];
  className?: any;
}

export const ToolbarWidget: React.FC<ToolbarWidgetProps> = (props) => {
  return (
    <S.Container className={props.className}>
      {props.items.map((i) => {
        return (
          <S.Item
            key={i.label}
            onClick={() => {
              i.action?.();
            }}
          >
            {i.label}
          </S.Item>
        );
      })}
    </S.Container>
  );
};
namespace S {
  export const Container = styled.div`
    display: flex;
    background: rgb(10, 10, 10);
  `;

  export const Item = styled.div`
    color: white;
    font-family: 'Open Sans';
    font-size: 12px;
    padding: 5px;
  `;
}
