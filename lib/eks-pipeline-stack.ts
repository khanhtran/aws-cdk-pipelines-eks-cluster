import * as cdk from "aws-cdk-lib";
import eks = require("aws-cdk-lib/aws-eks");
import {
  CodeBuildStep,
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

    const repository = Repository.fromRepositoryName(this, 'ops-code-repository', 'ops-pipeline')
    const pipeline = new CodePipeline(this, "Pipeline", {
      selfMutation: false,
      crossAccountKeys: false,
      synth: new CodeBuildStep("Synth", {
        input: CodePipelineSource.codeCommit(repository, 'master',{
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
        account: '657641750194',
        region: 'us-east-2'
      },
    });

    pipeline.addStage(eksClusterStageA)


  }
}
