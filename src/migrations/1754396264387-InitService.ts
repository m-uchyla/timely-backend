import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitService1754396264387 implements MigrationInterface {
  public name = 'InitService1754396264387';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create ENUM types first
    await queryRunner.query(
      `CREATE TYPE "public"."user_role_enum" AS ENUM('admin', 'owner', 'user')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."appointment_status_enum" AS ENUM('pending', 'confirmed', 'declined', 'cancelled')`,
    );

    await queryRunner.query(
      `CREATE TABLE "user" ("id" SERIAL NOT NULL, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "role" "public"."user_role_enum" NOT NULL DEFAULT 'user', "isActive" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "organizationId" integer, "lastModifiedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "REL_dfda472c0af7812401e592b6a6" UNIQUE ("organizationId"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "organization" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying, "isActive" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "lastModifiedAt" TIMESTAMP NOT NULL DEFAULT now(), "ownerId" integer NOT NULL, CONSTRAINT "PK_472c1f99a32def1b0abb219cd67" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "employee" ("id" SERIAL NOT NULL, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "isActive" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "lastModifiedAt" TIMESTAMP NOT NULL DEFAULT now(), "organizationId" integer NOT NULL, CONSTRAINT "PK_3c2bc72f03fd5abbbc5ac169498" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "service" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying, "durationMinutes" integer NOT NULL, "pausePeriodMinutes" integer NOT NULL DEFAULT '0', "isActive" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "lastModifiedAt" TIMESTAMP NOT NULL DEFAULT now(), "cost" numeric(10,2), "organizationId" integer NOT NULL, CONSTRAINT "PK_85a21558c006647cd76fdce044b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "appointment" ("id" SERIAL NOT NULL, "appointmentDate" TIMESTAMP NOT NULL, "startTime" TIME NOT NULL, "endTime" TIME NOT NULL, "status" "public"."appointment_status_enum" NOT NULL DEFAULT 'pending', "notes" character varying, "cancellationReason" character varying, "price" numeric(10,2), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "lastModifiedAt" TIMESTAMP NOT NULL DEFAULT now(), "employeeId" integer NOT NULL, "serviceId" integer NOT NULL, CONSTRAINT "PK_e8be1a53027415e709ce8a2db74" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "schedule" ("id" SERIAL NOT NULL, "dayOfWeek" integer NOT NULL, "startTime" TIME NOT NULL, "endTime" TIME NOT NULL, "isActive" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "lastModifiedAt" TIMESTAMP NOT NULL DEFAULT now(), "employeeId" integer NOT NULL, CONSTRAINT "PK_1c05e42aec7371641193e180046" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_dfda472c0af7812401e592b6a61" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization" ADD CONSTRAINT "FK_67c515257c7a4bc221bb1857a39" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "employee" ADD CONSTRAINT "FK_c6a48286f3aa8ae903bee0d1e72" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "service" ADD CONSTRAINT "FK_dabc966ec52db442703a990a921" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointment" ADD CONSTRAINT "FK_b6e57758a28acd843878b1f30d8" FOREIGN KEY ("employeeId") REFERENCES "employee"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointment" ADD CONSTRAINT "FK_cee8b55c31f700609674da96b0b" FOREIGN KEY ("serviceId") REFERENCES "service"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "schedule" ADD CONSTRAINT "FK_b81737400cce9875401177fd48b" FOREIGN KEY ("employeeId") REFERENCES "employee"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );

    // Insert seed data
    // 1. Insert owner user (ID: 1)
    await queryRunner.query(
      `INSERT INTO "user" ("firstName", "lastName", "email", "password", "role") VALUES ('John', 'Smith', 'john.smith@timelyapp.com', '$2b$10$CwTycUXWue0Thq9StjUM0uJ3lIcmOJvDLcX/yQe1bONQ.ZGRCwKM6', 'owner')`,
    );

    // 2. Insert organization (ID: 1) with ownerId: 1
    await queryRunner.query(
      `INSERT INTO "organization" ("name", "description", "ownerId") VALUES ('Elite Beauty Salon', 'A premium beauty salon offering comprehensive hair, nail, and spa services', 1)`,
    );

    // 3. Update user to link to organization
    await queryRunner.query(`UPDATE "user" SET "organizationId" = 1 WHERE "id" = 1`);

    // 4. Insert employees (IDs: 1-4)
    await queryRunner.query(
      `INSERT INTO "employee" ("firstName", "lastName", "organizationId") VALUES 
       ('Sarah', 'Johnson', 1),
       ('Michael', 'Brown', 1),
       ('Emma', 'Davis', 1),
       ('David', 'Wilson', 1)`,
    );

    // 5. Insert services (IDs: 1-8)
    await queryRunner.query(
      `INSERT INTO "service" ("name", "description", "durationMinutes", "pausePeriodMinutes", "cost", "organizationId") VALUES 
       ('Classic Haircut', 'Professional haircut with wash and style', 60, 15, 45.00, 1),
       ('Hair Coloring', 'Full hair coloring service with consultation', 150, 30, 120.00, 1),
       ('Manicure', 'Classic manicure with nail polish', 45, 10, 35.00, 1),
       ('Pedicure', 'Relaxing pedicure with foot massage', 60, 15, 50.00, 1),
       ('Facial Treatment', 'Deep cleansing facial with moisturizer', 90, 20, 80.00, 1),
       ('Eyebrow Shaping', 'Professional eyebrow threading and shaping', 30, 10, 25.00, 1),
       ('Hair Styling', 'Special event hair styling', 75, 15, 65.00, 1),
       ('Gel Manicure', 'Long-lasting gel manicure', 60, 10, 55.00, 1)`,
    );

    // 6. Insert schedules for employees (multiple days per employee)
    await queryRunner.query(
      `INSERT INTO "schedule" ("dayOfWeek", "startTime", "endTime", "employeeId") VALUES 
       -- Sarah Johnson (Employee ID: 1) - Monday to Friday
       (1, '09:00:00', '17:00:00', 1),
       (2, '09:00:00', '17:00:00', 1),
       (3, '09:00:00', '17:00:00', 1),
       (4, '09:00:00', '17:00:00', 1),
       (5, '09:00:00', '15:00:00', 1),
       -- Michael Brown (Employee ID: 2) - Tuesday to Saturday
       (2, '10:00:00', '18:00:00', 2),
       (3, '10:00:00', '18:00:00', 2),
       (4, '10:00:00', '18:00:00', 2),
       (5, '10:00:00', '18:00:00', 2),
       (6, '09:00:00', '16:00:00', 2),
       -- Emma Davis (Employee ID: 3) - Monday to Friday
       (1, '08:30:00', '16:30:00', 3),
       (2, '08:30:00', '16:30:00', 3),
       (3, '08:30:00', '16:30:00', 3),
       (4, '08:30:00', '16:30:00', 3),
       (5, '08:30:00', '14:30:00', 3),
       -- David Wilson (Employee ID: 4) - Wednesday to Sunday
       (3, '11:00:00', '19:00:00', 4),
       (4, '11:00:00', '19:00:00', 4),
       (5, '11:00:00', '19:00:00', 4),
       (6, '10:00:00', '18:00:00', 4),
       (7, '10:00:00', '16:00:00', 4)`,
    );

    // 7. Insert appointments (many appointments across different dates, employees, and services)
    await queryRunner.query(
      `INSERT INTO "appointment" ("appointmentDate", "startTime", "endTime", "status", "notes", "price", "employeeId", "serviceId") VALUES 
       -- Appointments for this week
       ('2025-08-11', '09:00:00', '10:00:00', 'confirmed', 'Regular customer, prefers shorter layers', 45.00, 1, 1),
       ('2025-08-11', '10:15:00', '12:45:00', 'confirmed', 'Going from brown to blonde', 120.00, 1, 2),
       ('2025-08-11', '13:00:00', '13:45:00', 'confirmed', 'French manicure requested', 35.00, 3, 3),
       ('2025-08-11', '14:00:00', '15:00:00', 'pending', 'First-time client', 50.00, 3, 4),
       ('2025-08-11', '15:15:00', '16:45:00', 'confirmed', 'Sensitive skin, use gentle products', 80.00, 3, 5),
       
       ('2025-08-12', '10:00:00', '11:00:00', 'confirmed', 'Trim only, no styling needed', 45.00, 2, 1),
       ('2025-08-12', '11:15:00', '12:00:00', 'confirmed', 'Special event tomorrow', 35.00, 2, 3),
       ('2025-08-12', '14:00:00', '15:15:00', 'confirmed', 'Wedding guest styling', 65.00, 1, 7),
       ('2025-08-12', '15:30:00', '16:00:00', 'pending', 'Maintenance appointment', 25.00, 3, 6),
       ('2025-08-12', '16:15:00', '17:15:00', 'confirmed', 'Gel removal and new application', 55.00, 3, 8),
       
       ('2025-08-13', '08:30:00', '09:30:00', 'confirmed', 'Early appointment before work', 45.00, 3, 1),
       ('2025-08-13', '11:00:00', '12:30:00', 'confirmed', 'Anniversary dinner styling', 65.00, 4, 7),
       ('2025-08-13', '13:00:00', '14:30:00', 'pending', 'Color consultation needed', 80.00, 1, 5),
       ('2025-08-13', '15:00:00', '16:00:00', 'confirmed', 'Regular pedicure client', 50.00, 2, 4),
       ('2025-08-13', '16:15:00', '17:00:00', 'confirmed', 'Express manicure', 35.00, 2, 3),
       
       ('2025-08-14', '09:00:00', '11:30:00', 'confirmed', 'Root touch-up and gloss', 120.00, 1, 2),
       ('2025-08-14', '12:00:00', '13:00:00', 'confirmed', 'Business presentation styling', 65.00, 2, 7),
       ('2025-08-14', '13:15:00', '14:00:00', 'pending', 'Eyebrow maintenance', 25.00, 3, 6),
       ('2025-08-14', '14:15:00', '15:15:00', 'confirmed', 'Spa pedicure upgrade', 50.00, 3, 4),
       ('2025-08-14', '15:30:00', '17:00:00', 'confirmed', 'Deep hydrating facial', 80.00, 1, 5),
       
       ('2025-08-15', '09:00:00', '10:00:00', 'confirmed', 'Quick trim before weekend', 45.00, 1, 1),
       ('2025-08-15', '10:15:00', '11:00:00', 'confirmed', 'Gel manicure for vacation', 55.00, 3, 8),
       ('2025-08-15', '11:15:00', '12:15:00', 'pending', 'Last-minute booking', 50.00, 2, 4),
       ('2025-08-15', '12:30:00', '13:00:00', 'confirmed', 'Eyebrow touch-up', 25.00, 3, 6),
       
       -- Weekend appointments
       ('2025-08-16', '09:00:00', '10:15:00', 'confirmed', 'Saturday special styling', 65.00, 2, 7),
       ('2025-08-16', '10:30:00', '11:30:00', 'confirmed', 'Weekend relaxation', 50.00, 2, 4),
       ('2025-08-16', '12:00:00', '13:30:00', 'pending', 'Color consultation', 80.00, 4, 5),
       ('2025-08-16', '14:00:00', '15:00:00', 'confirmed', 'Maintenance cut', 45.00, 4, 1),
       ('2025-08-16', '15:15:00', '16:00:00', 'confirmed', 'Manicure appointment', 35.00, 2, 3),
       
       ('2025-08-17', '10:00:00', '11:00:00', 'pending', 'Sunday appointment', 45.00, 4, 1),
       ('2025-08-17', '11:15:00', '12:45:00', 'confirmed', 'Special occasion styling', 65.00, 4, 7),
       ('2025-08-17', '13:00:00', '14:00:00', 'confirmed', 'Sunday pedicure', 50.00, 4, 4),
       
       -- Next week appointments  
       ('2025-08-18', '09:00:00', '10:00:00', 'pending', 'Monday morning appointment', 45.00, 1, 1),
       ('2025-08-18', '10:15:00', '11:00:00', 'pending', 'Weekly manicure', 35.00, 3, 3),
       ('2025-08-18', '14:00:00', '15:30:00', 'pending', 'Monthly facial', 80.00, 1, 5),
       ('2025-08-18', '16:00:00', '17:00:00', 'pending', 'End of day pedicure', 50.00, 3, 4),
       
       ('2025-08-19', '10:00:00', '12:30:00', 'pending', 'Full color change', 120.00, 2, 2),
       ('2025-08-19', '13:00:00', '14:15:00', 'pending', 'Special event styling', 65.00, 1, 7),
       ('2025-08-19', '14:30:00', '15:30:00', 'pending', 'Relaxing pedicure', 50.00, 2, 4),
       ('2025-08-19', '15:45:00', '16:45:00', 'pending', 'Gel manicure appointment', 55.00, 3, 8),
       
       ('2025-08-20', '08:30:00', '09:30:00', 'pending', 'Early bird appointment', 45.00, 3, 1),
       ('2025-08-20', '11:00:00', '12:00:00', 'pending', 'Mid-week touch-up', 25.00, 4, 6),
       ('2025-08-20', '13:00:00', '14:30:00', 'pending', 'Consultation and treatment', 80.00, 1, 5),
       ('2025-08-20', '15:00:00', '16:00:00', 'pending', 'Regular maintenance', 50.00, 2, 4)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "schedule" DROP CONSTRAINT "FK_b81737400cce9875401177fd48b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointment" DROP CONSTRAINT "FK_cee8b55c31f700609674da96b0b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointment" DROP CONSTRAINT "FK_b6e57758a28acd843878b1f30d8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "service" DROP CONSTRAINT "FK_dabc966ec52db442703a990a921"`,
    );
    await queryRunner.query(
      `ALTER TABLE "employee" DROP CONSTRAINT "FK_c6a48286f3aa8ae903bee0d1e72"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization" DROP CONSTRAINT "FK_67c515257c7a4bc221bb1857a39"`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_dfda472c0af7812401e592b6a61"`);
    await queryRunner.query(`DROP TABLE "schedule"`);
    await queryRunner.query(`DROP TABLE "appointment"`);
    await queryRunner.query(`DROP TABLE "service"`);
    await queryRunner.query(`DROP TABLE "employee"`);
    await queryRunner.query(`DROP TABLE "organization"`);
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TYPE "public"."appointment_status_enum"`);
    await queryRunner.query(`DROP TYPE "public"."user_role_enum"`);
  }
}
