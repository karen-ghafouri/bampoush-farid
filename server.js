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
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const { to } = JSON.parse(body);
        if (!to) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'شماره موبایل الزامی است' }));
          return;
        }

        // تولید کد ۶ رقمی
        const code = Math.floor(100000 + Math.random() * 900000).toString();

        const postData = JSON.stringify({
          to: to,
          text: code,
          bodyId: 1
        });

        const options = {
          hostname: 'console.melipayamak.com',
          port: 443,
          path: '/api/send/shared/03be094aea1f4361b3a47bd942babfa4',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData)
          }
        };

        const apiReq = https.request(options, apiRes => {
          let result = '';
          apiRes.on('data', d => { result += d; });
          apiRes.on('end', () => {
            // کد رو به سایت برمیگردونیم تا بتونه تأیید کنه
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ code: code, result: result }));
          });
        });

        apiReq.on('error', error => {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: error.message }));
        });

        apiReq.write(postData);
        apiReq.end();

      } catch(e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'خطا در پردازش درخواست' }));
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
