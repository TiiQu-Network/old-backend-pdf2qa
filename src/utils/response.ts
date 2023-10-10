export interface Messages {
  [key: number]: string;
}

export interface Response {
  statusCode: number;
  headers: {
    "Access-Control-Allow-Origin": string;
    "Access-Control-Allow-Credentials": boolean;
    "Access-Control-Allow-Headers": string;
  };
  body: string;
}

const messages: Messages = {
  400: "Invalid parameters",
  401: "Unauthorized",
  403: "Forbidden",
  404: "Not found",
  422: "Unprocessable",
  500: "Server error",
};

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Credentials": true,
  "Access-Control-Allow-Headers": "*",
};

export const error = (
  statusCode = 500,
  customMessage: string = "",
): Response => {
  try {
    const body = JSON.stringify({
      message:
        customMessage.length === 0 ? messages[statusCode] : customMessage,
    });
    return {
      statusCode,
      headers,
      body,
    };
  } catch (e) {
    console.error(e);
    return {
      statusCode: 500,
      headers,
      body: "{'message':'Server error'}'",
    };
  }
};