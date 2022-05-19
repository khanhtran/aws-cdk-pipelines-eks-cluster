#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import {Aspects, App} from 'aws-cdk-lib';
import { EksPipelineStack } from '../lib/eks-pipeline-stack';
import { CASRolePolicyBoundaryAspect } from "../lib/cas-perm-boundary-aspects";

const app = new cdk.App();
const env = { account: '746878319868', region: 'us-east-2' }
new EksPipelineStack(app, 'eks-pipeline-stack', {
  env: env
});

Aspects.of(app).add(new CASRolePolicyBoundaryAspect(`arn:aws:iam::${env.account}:policy/cas-infrastructure/permission-boundary-policy`))
app.synth()
