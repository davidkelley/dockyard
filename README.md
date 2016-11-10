# Dockyard

[![Build Status](https://travis-ci.org/davidkelley/dockyard.svg?branch=master)](https://travis-ci.org/davidkelley/dockyard)

Dockyard is a custom [Codepipeline](https://aws.amazon.com/documentation/codepipeline/) build action, that easily allows you to build and push Docker containers from source repositories on Github, [Codecommit](https://aws.amazon.com/documentation/codecommit/) or S3, directly to an [Elastic Container Registry](https://aws.amazon.com/documentation/ecr/) repository.

## Getting Started

The One-Click Launch Stack buttons below, allow you to easily launch Dockyard into any environment using Cloudformation.

| __N. Virginia__ | [![Launch Dockyard](https://s3.amazonaws.com/cloudformation-examples/cloudformation-launch-stack.png)](https://console.aws.amazon.com/cloudformation/home?region=us-east-1#/stacks/new?stackName=Dockyard&templateURL=https://s3.amazonaws.com/us-east-1.dockyard/v0-0-2-cf.yml) | __N. California__ | [![Launch Dockyard](https://s3.amazonaws.com/cloudformation-examples/cloudformation-launch-stack.png)](https://console.aws.amazon.com/cloudformation/home?region=us-west-1#/stacks/new?stackName=Dockyard&templateURL=https://s3.amazonaws.com/us-west-1.dockyard/v0-0-2-cf.yml) |
|:----|:---:|:----|:---:|
| __Ohio__ | [![Launch Dockyard](https://s3.amazonaws.com/cloudformation-examples/cloudformation-launch-stack.png)](https://console.aws.amazon.com/cloudformation/home?region=us-east-2#/stacks/new?stackName=Dockyard&templateURL=https://s3.amazonaws.com/us-east-2.dockyard/v0-0-2-cf.yml) | __Ireland__ | [![Launch Dockyard](https://s3.amazonaws.com/cloudformation-examples/cloudformation-launch-stack.png)](https://console.aws.amazon.com/cloudformation/home?region=eu-west-1#/stacks/new?stackName=Dockyard&templateURL=https://s3.amazonaws.com/eu-west-1.dockyard/v0-0-2-cf.yml) |
| __Oregon__ | [![Launch Dockyard](https://s3.amazonaws.com/cloudformation-examples/cloudformation-launch-stack.png)](https://console.aws.amazon.com/cloudformation/home?region=us-west-2#/stacks/new?stackName=Dockyard&templateURL=https://s3.amazonaws.com/us-west-2.dockyard/v0-0-2-cf.yml) | __Frankfurt__ | [![Launch Dockyard](https://s3.amazonaws.com/cloudformation-examples/cloudformation-launch-stack.png)](https://console.aws.amazon.com/cloudformation/home?region=eu-central-1#/stacks/new?stackName=Dockyard&templateURL=https://s3.amazonaws.com/eu-central-1.dockyard/v0-0-2-cf.yml) |

Once the stack has been created, you can either manually create pipelines for your existing projects from inside the AWS Console, or use [the sample clouformation here](https://github.com/davidkelley/dockyard/tree/master/samples) to programatically create pipeline's using the template.

If the stack has been correctly configured and setup, you should see Dockyard appear as a build action inside the CodePipeline console, as depicted below.

![Dockyard in CodePipeline](https://github.com/davidkelley/dockyard/raw/master/.github/images/pipeline.png)

---

## How does this work?

Either by manually creating the stack by deploying the resources yourself, or clicking on one of the __Launch Stack__ buttons above, a Cloudformation is deployed to your account that sets up the following resources:

* A custom CodePipeline build action
* Two lambda functions:
  * Function that polls for new CodePipeline build jobs and executes them.
  * A function that listens for execution updates and sends feedback to CodePipeline
* Associated IAM Roles and Policies:
* An Autoscaling Group that contains Build Worker EC2 Instances
* A Scheduled Action which scales the workers on and off at a configurable time.
* An SSM Document enabling the retrieval of jobs, building of containers and pushing to ECR.

_A typical build process follows the below steps:_

0. The polling lambda function executes at a particular interval (default is every 10mins) asking CodePipeline if there are any new builds that need executing.

0. If a new build is ready to be executed, CodePipeline replies with the details of the job. The lambda function acknowledges the job, finds an available worker, configures the SSM Document ([with SNS topic notifications](http://docs.aws.amazon.com/AWSEC2/latest/UserGuide/rc-sns-notifications.html#rc-sns)) and tells the instance to execute the job.

0. As the instance works on executing the job, various notifications are sent via an SNS Topic that the second lambda function is bound to.

0. Finally, when a "Sucess" or "Error" notification is received, it appropriately updates Codepipeline.
