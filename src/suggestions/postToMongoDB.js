import { AWSLAMBDA_FUNCTION_URL } from "./awsLambdaUrl";

export default async function postToMongoDB(formData) {
  const functionUrl = AWSLAMBDA_FUNCTION_URL
  const options = {
    method: "POST",
    body: JSON.stringify(formData),
    headers: {
      "Content-Type": "text/plain"
    }
  };

  const response = await fetch(functionUrl, options);
  return response
}