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
      vpcId: '0d6840f719e623c0b',
      availabilityZones: ['us-east-2a', 'us-east-2b', 'us-east-2c'],
      privateSubnetIds: ["subnet-0ecdc7f883bd80731", "subnet-04426cd587ab2f852", "subnet-0e987c484ac30538d"],
    })

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
