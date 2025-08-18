import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitService1755524369277 implements MigrationInterface {
  public name = 'InitService1755524369277';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // First, update any NULL appointmentDate values to a default date
    await queryRunner.query(
      `UPDATE "appointment" SET "appointmentDate" = CURRENT_DATE WHERE "appointmentDate" IS NULL`,
    );

    // Add a temporary column to store the string version
    await queryRunner.query(
      `ALTER TABLE "appointment" ADD "appointmentDate_temp" character varying(10)`,
    );

    // Convert existing date values to string format (YYYY-MM-DD)
    await queryRunner.query(
      `UPDATE "appointment" SET "appointmentDate_temp" = "appointmentDate"::text`,
    );

    // Drop the old date column
    await queryRunner.query(`ALTER TABLE "appointment" DROP COLUMN "appointmentDate"`);

    // Rename the temp column to the original name
    await queryRunner.query(
      `ALTER TABLE "appointment" RENAME COLUMN "appointmentDate_temp" TO "appointmentDate"`,
    );

    // Make it NOT NULL
    await queryRunner.query(
      `ALTER TABLE "appointment" ALTER COLUMN "appointmentDate" SET NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Add a temporary column to store the date version
    await queryRunner.query(`ALTER TABLE "appointment" ADD "appointmentDate_temp" date`);

    // Convert existing string values back to date format
    await queryRunner.query(
      `UPDATE "appointment" SET "appointmentDate_temp" = "appointmentDate"::date`,
    );

    // Drop the string column
    await queryRunner.query(`ALTER TABLE "appointment" DROP COLUMN "appointmentDate"`);

    // Rename the temp column to the original name
    await queryRunner.query(
      `ALTER TABLE "appointment" RENAME COLUMN "appointmentDate_temp" TO "appointmentDate"`,
    );

    // Make it NOT NULL
    await queryRunner.query(
      `ALTER TABLE "appointment" ALTER COLUMN "appointmentDate" SET NOT NULL`,
    );
  }
}
