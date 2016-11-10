# Dockyard

[![Build Status](https://travis-ci.org/davidkelley/dockyard.svg?branch=master)](https://travis-ci.org/davidkelley/dockyard)

Dockyard is a custom [Codepipeline]() build action, that easily allows you to build and push Docker containers from source repositories on Github, [Codecommit]() or S3, directly to an [Elastic Container Registry]() repository.

## Getting Started

The One-Click Launch Stack buttons below, allow you to easily launch Dockyard into any environment using Cloudformation.

| __N. Virginia__ | [![Launch Dockyard](https://s3.amazonaws.com/cloudformation-examples/cloudformation-launch-stack.png)](https://console.aws.amazon.com/cloudformation/home?region=us-east-1#/stacks/new?stackName=Dockyard&templateURL=https://s3.amazonaws.com/us-east-1.dockyard.davidkelley.xyz/v0-0-2.cloudformation.yml) | __N. California__ | [![Launch Dockyard](https://s3.amazonaws.com/cloudformation-examples/cloudformation-launch-stack.png)](https://console.aws.amazon.com/cloudformation/home?region=us-west-1#/stacks/new?stackName=Dockyard&templateURL=https://s3.amazonaws.com/us-west-1.dockyard.davidkelley.xyz/v0-0-2.cloudformation.yml) |
|:----|:---:|:----|:---:|
| __Ohio__ | [![Launch Dockyard](https://s3.amazonaws.com/cloudformation-examples/cloudformation-launch-stack.png)](https://console.aws.amazon.com/cloudformation/home?region=us-east-2#/stacks/new?stackName=Dockyard&templateURL=https://s3.amazonaws.com/us-east-2.dockyard.davidkelley.xyz/v0-0-2.cloudformation.yml) | __Ireland__ | [![Launch Dockyard](https://s3.amazonaws.com/cloudformation-examples/cloudformation-launch-stack.png)](https://console.aws.amazon.com/cloudformation/home?region=eu-west-1#/stacks/new?stackName=Dockyard&templateURL=https://s3.amazonaws.com/eu-west-1.dockyard.davidkelley.xyz/v0-0-2.cloudformation.yml) |
| __Oregon__ | [![Launch Dockyard](https://s3.amazonaws.com/cloudformation-examples/cloudformation-launch-stack.png)](https://console.aws.amazon.com/cloudformation/home?region=us-west-2#/stacks/new?stackName=Dockyard&templateURL=https://s3.amazonaws.com/us-west-2.dockyard.davidkelley.xyz/v0-0-2.cloudformation.yml) | __Frankfurt__ | [![Launch Dockyard](https://s3.amazonaws.com/cloudformation-examples/cloudformation-launch-stack.png)](https://console.aws.amazon.com/cloudformation/home?region=eu-central-1#/stacks/new?stackName=Dockyard&templateURL=https://s3.amazonaws.com/eu-central-1.dockyard.davidkelley.xyz/v0-0-2.cloudformation.yml) |

Once the stack has been created, you can either manually create pipelines for your existing projects from inside the AWS Console, or use [the sample clouformation here]() to programatically create pipeline's using the template.

---

## How does this work?
