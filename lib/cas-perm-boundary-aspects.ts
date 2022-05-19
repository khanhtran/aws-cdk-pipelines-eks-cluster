import * as iam from 'aws-cdk-lib/aws-iam';
import * as cdk from 'aws-cdk-lib';
import { IConstruct } from 'constructs'

/**
 * Implements CDK Aspect visitor pattern to apply CAS Role Rules
 *
 * While traversing through the construct tree, if node is an AWS::IAM::Role
 * then this aspect will enforce the following rules:
 * 1. RoleNames must be prefixed with cas-
 * 2. Roles must contain permission boundary
 */
export class CASRolePolicyBoundaryAspect implements cdk.IAspect {
  private ROLE_PATH = '/cas-user/'
  public permissionsBoundary: string;
  constructor(permissionsBoundary: string) {
    this.permissionsBoundary = permissionsBoundary;
  }

  public visit(node: IConstruct) {
    if (node instanceof iam.CfnRole) {
      if (! node.roleName?.match('cas-.*')) {
        node.addPropertyOverride('Path', this.ROLE_PATH);
      }
      this.addPermissionsBoundary(node);
    }
  }

  private addPermissionsBoundary(node: iam.CfnRole) {
    if (undefined === node.permissionsBoundary) {
      node.addPropertyOverride('PermissionsBoundary', this.permissionsBoundary);
    } else if (node.permissionsBoundary !== this.permissionsBoundary) {
      node.addMetadata('warning', `Did not add permission boundary ${this.permissionsBoundary}, permission boundary ${node.permissionsBoundary} already included`);
    }
  }
}