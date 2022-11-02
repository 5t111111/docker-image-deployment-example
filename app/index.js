const http = require("http");
const port = 3000;

const server = http.createServer((request, response) => {
  response.writeHead(200, {
    "Content-Type": "text/html",
  });

  const responseMessage = "<h1>CDK Docker Image Deployment Example App</h1>";
  response.end(responseMessage);
});

server.listen(port);
