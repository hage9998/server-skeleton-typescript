import { query } from "express";
import { MigrationInterface, QueryRunner } from "typeorm";

export class ProductsTable1677763886060 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "Products" (
                id SERIAL PRIMARY KEY,
                description VARCHAR,
                images VARCHAR[],
                price NUMERIC(7,2),
                shopee_url VARCHAR
            )`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`DROP TABLE IF EXISTS "Products" CASCADE`);
  }
}
