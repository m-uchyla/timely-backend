import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitService1755090840041 implements MigrationInterface {
  public name = 'InitService1755090840041';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // First add the column as nullable
    await queryRunner.query(`ALTER TABLE "appointment" ADD "clientId" integer`);

    // Connect existing appointments to sample clients
    // Update appointments with clientId values (distributing clients across appointments)
    await queryRunner.query(`
      UPDATE "appointment" SET "clientId" = 1 WHERE "id" = 1;   -- Emily Rodriguez
      UPDATE "appointment" SET "clientId" = 2 WHERE "id" = 2;   -- James Thompson
      UPDATE "appointment" SET "clientId" = 3 WHERE "id" = 3;   -- Sophia Martinez
      UPDATE "appointment" SET "clientId" = 4 WHERE "id" = 4;   -- William Anderson
      UPDATE "appointment" SET "clientId" = 5 WHERE "id" = 5;   -- Olivia Taylor
      UPDATE "appointment" SET "clientId" = 6 WHERE "id" = 6;   -- Benjamin Moore
      UPDATE "appointment" SET "clientId" = 7 WHERE "id" = 7;   -- Ava Jackson
      UPDATE "appointment" SET "clientId" = 8 WHERE "id" = 8;   -- Lucas White
      UPDATE "appointment" SET "clientId" = 9 WHERE "id" = 9;   -- Isabella Harris
      UPDATE "appointment" SET "clientId" = 10 WHERE "id" = 10; -- Mason Clark
      UPDATE "appointment" SET "clientId" = 11 WHERE "id" = 11; -- Charlotte Lewis
      UPDATE "appointment" SET "clientId" = 12 WHERE "id" = 12; -- Ethan Robinson
      UPDATE "appointment" SET "clientId" = 13 WHERE "id" = 13; -- Amelia Walker
      UPDATE "appointment" SET "clientId" = 14 WHERE "id" = 14; -- Alexander Hall
      UPDATE "appointment" SET "clientId" = 15 WHERE "id" = 15; -- Harper Allen
      UPDATE "appointment" SET "clientId" = 16 WHERE "id" = 16; -- Sebastian Young
      UPDATE "appointment" SET "clientId" = 17 WHERE "id" = 17; -- Evelyn King
      UPDATE "appointment" SET "clientId" = 18 WHERE "id" = 18; -- Jack Wright
      UPDATE "appointment" SET "clientId" = 19 WHERE "id" = 19; -- Abigail Lopez
      UPDATE "appointment" SET "clientId" = 20 WHERE "id" = 20; -- Owen Hill
      UPDATE "appointment" SET "clientId" = 21 WHERE "id" = 21; -- Emma Scott
      UPDATE "appointment" SET "clientId" = 22 WHERE "id" = 22; -- Liam Green
      UPDATE "appointment" SET "clientId" = 23 WHERE "id" = 23; -- Mia Adams
      UPDATE "appointment" SET "clientId" = 24 WHERE "id" = 24; -- Noah Baker
      UPDATE "appointment" SET "clientId" = 25 WHERE "id" = 25; -- Grace Rivera
      UPDATE "appointment" SET "clientId" = 26 WHERE "id" = 26; -- Elijah Campbell
      UPDATE "appointment" SET "clientId" = 27 WHERE "id" = 27; -- Lily Mitchell
      UPDATE "appointment" SET "clientId" = 28 WHERE "id" = 28; -- Oliver Carter
      UPDATE "appointment" SET "clientId" = 29 WHERE "id" = 29; -- Zoe Phillips
      UPDATE "appointment" SET "clientId" = 30 WHERE "id" = 30; -- Aiden Evans
      
      -- For remaining appointments, create repeat customers by cycling through clients
      UPDATE "appointment" SET "clientId" = 1 WHERE "id" = 31;  -- Emily Rodriguez (repeat)
      UPDATE "appointment" SET "clientId" = 5 WHERE "id" = 32;  -- Olivia Taylor (repeat)
      UPDATE "appointment" SET "clientId" = 11 WHERE "id" = 33; -- Charlotte Lewis (repeat)
      UPDATE "appointment" SET "clientId" = 3 WHERE "id" = 34;  -- Sophia Martinez (repeat)
      UPDATE "appointment" SET "clientId" = 15 WHERE "id" = 35; -- Harper Allen (repeat)
      UPDATE "appointment" SET "clientId" = 8 WHERE "id" = 36;  -- Lucas White (repeat)
      UPDATE "appointment" SET "clientId" = 12 WHERE "id" = 37; -- Ethan Robinson (repeat)
      UPDATE "appointment" SET "clientId" = 7 WHERE "id" = 38;  -- Ava Jackson (repeat)
      UPDATE "appointment" SET "clientId" = 19 WHERE "id" = 39; -- Abigail Lopez (repeat)
      UPDATE "appointment" SET "clientId" = 14 WHERE "id" = 40; -- Alexander Hall (repeat)
      UPDATE "appointment" SET "clientId" = 22 WHERE "id" = 41; -- Liam Green (repeat)
      UPDATE "appointment" SET "clientId" = 9 WHERE "id" = 42;  -- Isabella Harris (repeat)
    `);

    // Handle any remaining appointments that might exist beyond ID 42
    // Assign client ID 1 to any remaining appointments that still have NULL clientId
    await queryRunner.query(`
      UPDATE "appointment" SET "clientId" = 1 
      WHERE "clientId" IS NULL;
    `);

    // Now make the column NOT NULL after all values are set
    await queryRunner.query(`ALTER TABLE "appointment" ALTER COLUMN "clientId" SET NOT NULL`);

    // Finally add the foreign key constraint
    await queryRunner.query(
      `ALTER TABLE "appointment" ADD CONSTRAINT "FK_60ac979e3cb15127f2221e3b66d" FOREIGN KEY ("clientId") REFERENCES "client"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "appointment" DROP CONSTRAINT "FK_60ac979e3cb15127f2221e3b66d"`,
    );
    await queryRunner.query(`ALTER TABLE "appointment" DROP COLUMN "clientId"`);
  }
}
