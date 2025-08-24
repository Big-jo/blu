import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTablesUpdate1755993564373 implements MigrationInterface {
    name = 'AddTablesUpdate1755993564373'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tbl_transactions" ALTER COLUMN "status" SET DEFAULT 'PENDING'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tbl_transactions" ALTER COLUMN "status" SET DEFAULT 'FAILED'`);
    }

}
