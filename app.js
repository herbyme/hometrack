const fs = require('fs');
const http = require('http');
const url = require('url');

const port = 3000;

// Event listener for HTTP server "error" event.
const onError = (error) => {
  if (error.syscall !== 'listen') {
    throw error;
  }

  // Handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error('Requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error('Address/Port is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

// Event listener for HTTP server "listening" event.
const onListening = () => console.log('🌎 Listening on ' + port);

const filterData = (requestData) => {
  let results = [];
  for (let i = requestData.length - 1; i >= 0; i--) {
    // Look for items workflow: completed for type: 'htv'
    // Assumes format of rest of the fields is correct
    if (requestData[i].type === 'htv'
      && requestData[i].workflow === 'completed') {
        let concatenatedAddress = '';

        // Commented out code is more concise but doesn't format it into 'human readable'
        /*for (const key of Object.keys(requestData[i].address)) {
          concatenatedAddress =
          concatenatedAddress.concat(requestData[i].address[key]);
          concatenatedAddress = concatenatedAddress.concat(' ');
        }*/

        // Not sure how lat/lon keys should be formatted, assumption it goes at end
        if (requestData[i].address.hasOwnProperty('unitNumber')) {
          concatenatedAddress =
          concatenatedAddress.concat(requestData[i].address['unitNumber']);
          concatenatedAddress = concatenatedAddress.concat(' ');
        }
        if (requestData[i].address.hasOwnProperty('buildingNumber')) {
          concatenatedAddress =
          concatenatedAddress.concat(requestData[i].address['buildingNumber']);
          concatenatedAddress = concatenatedAddress.concat(' ');
        }
        if (requestData[i].address.hasOwnProperty('street')) {
          concatenatedAddress =
          concatenatedAddress.concat(requestData[i].address['street']);
          concatenatedAddress = concatenatedAddress.concat(' ');
        }
        if (requestData[i].address.hasOwnProperty('suburb')) {
          concatenatedAddress =
          concatenatedAddress.concat(requestData[i].address['suburb']);
          concatenatedAddress = concatenatedAddress.concat(' ');
        }
        if (requestData[i].address.hasOwnProperty('postcode')) {
          concatenatedAddress =
          concatenatedAddress.concat(requestData[i].address['postcode']);
          concatenatedAddress = concatenatedAddress.concat(' ');
        }
        if (requestData[i].address.hasOwnProperty('lat')) {
          concatenatedAddress =
          concatenatedAddress.concat(requestData[i].address['lat']);
          concatenatedAddress = concatenatedAddress.concat(' ');
        }
        if (requestData[i].address.hasOwnProperty('lon')) {
          concatenatedAddress =
          concatenatedAddress.concat(requestData[i].address['lon']);
          concatenatedAddress = concatenatedAddress.concat(' ');
        }

        // Remove extra space
        concatenatedAddress =
        concatenatedAddress.substring(0, concatenatedAddress.length - 1);

        results.push({
          concataddress: concatenatedAddress,
          type: 'htv',
          workflow: 'completed',
        });
    }
  }

  return results;
}

const server = http.createServer((request, response) => {
  const { headers, method, url } = request;
  if (method === 'POST' && url.startsWith('/')) {
    let body = [];
    request.on('error', (err) => {
      console.error(err);
      response.writeHead(500, { 'Content-Type': 'application/json' });
      response.end(JSON.stringify({ error: 'request issue' }));
    }).on('data', (chunk) => {
      body.push(chunk);
    }).on('end', () => {
      body = Buffer.concat(body).toString();

      response.on('error', (err) => {
        console.error(err);
      });

      // Parse body as expected to be json
      try {
        const requestData = JSON.parse(body);

        // Check if it's genuine payload
        if (requestData.payload) {
          // Check if payload is an array
          if (Array.isArray(requestData.payload)) {
            response.writeHead(200, { 'Content-Type': 'application/json' });
            response.end(JSON.stringify({
              response: filterData(requestData.payload)
            }));
          } else {
            response.statusCode = 400;
            response.end(JSON.stringify({
              error: 'Incorrect format: JSON payload is not array'
            }));
          }
        } else {
          response.statusCode = 400;
          response.end(JSON.stringify({
            error: 'Incorrect format: JSON missing payload key'
          }));
        }
      } catch (e) { // Handle malformed data (i.e. not JSON)
        console.error(e)
        response.statusCode = 400;
        response.end(JSON.stringify({
          error: 'Could not decode request: JSON parsing failed'
        }));
      }
    });
  } else if (method === 'GET' && url.startsWith('/ping')) { // For load balancer
    response.statusCode = 200;
    response.end();
  } else { // Give back status of non-existent end-point
    response.statusCode = 404;
    response.end();
  }
});

// Activate server, listening on port 3000;
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);
