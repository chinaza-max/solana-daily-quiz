// config/server.js
/*export default {
    DB_HOST: process.env.DB_HOST || 'pid.h.filess.io',
    DB_USERNAME: 'solanaDailyQuiz_satellites',
    DB_PASSWORD:'56223b3f7bf76757b9425595cff59f80e9a1ff0c',
    DB_PORT: process.env.DB_PORT || 3307,
    DB_NAME: process.env.DB_NAME || 'solanaDailyQuiz_satellites',
    NODE_ENV: process.env.NODE_ENV || 'development',
};
*/

const config = {
  DB_HOST: process.env.DB_HOST || 'localhost',
  DB_USERNAME: 'root',
  DB_PASSWORD: '',
  DB_PORT: process.env.DB_PORT || 3306,
  DB_NAME: process.env.DB_NAME || 'solana-game-quiz',
  NODE_ENV: process.env.NODE_ENV || 'development',
};

export default config;

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