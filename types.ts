import { APIGatewayTokenAuthorizerEvent, AuthResponse } from "aws-lambda";

// NOTE: Save for upcoming lambda functions
// import {
//   APIGatewayEvent,
//   Context,
//   Callback,
//   APIGatewayProxyResult,
// } from "aws-lambda";

// export interface LambdaHandler {
//   (
//     event: APIGatewayEvent,
//     context: Context,
//     callback: Callback,
//   ): Promise<APIGatewayProxyResult>;
// }

export interface GeneratePolicy {
  (
    event: APIGatewayTokenAuthorizerEvent,
    Effect: "Allow" | "Deny" | "Unauthorized",
    principalId?: string,
  ): AuthResponse;
}

export interface VerifiedToken {
  uuid: string;
  name: string;
  email: string;
  picture: string;
  iat: number;
  exp: number;
}
