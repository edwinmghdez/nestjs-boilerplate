import "reflect-metadata"
import { DataSource, DataSourceOptions } from "typeorm"
import * as dotenv from "dotenv";
import { SeederOptions } from "typeorm-extension";

dotenv.config();

let databaseOptionsAux: DataSourceOptions & SeederOptions;

databaseOptionsAux = {
  type: "mysql",
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: true,
  logging: false,
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: ['dist/db/migrations/*{.ts,.js}'],
  migrationsTableName: "migrations",
  seeds: ['dist/db/seeders/*{.ts,.js}']
}

const databaseOptions = databaseOptionsAux
const dataSource = new DataSource(databaseOptions)

export default dataSource
export { databaseOptions }
