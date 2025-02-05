export default async function postToMongoDB(formData) {
  const functionUrl = "https://ulfxaricdyc3xckztvv7nnhdhe0ahwlm.lambda-url.us-east-2.on.aws/";
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