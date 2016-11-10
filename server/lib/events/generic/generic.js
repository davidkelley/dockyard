'use strict';

import Promise from 'bluebird';

import { LIST_EXPORTS } from './constants';
import { IDENTIFIER } from '../../globals';
import Cloudformation from './cloudformation';

class Generic {
  constructor(event, context) {
    this.event = event;
    this.context = context;
    this.properties = {};
  }

  execute(...params) {
    return new Promise((resolve, reject) => {
      Cloudformation(LIST_EXPORTS, {}).then((data) => {
        data.Exports.forEach((exp) => {
          this.properties[exp.Name.replace(IDENTIFIER, '')] = exp.Value;
        });
        this.perform(...params).then(resolve).catch(reject);
      }).catch(reject);
    });
  }
}

export default Generic;
