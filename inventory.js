const http = require('http');
const url = require('url');

// In-memory array to store items
let items = [];

// Function to handle sending JSON responses
function sendResponse(response, statusCode, data) {
  response.writeHead(statusCode, { 'Content-Type': 'application/json' });
  response.end(JSON.stringify(data));
}

// Function to generate a unique ID for each item
function generateItemId() {
  return Math.floor(Math.random() * 1000);
}

// To create the HTTP server
const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const { pathname } = parsedUrl;

  // The route for creating an item
  if (req.method === 'POST' && pathname === '/items') {
    let body = '';

    req.on('data', (chunk) => {
      body += chunk;
    });

    req.on('end', () => {
      const newItem = JSON.parse(body);
      newItem.id = generateItemId();

      items.push(newItem);
      sendResponse(res, 201, newItem);
    });
  }

  // The route for getting all items
  else if (req.method === 'GET' && pathname === '/items') {
    sendResponse(res, 200, items);
  }

  // The route for getting one item by ID
  else if (req.method === 'GET' && pathname.startsWith('/items/')) {
    const itemId = parseInt(pathname.split('/').pop());
    const item = items.find((item) => item.id === itemId);

    if (item) {
      sendResponse(res, 200, item);
    } else {
      sendResponse(res, 404, { message: 'Item not found' });
    }
  }

  // Route for updating an item by ID
  else if (req.method === 'PUT' && pathname.startsWith('/items/')) {
    const itemId = parseInt(pathname.split('/').pop());
    let body = '';

    req.on('data', (chunk) => {
      body += chunk;
    });

    req.on('end', () => {
      const updatedItem = JSON.parse(body);
      const index = items.findIndex((item) => item.id === itemId);

      if (index !== -1) {
        items[index] = { ...items[index], ...updatedItem };
        sendResponse(res, 200, items[index]);
      } else {
        sendResponse(res, 404, { message: 'Item not found' });
      }
    });
  }

  // Route for deleting an item by ID
  else if (req.method === 'DELETE' && pathname.startsWith('/items/')) {
    const itemId = parseInt(pathname.split('/').pop());
    const index = items.findIndex((item) => item.id === itemId);

    if (index !== -1) {
      const deletedItem = items.splice(index, 1)[0];
      sendResponse(res, 200, deletedItem);
    } else {
      sendResponse(res, 404, { message: 'Item not found' });
    }
  }

  // Route not found
  else {
    sendResponse(res, 404, { message: 'Route not found' });
  }
});

// The port for the server to listen on
const port = 8000;

// To start the server and listen on the specified port
server.listen(port, () => {
  console.log(`API Server is running and listening on http://localhost:${port}/`);
});