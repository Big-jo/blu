import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTables1755971456399 implements MigrationInterface {
  name = 'AddTables1755971456399';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "tbl_transactions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "amount" numeric(10,2) NOT NULL, "type" character varying NOT NULL, "wallet_id" uuid NOT NULL, "nonce" character varying, "status" character varying NOT NULL DEFAULT 'FAILED', CONSTRAINT "UQ_bf1ba08d49f34c5c6f002d23522" UNIQUE ("nonce"), CONSTRAINT "PK_0c85ae27c391195235768d63c9a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "tbl_merchants" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "email" character varying NOT NULL, "api_key" character varying NOT NULL, "wallet_id" uuid, CONSTRAINT "UQ_287cb81efd96bb6b88851a63a84" UNIQUE ("email"), CONSTRAINT "UQ_21aba54f5b644c1f1e9b6530ece" UNIQUE ("api_key"), CONSTRAINT "REL_c2d59f634501863399ae997f29" UNIQUE ("wallet_id"), CONSTRAINT "PK_7a2bac0c94657c80c1891e429d5" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "tbl_wallets" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "balance" numeric(10,2) NOT NULL DEFAULT '0', CONSTRAINT "CHK_820851a4bc15fa57a0dbbb7aba" CHECK (balance >= 0), CONSTRAINT "PK_5040d8f6885dc614418216eabdd" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "tbl_customers" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "email" character varying NOT NULL, "merchant_id" uuid, "wallet_id" uuid NOT NULL, CONSTRAINT "UQ_afe57321295a8b45c0138130318" UNIQUE ("email"), CONSTRAINT "REL_8b17d193e160c0af68cc3270f6" UNIQUE ("wallet_id"), CONSTRAINT "PK_b4be48012ba704d9dd68114c270" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "tbl_transactions" ADD CONSTRAINT "FK_a4e03359fb2193a29959d82756e" FOREIGN KEY ("wallet_id") REFERENCES "tbl_wallets"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "tbl_merchants" ADD CONSTRAINT "FK_c2d59f634501863399ae997f290" FOREIGN KEY ("wallet_id") REFERENCES "tbl_wallets"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "tbl_customers" ADD CONSTRAINT "FK_b5091fe57aba43daab0ad7b572d" FOREIGN KEY ("merchant_id") REFERENCES "tbl_merchants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "tbl_customers" ADD CONSTRAINT "FK_8b17d193e160c0af68cc3270f60" FOREIGN KEY ("wallet_id") REFERENCES "tbl_wallets"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "tbl_customers" DROP CONSTRAINT "FK_8b17d193e160c0af68cc3270f60"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tbl_customers" DROP CONSTRAINT "FK_b5091fe57aba43daab0ad7b572d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tbl_merchants" DROP CONSTRAINT "FK_c2d59f634501863399ae997f290"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tbl_transactions" DROP CONSTRAINT "FK_a4e03359fb2193a29959d82756e"`,
    );
    await queryRunner.query(`DROP TABLE "tbl_customers"`);
    await queryRunner.query(`DROP TABLE "tbl_wallets"`);
    await queryRunner.query(`DROP TABLE "tbl_merchants"`);
    await queryRunner.query(`DROP TABLE "tbl_transactions"`);
  }
}
