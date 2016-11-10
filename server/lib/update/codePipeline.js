'use strict';

import AWS from 'aws-sdk';
import Promise from 'bluebird';

const REGION = process.env.AWS_REGION;

const CodePipeline = new AWS.CodePipeline({ region: REGION })

export default function(op, params) {
  console.log(`${op}\n----\n${JSON.stringify(params)}`);
  return Promise.fromCallback(cb => CodePipeline[op](params, cb));
}
