exports.BASE_URL = "https://gcp-api-alcuzebgrq-uc.a.run.app";
exports.HOST_URL = "www.gcp-api-alcuzebgrq-uc.a.run.app";

exports.options = (comment) => {
  const postData = JSON.stringify({
    comment: comment,
  });
  const url = this.BASE_URL;
  return {
    host: url,
    path: "/predict",
    //since we are listening on a custom port, we need to specify it by hand
    // port: process.env.PORT || 3000,
    //This is what changes the request to a POST request
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(postData),
    },
  };
};
