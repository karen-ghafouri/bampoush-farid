const https = require('https');
const http = require('http');

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  if (req.method === 'POST' && req.url === '/send-otp') {

    let body = '';

    req.on('data', chunk => {
      body += chunk;
    });

    req.on('end', () => {

      try {

        const { to } = JSON.parse(body);

        if (!to) {
          res.writeHead(400, {
            'Content-Type': 'application/json'
          });

          return res.end(JSON.stringify({
            error: 'شماره موبایل الزامی است'
          }));
        }

        console.log('Sending OTP to:', to);

        const data = JSON.stringify({
          to: to
        });

        const options = {
          hostname: 'console.melipayamak.com',
          port: 443,
          path: '/api/send/otp/03be094aea1f4361b3a47bd942babfa4',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(data)
          }
        };

        const apiReq = https.request(options, apiRes => {

          let result = '';

          apiRes.on('data', chunk => {
            result += chunk;
          });

          apiRes.on('end', () => {

            console.log('Melipayamak Response:', result);

            res.writeHead(200, {
              'Content-Type': 'application/json'
            });

            res.end(result);
          });

        });

        apiReq.on('error', error => {

          console.error('Melipayamak Error:', error);

          res.writeHead(500, {
            'Content-Type': 'application/json'
          });

          res.end(JSON.stringify({
            error: error.message
          }));

        });

        apiReq.write(data);
        apiReq.end();

      } catch (e) {

        console.error('Server Error:', e);

        res.writeHead(400, {
          'Content-Type': 'application/json'
        });

        res.end(JSON.stringify({
          error: 'خطا در پردازش درخواست'
        }));

      }

    });

  } else {

    res.writeHead(404, {
      'Content-Type': 'text/plain'
    });

    res.end('Not Found');

  }

});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
