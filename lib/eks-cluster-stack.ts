import * as cdk from "aws-cdk-lib";
import eks = require("aws-cdk-lib/aws-eks");
import ec2 = require("aws-cdk-lib/aws-ec2");
import { Construct } from 'constructs'

import { EksManagedNodeGroup } from "./infrastructure/eks-mng";


export interface EksClusterStackProps extends cdk.StackProps {
  clusterVersion: eks.KubernetesVersion;
  nameSuffix: string;
}

export class EksClusterStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: EksClusterStackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, "Vpc", { maxAzs: 3 });

    const cluster = new eks.Cluster(this, `kxt29-${props.nameSuffix}`, {
      clusterName: `kxt29-${props.nameSuffix}`,
      version: props.clusterVersion,
      defaultCapacity: 0,
      vpc,
      vpcSubnets: [{ subnetType: ec2.SubnetType.PRIVATE }],
    });

    const eksMng = new EksManagedNodeGroup(this, "EksManagedNodeGroup", {
      cluster: cluster,
      nameSuffix: props.nameSuffix,
    });


  }
}
