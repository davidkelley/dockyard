'use strict';

import Promise from 'bluebird';

import Generic from '../generic';

export function Wrap(req, ...params) {
  return (ev, ctx, fn) => {
    let $ = ev.Records.map(rec => new req(rec, ev, ctx).execute(...params));
    Promise.all($).then(() => fn).catch(fn);
  }
};

class SNS extends Generic {
  constructor(record, ...params) {
    super(...params);
    this.record = record;
    console.log("RECORD");
    console.log(this.record);
  }

  get message() {
    try {
      return JSON.parse(this.record.Sns.Message);
    } catch(e) {
      return this.record.Sns.Message;
    }
  }
}

export default SNS;
