import { MigrationInterface, QueryRunner } from "typeorm";

export class UserTable1677698055355 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE IF NOT EXISTS "User" (
            id SERIAL PRIMARY KEY,
            username VARCHAR NOT NULL,
            password VARCHAR NOT NULL,
            role VARCHAR NOT NULL,
            createdAt DATE NOT NULL,
            updatedAt DATE NOT NULL
        )`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "User" CASCADE`);
  }
}
