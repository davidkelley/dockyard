'use strict';

import Promise from 'bluebird';

import Runner from '../runner';
import Schedule, { Wrap } from '../events/schedule';
import CodePipeline from './codePipeline';

import { IDENTIFIER } from '../globals';
import { POLL_FOR_JOBS, ACKNOWLEDGE_JOB, REGION } from './constants';

class Poller extends Schedule {
  perform() {
    return new Promise((resolve, reject) => {
      CodePipeline(POLL_FOR_JOBS, this.pipelineParams).then(({ jobs }) => {
        if(jobs.length == 0) {
          console.log('Nothing to do');
          resolve();
        } else {
          Promise.all(jobs.map(this.onJob, this)).then(() => resolve()).catch(reject)
        }
      }).catch(reject)
    });
  }

  onJob({ id, nonce, data }) {
    return new Promise((resolve, reject) => {
      const opts = this.jobToOpts({ id, data, properties: this.properties });
      new Runner(opts).run().then(() => {
        this.acknowledge({ id, nonce }).then(resolve).catch(reject);
      });
    })
  }

  acknowledge({ id, nonce }) {
    return CodePipeline(ACKNOWLEDGE_JOB, { jobId: id, nonce });
  }

  get topicArn() {
    const accountId = this.context.invokedFunctionArn.split(':')[4];
    return `arn:aws:sns:${REGION}:${accountId}:${IDENTIFIER}-SSM-Topic`;
  }

  get pipelineParams() {
    return {
      maxBatchSize: 1,
      actionTypeId: {
        category: 'Build',
        owner: 'Custom',
        provider: IDENTIFIER,
        version: this.properties.Version
      }
    }
  }

  jobToOpts({ id, data, properties }) {
    const artifact = data.inputArtifacts[0];
    const s3 = artifact.location.s3Location;
    const { topicArn } = this;
    return {
      id,
      topicArn,
      name: properties['Command'],
      roleArn: properties['NotificationTopicIAMRole'],
      image: data.actionConfiguration.configuration.image,
      revision: artifact.revision,
      artifact: `${s3.bucketName}/${s3.objectKey}`
    }
  }
}

export default Wrap(Poller)
