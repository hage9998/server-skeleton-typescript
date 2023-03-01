import { DataSource } from "typeorm";
import { User } from "../domain/entities/user";
import * as dotenv from "dotenv";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER_NAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: false,
  logging: false,
  subscribers: [`dist/subscriber/**/*{.js,.ts}`],
  entities: [`dist/domain/entities/**/*{.js,.ts}`],
  migrations: [`dist/migrations/**/*{.js,.ts}`],
});
