import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';
import { Employee } from './modules/Employees/Employee.entity';
import { Organization } from './modules/Organizations/Organization.entity';
import { Service } from './modules/Services/Service.entity';
import { User } from './modules/Users/User.entity';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT ?? '5432'),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [Service, Organization, Employee, User], // lub: [__dirname + '/**/*.entity{.ts,.js}']
  migrations: [`${__dirname}/migrations/*{.ts,.js}`],
  synchronize: false,
  logging: true,
});
