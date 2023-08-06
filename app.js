const http = require('http');
const fs = require('fs');
const path = require('path');

// Function to handle serving the HTML files
function serveHTMLFile(filePath, response) {
  fs.readFile(filePath, 'utf8', (err, content) => {
    if (err) {
      response.writeHead(404, { 'Content-Type': 'text/html' });
      response.end('<h1>404 - Page Not Found</h1>');
    } else {
      response.writeHead(200, { 'Content-Type': 'text/html' });
      response.end(content);
    }
  });
}

// Create the HTTP server
const server = http.createServer((req, res) => {
  const { url } = req;

  if (url === '/index.html') {
    const indexPath = path.join(__dirname, 'index.html');
    serveHTMLFile(indexPath, res);
  } else {
    // For any other route, return the 404 page
    const notFoundPath = path.join(__dirname, '404.html');
    serveHTMLFile(notFoundPath, res);
  }
});

// Set the port for the server to listen on
const port = 3000;

// Start the server and listen on the specified port
server.listen(port, () => {
  console.log(`Server is running and listening on http://localhost:${port}/`);
});