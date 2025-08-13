import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitService1755090662292 implements MigrationInterface {
  public name = 'InitService1755090662292';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "client" ("id" SERIAL NOT NULL, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "email" character varying, "phone" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "lastModifiedAt" TIMESTAMP NOT NULL DEFAULT now(), "organizationId" integer NOT NULL, CONSTRAINT "PK_96da49381769303a6515a8785c7" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD CONSTRAINT "FK_c4f67520c0f472fbfac29b33fb2" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );

    // Insert sample clients for Elite Beauty Salon (organizationId: 1)
    await queryRunner.query(
      `INSERT INTO "client" ("firstName", "lastName", "email", "phone", "organizationId") VALUES 
       ('Emily', 'Rodriguez', 'emily.rodriguez@email.com', '+1-555-0101', 1),
       ('James', 'Thompson', 'james.thompson@email.com', '+1-555-0102', 1),
       ('Sophia', 'Martinez', 'sophia.martinez@email.com', '+1-555-0103', 1),
       ('William', 'Anderson', 'william.anderson@email.com', '+1-555-0104', 1),
       ('Olivia', 'Taylor', 'olivia.taylor@email.com', '+1-555-0105', 1),
       ('Benjamin', 'Moore', 'benjamin.moore@email.com', '+1-555-0106', 1),
       ('Ava', 'Jackson', 'ava.jackson@email.com', '+1-555-0107', 1),
       ('Lucas', 'White', 'lucas.white@email.com', '+1-555-0108', 1),
       ('Isabella', 'Harris', 'isabella.harris@email.com', '+1-555-0109', 1),
       ('Mason', 'Clark', 'mason.clark@email.com', '+1-555-0110', 1),
       ('Charlotte', 'Lewis', 'charlotte.lewis@email.com', '+1-555-0111', 1),
       ('Ethan', 'Robinson', 'ethan.robinson@email.com', '+1-555-0112', 1),
       ('Amelia', 'Walker', 'amelia.walker@email.com', '+1-555-0113', 1),
       ('Alexander', 'Hall', 'alexander.hall@email.com', '+1-555-0114', 1),
       ('Harper', 'Allen', 'harper.allen@email.com', '+1-555-0115', 1),
       ('Sebastian', 'Young', 'sebastian.young@email.com', '+1-555-0116', 1),
       ('Evelyn', 'King', 'evelyn.king@email.com', '+1-555-0117', 1),
       ('Jack', 'Wright', 'jack.wright@email.com', '+1-555-0118', 1),
       ('Abigail', 'Lopez', 'abigail.lopez@email.com', '+1-555-0119', 1),
       ('Owen', 'Hill', 'owen.hill@email.com', '+1-555-0120', 1),
       ('Emma', 'Scott', 'emma.scott@email.com', '+1-555-0121', 1),
       ('Liam', 'Green', 'liam.green@email.com', '+1-555-0122', 1),
       ('Mia', 'Adams', 'mia.adams@email.com', '+1-555-0123', 1),
       ('Noah', 'Baker', 'noah.baker@email.com', '+1-555-0124', 1),
       ('Grace', 'Rivera', 'grace.rivera@email.com', '+1-555-0125', 1),
       ('Elijah', 'Campbell', 'elijah.campbell@email.com', '+1-555-0126', 1),
       ('Lily', 'Mitchell', 'lily.mitchell@email.com', '+1-555-0127', 1),
       ('Oliver', 'Carter', 'oliver.carter@email.com', '+1-555-0128', 1),
       ('Zoe', 'Phillips', 'zoe.phillips@email.com', '+1-555-0129', 1),
       ('Aiden', 'Evans', 'aiden.evans@email.com', '+1-555-0130', 1)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "client" DROP CONSTRAINT "FK_c4f67520c0f472fbfac29b33fb2"`,
    );
    await queryRunner.query(`DROP TABLE "client"`);
  }
}
