import { MigrationInterface, QueryRunner } from "typeorm";

export class NewTables1755961186151 implements MigrationInterface {
    name = 'NewTables1755961186151'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tbl_transactions" ADD "status" character varying NOT NULL DEFAULT 'FAILED'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tbl_transactions" DROP COLUMN "status"`);
    }

}
