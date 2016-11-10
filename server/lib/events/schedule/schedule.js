'use strict';

import Generic from '../generic';

export function Wrap(req, ...params) {
  return (ev, ctx, fn) => {
    new req(ev, ctx).execute(...params).then(() => fn).catch(fn)
  }
};

class Schedule extends Generic {
}

export default Schedule;
