// lib/db.js
import { Sequelize } from "sequelize";
import serverConfig from "../config/server.js";
import { init as initModels } from "../models/index.js";


class DB {
  constructor() {
    this.sequelize = null;
    this.models = null;
  }

  async connectDB() {

    console.log(serverConfig)
    
    const options = {
      dialect: "mysql",
      host: serverConfig.DB_HOST,
      port: Number(serverConfig.DB_PORT),
      logging: console.log,
      logQueryParameters: true,
    };

    this.sequelize = new Sequelize(
      serverConfig.DB_NAME,
      serverConfig.DB_USERNAME,
      serverConfig.DB_PASSWORD,
      options
    );

    this.models = initModels(this.sequelize);

    // Automatically create tables
    //await this.sequelize.sync({ alter: true });

    console.log('Database connected and tables created/updated');
  }
}

let dbInstance = null;

export async function getDB() {
  if (!dbInstance) {
    dbInstance = new DB();
    await dbInstance.connectDB();
  }
  return dbInstance;
}