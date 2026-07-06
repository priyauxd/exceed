const http = require('http');
const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname);
const mime = { '.html': 'text/html', '.css': 'text/css', '.js': 'application/javascript' };

http.createServer((req, res) => {
  let url = req.url.split('?')[0];
  if (url === '/') url = '/index.html';
  const fp = path.join(dir, url);
  const ext = path.extname(fp);
  fs.readFile(fp, (err, data) => {
    if (err) { res.writeHead(404); res.end('Not found'); return; }
    res.writeHead(200, { 'Content-Type': mime[ext] || 'text/plain' });
    res.end(data);
  });
}).listen(3000, () => console.log('Serving on 3000'));
