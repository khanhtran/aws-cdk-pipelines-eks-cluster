import eks = require("aws-cdk-lib/aws-eks");
import { Environment, StackProps, Stage, Aspects } from "aws-cdk-lib";
import { EksClusterStack } from "./eks-cluster-stack";
import { Construct } from "constructs";

export interface EksClusterStageProps extends StackProps {
  clusterVersion: eks.KubernetesVersion;
  nameSuffix: string;
  env: Environment;
}

export class EksClusterStage extends Stage {
  constructor(scope: Construct, id: string, props: EksClusterStageProps) {
    super(scope, id, props);

    new EksClusterStack(this, "EKSCluster", {
      tags: {
        Application: "EKSCluster",
        Environment: id,
      },
      clusterVersion: props.clusterVersion,
      nameSuffix: props.nameSuffix,
      env: props.env,
    });
  }
}
