import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitService1755684872099 implements MigrationInterface {
  public name = 'InitService1755684872099';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Clear all existing data including users (complete fresh start)
    await queryRunner.query(`DELETE FROM "appointment"`);
    await queryRunner.query(`DELETE FROM "schedule"`);
    await queryRunner.query(`DELETE FROM "client"`);
    await queryRunner.query(`DELETE FROM "employee"`);
    await queryRunner.query(`DELETE FROM "service"`);
    await queryRunner.query(`DELETE FROM "organization"`);
    await queryRunner.query(`DELETE FROM "user"`);

    // Reset sequences
    await queryRunner.query(`ALTER SEQUENCE "user_id_seq" RESTART WITH 1`);
    await queryRunner.query(`ALTER SEQUENCE "organization_id_seq" RESTART WITH 1`);
    await queryRunner.query(`ALTER SEQUENCE "employee_id_seq" RESTART WITH 1`);
    await queryRunner.query(`ALTER SEQUENCE "service_id_seq" RESTART WITH 1`);
    await queryRunner.query(`ALTER SEQUENCE "client_id_seq" RESTART WITH 1`);
    await queryRunner.query(`ALTER SEQUENCE "schedule_id_seq" RESTART WITH 1`);
    await queryRunner.query(`ALTER SEQUENCE "appointment_id_seq" RESTART WITH 1`);

    // Remove circular dependency: drop organizationId from user table
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN IF EXISTS "organizationId"`);

    // Add new columns and update enum (now safe since appointments table is empty)
    await queryRunner.query(
      `ALTER TABLE "appointment" ADD "isArchived" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(`ALTER TABLE "appointment" ADD "organizationId" integer NOT NULL`);
    await queryRunner.query(
      `ALTER TYPE "public"."appointment_status_enum" RENAME TO "appointment_status_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."appointment_status_enum" AS ENUM('pending', 'confirmed', 'declined', 'cancelled')`,
    );
    await queryRunner.query(`ALTER TABLE "appointment" ALTER COLUMN "status" DROP DEFAULT`);
    await queryRunner.query(
      `ALTER TABLE "appointment" ALTER COLUMN "status" TYPE "public"."appointment_status_enum" USING "status"::"text"::"public"."appointment_status_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointment" ALTER COLUMN "status" SET DEFAULT 'pending'`,
    );
    await queryRunner.query(`DROP TYPE "public"."appointment_status_enum_old"`);
    await queryRunner.query(
      `ALTER TABLE "appointment" ADD CONSTRAINT "FK_a6aa4bd39d986f548d948017a41" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );

    // Create new owner user first
    await queryRunner.query(`
      INSERT INTO "user" ("id", "firstName", "lastName", "email", "password", "role", "isActive") VALUES
      (1, 'Admin', 'User', 'admin@timelysalon.com', '$2b$10$YourHashHere', 'owner', true);
    `);

    // Now we can safely create organization without circular dependency
    await queryRunner.query(`
      INSERT INTO "organization" ("id", "name", "description", "isActive", "ownerId") VALUES
      (1, 'Timely Salon & Spa', 'Premium beauty salon offering comprehensive hair, nail, and spa services', true, 1);
    `);

    // Create services (removed pausePeriodMinutes)
    await queryRunner.query(`
      INSERT INTO "service" ("id", "name", "description", "durationMinutes", "isActive", "cost", "organizationId") VALUES
      (1, 'Hair Cut & Style', 'Professional haircut with styling and blowdry', 60, true, 45.00, 1),
      (2, 'Hair Color & Highlights', 'Full color treatment with highlights and toner', 180, true, 120.00, 1),
      (3, 'Deep Tissue Massage', 'Therapeutic deep tissue massage therapy', 90, true, 85.00, 1),
      (4, 'Facial Treatment', 'Rejuvenating facial with skincare consultation', 75, true, 65.00, 1),
      (5, 'Manicure & Pedicure', 'Complete nail care with polish and hand massage', 60, true, 40.00, 1),
      (6, 'Eyebrow Shaping', 'Professional eyebrow styling and shaping', 30, true, 25.00, 1),
      (7, 'Relaxation Massage', 'Swedish massage for relaxation and stress relief', 60, true, 70.00, 1),
      (8, 'Bridal Package', 'Complete bridal beauty package with hair and makeup', 240, true, 200.00, 1);
    `);

    // Create employees
    await queryRunner.query(`
      INSERT INTO "employee" ("id", "firstName", "lastName", "isActive", "organizationId") VALUES
      (1, 'Sophia', 'Martinez', true, 1),
      (2, 'Isabella', 'Chen', true, 1),
      (3, 'Oliver', 'Thompson', true, 1),
      (4, 'Ava', 'Williams', true, 1);
    `);

    // Create clients
    await queryRunner.query(`
      INSERT INTO "client" ("id", "firstName", "lastName", "email", "phone", "organizationId") VALUES
      (1, 'Emma', 'Johnson', 'emma.johnson@email.com', '(555) 123-4567', 1),
      (2, 'Michael', 'Brown', 'michael.brown@email.com', '(555) 234-5678', 1),
      (3, 'Sarah', 'Davis', 'sarah.davis@email.com', '(555) 345-6789', 1),
      (4, 'David', 'Wilson', 'david.wilson@email.com', '(555) 456-7890', 1),
      (5, 'Lisa', 'Anderson', 'lisa.anderson@email.com', '(555) 567-8901', 1),
      (6, 'James', 'Taylor', 'james.taylor@email.com', '(555) 678-9012', 1),
      (7, 'Jennifer', 'Miller', 'jennifer.miller@email.com', '(555) 789-0123', 1),
      (8, 'Robert', 'Garcia', 'robert.garcia@email.com', '(555) 890-1234', 1),
      (9, 'Maria', 'Rodriguez', 'maria.rodriguez@email.com', '(555) 901-2345', 1),
      (10, 'Kevin', 'Martinez', 'kevin.martinez@email.com', '(555) 012-3456', 1),
      (11, 'Ashley', 'Thompson', 'ashley.thompson@email.com', '(555) 123-5678', 1),
      (12, 'Daniel', 'White', 'daniel.white@email.com', '(555) 234-6789', 1),
      (13, 'Nicole', 'Lopez', 'nicole.lopez@email.com', '(555) 345-7890', 1),
      (14, 'Christopher', 'Lee', 'christopher.lee@email.com', '(555) 456-8901', 1),
      (15, 'Amanda', 'Walker', 'amanda.walker@email.com', '(555) 567-9012', 1);
    `);

    // Create employee schedules (Monday=1, Sunday=7)
    await queryRunner.query(`
      INSERT INTO "schedule" ("id", "dayOfWeek", "startTime", "endTime", "isActive", "employeeId") VALUES
      -- Sophia Martinez - Monday to Saturday
      (1, 1, '09:00:00', '18:00:00', true, 1),
      (2, 2, '09:00:00', '18:00:00', true, 1),
      (3, 3, '09:00:00', '18:00:00', true, 1),
      (4, 4, '09:00:00', '18:00:00', true, 1),
      (5, 5, '09:00:00', '18:00:00', true, 1),
      (6, 6, '09:00:00', '16:00:00', true, 1),
      
      -- Isabella Chen - Monday to Saturday
      (7, 1, '09:00:00', '18:00:00', true, 2),
      (8, 2, '09:00:00', '18:00:00', true, 2),
      (9, 3, '09:00:00', '18:00:00', true, 2),
      (10, 4, '09:00:00', '18:00:00', true, 2),
      (11, 5, '09:00:00', '18:00:00', true, 2),
      (12, 6, '09:00:00', '16:00:00', true, 2),
      
      -- Oliver Thompson - Monday to Saturday
      (13, 1, '09:00:00', '18:00:00', true, 3),
      (14, 2, '09:00:00', '18:00:00', true, 3),
      (15, 3, '09:00:00', '18:00:00', true, 3),
      (16, 4, '09:00:00', '18:00:00', true, 3),
      (17, 5, '09:00:00', '18:00:00', true, 3),
      (18, 6, '09:00:00', '16:00:00', true, 3),
      
      -- Ava Williams - Monday to Saturday
      (19, 1, '09:00:00', '18:00:00', true, 4),
      (20, 2, '09:00:00', '18:00:00', true, 4),
      (21, 3, '09:00:00', '18:00:00', true, 4),
      (22, 4, '09:00:00', '18:00:00', true, 4),
      (23, 5, '09:00:00', '18:00:00', true, 4),
      (24, 6, '09:00:00', '16:00:00', true, 4);
    `);

    // Create month's worth of appointments (5-6 per day)
    let appointmentId = 1;
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const appointmentStatuses = ['confirmed', 'pending', 'declined'];
    const timeSlots = ['09:00:00', '10:30:00', '12:00:00', '14:00:00', '15:30:00', '17:00:00'];
    const endTimeMap = {
      '09:00:00': '10:00:00',
      '10:30:00': '11:30:00',
      '12:00:00': '13:00:00',
      '14:00:00': '15:00:00',
      '15:30:00': '16:30:00',
      '17:00:00': '18:00:00',
    };

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dayOfWeek = date.getDay(); // 0 = Sunday, 6 = Saturday

      // Skip Sundays (day 0)
      if (dayOfWeek === 0) {
        continue;
      }

      // Saturday has fewer appointments (3-4), weekdays have 5-6
      const numAppointments = Math.floor(Math.random() * 2) + (dayOfWeek === 6 ? 3 : 5);

      const dateString = date.toISOString().split('T')[0];

      for (let i = 0; i < numAppointments; i++) {
        const clientId = Math.floor(Math.random() * 15) + 1;
        const employeeId = Math.floor(Math.random() * 4) + 1;
        const serviceId = Math.floor(Math.random() * 8) + 1;
        const status = appointmentStatuses[Math.floor(Math.random() * appointmentStatuses.length)];
        const startTime = timeSlots[i % timeSlots.length];
        const endTime = endTimeMap[startTime];

        // Add some cancelled appointments (5% chance)
        const finalStatus = Math.random() < 0.05 ? 'cancelled' : status;
        let cancellationReason: string | null = null;
        if (finalStatus === 'cancelled') {
          cancellationReason =
            Math.random() < 0.5 ? 'Client requested cancellation' : 'Employee unavailable';
        }

        await queryRunner.query(`
          INSERT INTO "appointment" ("id", "appointmentDate", "startTime", "endTime", "status", "isArchived", "cancellationReason", "price", "employeeId", "serviceId", "clientId", "organizationId") 
          VALUES (${appointmentId}, '${dateString}', '${startTime}', '${endTime}', '${finalStatus}', false, ${cancellationReason ? `'${cancellationReason}'` : 'NULL'}, 50.00, ${employeeId}, ${serviceId}, ${clientId}, 1)
        `);
        appointmentId++;
      }
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Restore organizationId column to user table
    await queryRunner.query(`ALTER TABLE "user" ADD COLUMN "organizationId" integer`);

    // Remove foreign key constraint
    await queryRunner.query(
      `ALTER TABLE "appointment" DROP CONSTRAINT "FK_a6aa4bd39d986f548d948017a41"`,
    );

    // Revert enum changes
    await queryRunner.query(
      `CREATE TYPE "public"."appointment_status_enum_old" AS ENUM('pending', 'confirmed', 'declined', 'cancelled', 'archived')`,
    );
    await queryRunner.query(`ALTER TABLE "appointment" ALTER COLUMN "status" DROP DEFAULT`);
    await queryRunner.query(
      `ALTER TABLE "appointment" ALTER COLUMN "status" TYPE "public"."appointment_status_enum_old" USING "status"::"text"::"public"."appointment_status_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointment" ALTER COLUMN "status" SET DEFAULT 'pending'`,
    );
    await queryRunner.query(`DROP TYPE "public"."appointment_status_enum"`);
    await queryRunner.query(
      `ALTER TYPE "public"."appointment_status_enum_old" RENAME TO "appointment_status_enum"`,
    );

    // Remove new columns
    await queryRunner.query(`ALTER TABLE "appointment" DROP COLUMN "organizationId"`);
    await queryRunner.query(`ALTER TABLE "appointment" DROP COLUMN "isArchived"`);
  }
}
