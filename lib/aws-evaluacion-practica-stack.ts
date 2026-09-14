import { ApiKey, ApiKeySourceType, LambdaIntegration, RestApi, UsagePlan } from 'aws-cdk-lib/aws-apigateway';
import { AttributeType, BillingMode, Table } from 'aws-cdk-lib/aws-dynamodb';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import * as cdk from 'aws-cdk-lib/core';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class AwsEvaluacionPracticaStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const dbTable = new Table(this, 'DbTable', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      billingMode: BillingMode.PAY_PER_REQUEST
    });

    const api = new RestApi(this, 'RestAPI', {
      restApiName: 'RestAPI',
      apiKeySourceType: ApiKeySourceType.HEADER
    });

    const apiKey = new ApiKey(this, 'ApiKey');
    const usagePlan = new UsagePlan(this, 'UsagePlan', {
      name: 'UsagePlan',
      apiStages: [
        {
          api,
          stage: api.deploymentStage
        }
      ]
    });

    usagePlan.addApiKey(apiKey);

    const serviceLambda = new NodejsFunction(this, 'serviceLambda', {
      entry: 'src/service.ts',
      handler: 'handler',
      environment: {
        TABLE_NAME: dbTable.tableName
      }
    });

    dbTable.grantReadWriteData(serviceLambda);

    const books = api.root.addResource('book');
    const book = books.addResource('{id}');

    const lambdaIntegration = new LambdaIntegration(serviceLambda);

    books.addMethod('POST', lambdaIntegration, {
      apiKeyRequired: true
    });

    book.addMethod('GET', lambdaIntegration, {
      apiKeyRequired: true
    });

  }
}
