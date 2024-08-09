// lib/cron.js
import cron from 'node-cron';
import { getDB } from './db';
import { Op } from 'sequelize';

export function setupCronJob() {
  // Run every hour
  cron.schedule('0 * * * *', async () => {
    console.log('Running cron job to delete old answered questions');
    const db = await getDB();
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    try {
      const deletedCount = await db.models.Question.destroy({
        where: {
          answered: true,
          updatedAt: {
            [Op.lt]: twentyFourHoursAgo
          }
        }
      });
      console.log(`Deleted ${deletedCount} old answered questions`);
    } catch (error) {
      console.error('Error in cron job:', error);
    }
  });
}