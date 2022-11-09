import * as dotenv from "dotenv";
import { ServerInit } from "./Server";
import { AppDataSource } from "./configs/DataSource";

const startServer = () => {
  AppDataSource.initialize().then(async () => {
    dotenv.config();
    const port = process.env.PORT;
    const server = new ServerInit();

    server.app.listen(port);
  });
};

startServer();
