import * as cdk from "aws-cdk-lib";
import eks = require("aws-cdk-lib/aws-eks");
import ec2 = require("aws-cdk-lib/aws-ec2");
import { Construct } from 'constructs'
import { Vpc, IVpc } from "aws-cdk-lib/aws-ec2"

import { EksManagedNodeGroup } from "./infrastructure/eks-mng";


export interface EksClusterStackProps extends cdk.StackProps {
  clusterVersion: eks.KubernetesVersion;
  nameSuffix: string;
}

export class EksClusterStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: EksClusterStackProps) {
    super(scope, id, props);

    const vpc = Vpc.fromVpcAttributes(this, 'default-vpc',
    {
      vpcId: 'vpc-0bf95010f1cd5f60a',
      availabilityZones: ['us-east-2a', 'us-east-2b', 'us-east-2c'],
      privateSubnetIds: ["subnet-0488f2b2afec8e5a2", "subnet-0a680ad304d67d4c3", "subnet-0183ea0b0b3da5124"],
    })

    const cluster = new eks.Cluster(this, `${props.nameSuffix}`, {
      clusterName: `${props.nameSuffix}`,
      version: props.clusterVersion,
      defaultCapacity: 0,
      vpc,
      vpcSubnets: [{ subnetType: ec2.SubnetType.PRIVATE }],
    });

    // const eksMng = new EksManagedNodeGroup(this, "EksManagedNodeGroup", {
    //   cluster: cluster,
    //   nameSuffix: props.nameSuffix,
    // });


  }
}
