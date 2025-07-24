import { CreateStyled } from './createStyled';
import { CarbonTheme } from '@journeyapps-labs/carbon-ui';
import { useTheme } from '@emotion/react';

import s from '@emotion/styled';

const s2 = (comp, options) => {
  return s(comp, {
    ...(options ? options : {}),
    shouldForwardProp: (propName: string) => !propName.startsWith('$')
  });
};
for (let key in s) {
  s2[key] = s[key];
}

export const styled = s2 as CreateStyled<CarbonTheme>;

export function useCarbonTheme<T extends CarbonTheme>(): T {
  return useTheme() as T;
}
