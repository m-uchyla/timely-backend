import { MigrationInterface, QueryRunner } from "typeorm";

export class InitService1753793953069 implements MigrationInterface {
    name = 'InitService1753793953069'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "service" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying NOT NULL, "durationMinutes" integer NOT NULL, "pausePeriodMinutes" integer NOT NULL, "isActive" boolean NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "cost" numeric(10,2) NOT NULL, CONSTRAINT "PK_85a21558c006647cd76fdce044b" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "service"`);
    }

}
