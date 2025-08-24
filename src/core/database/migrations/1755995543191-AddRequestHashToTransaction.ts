import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddRequestHashToTransaction1755995543191
  implements MigrationInterface
{
  name = 'AddRequestHashToTransaction1755995543191';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "tbl_transactions" ADD "request_hash" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "tbl_transactions" ADD CONSTRAINT "UQ_d4e4594a86489b455bbc063144b" UNIQUE ("request_hash")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "tbl_transactions" DROP CONSTRAINT "UQ_d4e4594a86489b455bbc063144b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tbl_transactions" DROP COLUMN "request_hash"`,
    );
  }
}
