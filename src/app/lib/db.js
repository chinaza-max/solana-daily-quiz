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

    //console.log(serverConfig)
    
   /* const options = {
      dialect: "mysql",
      host: serverConfig.DB_HOST,
      port: Number(serverConfig.DB_PORT),
      logging: console.log,     
      logQueryParameters: true,
    };*/
   
    const options = {
      local:"pid.h.filess.io",
      username:'solanaDailyQuiz_satellites',
      password:'56223b3f7bf76757b9425595cff59f80e9a1ff0c',
      database:'solanaDailyQuiz_satellites',
      dialect: "mysql",
      dialectModule:require('mysql2'),
      logging: console.log,     
      logQueryParameters: true
    };

    // `mysql://${serverConfig.DB_USERNAME}:${serverConfig.DB_PASSWORD}@${serverConfig.DB_HOST}:${serverConfig.DB_PORT}/${serverConfig.DB_NAME}`;
    const dbUri =` mysql://solanaDailyQuiz_satellites:56223b3f7bf76757b9425595cff59f80e9a1ff0c@pid.h.filess.io:3307/solanaDailyQuiz_satellites`
  /*  this.sequelize = new Sequelize(
      serverConfig.DB_NAME,
      serverConfig.DB_USERNAME,   
      serverConfig.DB_PASSWORD,
      options
    );*/

    this.sequelize = new Sequelize(
     
      options
    )



    this.sequelize = new Sequelize(
      dbUri,      
      options
    );     
     
    this.models = initModels(this.sequelize);
     
    // Automatically create tables
   // await this.sequelize.sync({ alter: true });

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