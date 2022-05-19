import * as cdk from "aws-cdk-lib";
import eks = require("aws-cdk-lib/aws-eks");
import {
  CodePipeline,
  CodePipelineSource,
  ShellStep,
  ManualApprovalStep,
} from "aws-cdk-lib/pipelines";
import { EksClusterStage } from "./eks-cluster-stage";
import { Repository } from 'aws-cdk-lib/aws-codecommit';
import { Construct } from 'constructs'
import { CodeCommitTrigger } from "aws-cdk-lib/aws-codepipeline-actions";

export class EksPipelineStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const repository = Repository.fromRepositoryName(this, 'ops-code-repository', 'kxt29-ops')
    const pipeline = new CodePipeline(this, "Pipeline", {
      selfMutation: false,
      crossAccountKeys: true,
      synth: new ShellStep("Synth", {
        input: CodePipelineSource.codeCommit(repository, 'MED-85',{
          trigger: CodeCommitTrigger.POLL
        }),
        commands: ["npm ci", "npm run build", "npx cdk synth"],
      }),
      pipelineName: "kxt29-eks-pipeline",
    });


    const eksClusterStageA = new EksClusterStage(this, "dev", {
      clusterVersion: eks.KubernetesVersion.V1_20,
      nameSuffix: 'medchem',
      env: {
        account: '784302963922',
        region: 'us-east-2'
      },
    });

    pipeline.addStage(eksClusterStageA)


  }
}
