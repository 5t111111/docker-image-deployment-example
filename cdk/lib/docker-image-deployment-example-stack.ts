import {
  Stack,
  StackProps,
  aws_ec2 as ec2,
  aws_ecs as ecs,
  aws_ecr as ecr,
  aws_ecs_patterns as ecsPatterns,
} from "aws-cdk-lib";
import { Construct } from "constructs";
import * as path from "path";
import * as imagedeploy from "cdk-docker-image-deployment";

export class DockerImageDeploymentExampleStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    //**************************************************** */
    // VPC
    //**************************************************** */
    const vpc = new ec2.Vpc(this, "Vpc", {
      ipAddresses: ec2.IpAddresses.cidr("10.199.0.0/16"),
      maxAzs: 2,
      natGateways: 1,
    });

    //**************************************************** */
    // ECR
    //**************************************************** */
    const repository = new ecr.Repository(this, "Repository", {
      repositoryName: "docker-image-deployment-example",
    });

    new imagedeploy.DockerImageDeployment(
      this,
      "ExampleImageDeploymentWithTag",
      {
        source: imagedeploy.Source.directory(
          path.join(__dirname, "../..", "app")
        ),
        destination: imagedeploy.Destination.ecr(repository, {
          tag: "myspecialtag",
        }),
      }
    );

    //**************************************************** */
    // Task Definition
    //**************************************************** */
    const taskDefinition = new ecs.FargateTaskDefinition(
      this,
      "TaskDefinition",
      {
        runtimePlatform: {
          operatingSystemFamily: ecs.OperatingSystemFamily.LINUX,
          cpuArchitecture: ecs.CpuArchitecture.ARM64,
        },
      }
    );

    // Add container to task definition
    taskDefinition.addContainer("AppContainer", {
      image: ecs.ContainerImage.fromEcrRepository(repository, "myspecialtag"),
      portMappings: [
        {
          containerPort: 3000,
        },
      ],
    });

    //**************************************************** */
    // ECS Fargate Service
    //**************************************************** */
    new ecsPatterns.ApplicationLoadBalancedFargateService(this, "Service", {
      taskDefinition,
      vpc,
    });
  }
}
