'use strict';

import Promise from 'bluebird';

import Runner from '../runner';
import SNS, { Wrap } from '../events/sns';
import CodePipeline from './codePipeline';
import SSM from './ssm';

import { LIST_COMMAND_INVOCATIONS, SUCCESS, FAILURE, OK, ERROR } from './constants';

class Update extends SNS {
  perform() {
    return new Promise((resolve, reject) => {
      const { result } = this;
      if(result) {
        this.jobId().then((jobId) => {
          const params = this.pipelineParams(jobId);
          console.log(params);
          CodePipeline(result, params).then(resolve).catch(reject);
        })
      } else {
        resolve();
      }
    });
  }

  pipelineParams(jobId) {
    switch(this.result) {
      case SUCCESS:
        return {
          jobId,
          executionDetails: {
            externalExecutionId: this.commandId,
            percentComplete: 100,
            summary: this.statusMessage
          }
        }
      case ERROR:
        return {
          jobId,
          failureDetails: {
            message: this.statusMessage,
            type: 'JobFailed'
          }
        }
    }
  }

  jobId() {
    return new Promise((resolve, reject) => {
      SSM(LIST_COMMAND_INVOCATIONS, {
        CommandId: this.commandId,
        InstanceId: this.instanceId,
        MaxResults: 1,
      }).then(({ CommandInvocations }) => {
        const invocation = CommandInvocations[0];
        resolve(invocation.Comment);
      })
    });
  }

  get commandId() {
    return this.message.commandId;
  }

  get instanceId() {
    return this.message.instanceId;
  }

  get status() {
    return this.message.status;
  }

  get result() {
    switch(this.state) {
      case OK:
        return SUCCESS;
      case ERROR:
        return FAILURE;
      default:
        return null;
    }
  }

  get state() {
    switch(this.status) {
      case 'Pending':
      case 'InProgress':
        return null;
      case 'Success':
        return OK;
      case 'Cancelling':
      case 'TimedOut':
      case 'Cancelled':
      case 'Failed':
        return ERROR;
    }
  }

  get statusMessage() {
    switch(this.status) {
      case 'Pending':
      case 'InProgress':
        return `Instance: ${this.instanceId}`;
      case 'Success':
        return `Success. Instance: ${this.instanceId}`;
      case 'Cancelling':
      case 'Cancelled':
        return "The build was cancelled"
      case 'TimedOut':
        return "The build timed out"
      case 'Failed':
        return "An unknown error occurred"
    }
  }
}

export default Wrap(Update)
