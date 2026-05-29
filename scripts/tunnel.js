/* eslint-disable no-console */
// Opens an ngrok tunnel to the local API. Reads NGROK_AUTHTOKEN and PORT from
// .env so you only have to paste your token in one place.
const { spawn } = require('child_process');
require('dotenv').config();

const port = process.env.PORT || '3000';
const token = process.env.NGROK_AUTHTOKEN;

const args = ['http', port];
if (token && token.trim()) {
  args.push('--authtoken', token.trim());
} else {
  console.warn(
    '\n⚠  NGROK_AUTHTOKEN is empty in .env.\n' +
      '   Get a free token at https://dashboard.ngrok.com/get-started/your-authtoken\n' +
      '   then either paste it into .env or run: ngrok config add-authtoken <token>\n',
  );
}

console.log(`Starting ngrok tunnel -> http://localhost:${port} ...`);
const child = spawn('ngrok', args, { stdio: 'inherit' });
child.on('error', (err) => {
  if (err.code === 'ENOENT') {
    console.error('ngrok binary not found. Install it: brew install --cask ngrok');
  } else {
    console.error(err);
  }
  process.exit(1);
});
child.on('exit', (code) => process.exit(code ?? 0));
