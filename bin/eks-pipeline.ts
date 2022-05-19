#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import {Aspects, App} from 'aws-cdk-lib';
import { EksPipelineStack } from '../lib/eks-pipeline-stack';

const app = new cdk.App();
const env = { account: '657641750194', region: 'us-east-2' }
new EksPipelineStack(app, 'eks-pipeline-stack', {
  env: env
});


app.synth()
