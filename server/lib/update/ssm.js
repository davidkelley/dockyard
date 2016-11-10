'use strict';

import AWS from 'aws-sdk';
import Promise from 'bluebird';

const REGION = process.env.AWS_REGION;

const SSM = new AWS.SSM({ region: REGION })

export default function(op, params) {
  return Promise.fromCallback(cb => SSM[op](params, cb));
}
