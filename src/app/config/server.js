// config/server.js
export default {
    DB_HOST: process.env.DB_HOST || 'localhost',
    DB_USERNAME: 'root',
    DB_PASSWORD:'',
    DB_PORT: process.env.DB_PORT || 3306,
    DB_NAME: process.env.DB_NAME || 'solana-game-quiz',
    NODE_ENV: process.env.NODE_ENV || 'development',
  };

  // server.js
import  { createServer } from 'http';
import { parse } from 'url';
import next from 'next';
import {setupCronJob}  from'../lib/cron.js';
 /*
const dev = process.env.NODE_ENV !== 'production';    
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  }).listen(3000, (err) => {
    if (err) throw err;
    console.log('> Ready on http://localhost:3000');
    
    // Schedule the cron job
    setupCronJob();       
  });
});  */