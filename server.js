const https = require('https');
const http = require('http');

const PORT = process.env.PORT || 3000;
const USERNAME = '9010085929';
const PASSWORD = 'BRN32EFC5';

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
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const { to } = JSON.parse(body);
        if (!to) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'شماره موبایل الزامی است' }));
          return;
        }

        const code = Math.floor(100000 + Math.random() * 900000).toString();
        const bodyId = '1';

        const path = `/post/Send.asmx/SendByBaseNumber2?username=${USERNAME}&password=${PASSWORD}&text=${code}&to=${to}&bodyId=${bodyId}`;

        const options = {
          hostname: 'api.payamak-panel.com',
          port: 443,
          path: path,
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': 0
          }
        };

        const apiReq = https.request(options, apiRes => {
          let result = '';
          apiRes.on('data', d => { result += d; });
          apiRes.on('end', () => {
            console.log('ملی پیامک response:', result);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ code: code, result: result }));
          });
        });

        apiReq.on('error', error => {
          console.error('خطا:', error);
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: error.message }));
        });

        apiReq.end();

      } catch(e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'خطا در پردازش' }));
      }
    });
  } else {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'بامپوش فرید OTP سرور آنلاینه!' }));
  }
});

server.listen(PORT, () => {
  console.log('Server running on port ' + PORT);
});
apiReq.on('error', error => {
  console.log('MELIPAYAMAK ERROR:', error);
});

apiRes.on('end', () => {
  console.log('MELIPAYAMAK RESPONSE:', result);
});
