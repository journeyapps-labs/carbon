import * as _ from 'lodash';
import Color from 'color';

export const getTransparentColor = _.memoize(
  (color, transparency) => {
    return new Color(color).alpha(transparency).toString();
  },
  (a, b) => `${a}${b}`
);
