import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUsersTable1737345626751 implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void>
  {
    await queryRunner.query(
      `CREATE TABLE \`users\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`name\` varchar(255) NOT NULL,
        \`last_name\` varchar(255) NOT NULL,
        \`email\` varchar(255) NOT NULL UNIQUE,
        \`email_verified_at\` datetime NULL,
        \`password\` varchar(255) NOT NULL,
        \`is_two_factor_enabled\` tinyint(1) NOT NULL DEFAULT 0,
        \`two_factor_secret\` varchar(255) NULL,
        \`created_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`updated_at\` datetime NULL ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`)
      )`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void>
  {
    await queryRunner.query(`DROP TABLE \`users\``);
  }
}
