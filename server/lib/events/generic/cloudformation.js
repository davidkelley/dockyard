'use strict';

import AWS from 'aws-sdk';
import Promise from 'bluebird';

const REGION = process.env.AWS_REGION;

const Cloudformation = new AWS.CloudFormation({ region: REGION })

export default function(op, params) {
  return Promise.fromCallback(cb => Cloudformation[op](params, cb));
}
