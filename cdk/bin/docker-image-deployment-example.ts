#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { DockerImageDeploymentExampleStack } from "../lib/docker-image-deployment-example-stack";

const app = new cdk.App();

new DockerImageDeploymentExampleStack(app, "DockerImageDeploymentExampleStack");
