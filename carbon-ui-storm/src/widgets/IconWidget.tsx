import * as React from 'react';
import styled from '@emotion/styled';
import { Icon } from './common';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export interface IconWidgetProps {
  icon: Icon;
  color: string;
  size: number;
}

export const IconWidget: React.FC<IconWidgetProps> = (props) => {
  if (props.icon?.fa) {
    return <S.FAIcon color={props.color} sizing={props.size} icon={props.icon.fa} />;
  }
  return null;
};
namespace S {
  export const FAIcon: any = styled(FontAwesomeIcon)<{ sizing: number; color: string }>`
    height: ${(p: any) => p.sizing}px;
    color: ${(p: any) => p.color};
  `;
}
