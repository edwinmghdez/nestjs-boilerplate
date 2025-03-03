import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatePasswordResetTokensTable1739682365433 implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void>
  {
    await queryRunner.query(
      `CREATE TABLE \`password_reset_tokens\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`email\` varchar(255) NOT NULL,
        \`token\` varchar(255) NOT NULL,
        \`expiration_date\` datetime NULL,
        \`created_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`deleted_at\` datetime NULL,
        PRIMARY KEY (\`id\`)
      )`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void>
  {
    await queryRunner.query(`DROP TABLE \`password_reset_tokens\``);
  }
}
