import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitService1755523983853 implements MigrationInterface {
  public name = 'InitService1755523983853';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // First, update any NULL appointmentDate values to a default date
    await queryRunner.query(
      `UPDATE "appointment" SET "appointmentDate" = CURRENT_DATE WHERE "appointmentDate" IS NULL`,
    );

    // Change the column type from timestamp to date, preserving existing data
    await queryRunner.query(
      `ALTER TABLE "appointment" ALTER COLUMN "appointmentDate" TYPE date USING "appointmentDate"::date`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "appointment" DROP COLUMN "appointmentDate"`);
    await queryRunner.query(`ALTER TABLE "appointment" ADD "appointmentDate" TIMESTAMP NOT NULL`);
  }
}
