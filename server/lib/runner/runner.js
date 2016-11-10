'use strict';

import Promise from 'bluebird';

import SSM from './ssm';
import { SEND_COMMAND, DESCRIBE_INSTANCE_INFORMATION } from './constants';

class Runner {
  constructor({ id, topicArn, roleArn, name, image, revision, artifact }) {
    this.id = id;
    this.topicArn = topicArn;
    this.roleArn = roleArn;
    this.document = name;
    this.image = image;
    this.revision = revision;
    this.artifact = artifact;
  }

  run() {
    return new Promise((resolve, reject) => {
      this.associations().then((instanceId) => {
        SSM(SEND_COMMAND, {
          DocumentName: this.document,
          Comment: this.id,
          ServiceRoleArn: this.roleArn,
          InstanceIds: [instanceId],
          NotificationConfig: {
            NotificationArn: this.topicArn,
            NotificationEvents: ["All"],
            NotificationType: 'Invocation'
          },
          Parameters: {
            revision: [this.revision],
            artifact: [this.artifact],
            image: [this.image]
          }
        }).then(resolve).catch(reject);
      }).catch(reject);
    })
  }

  associations() {
    return new Promise((resolve, reject) => {
      SSM(DESCRIBE_INSTANCE_INFORMATION, {
        InstanceInformationFilterList: [{
          key: 'PingStatus',
          valueSet: ['Online']
        }]
      }).then(({ InstanceInformationList }) => {
        if(InstanceInformationList.length == 0) {
          reject('No available command instances');
        } else {
          const i = Math.floor(Math.random() * InstanceInformationList.length);
          const { InstanceId } = InstanceInformationList[i];
          resolve(InstanceId);
        }
      }).catch(reject);
    });
  }
}

export default Runner;
