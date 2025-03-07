import { User } from "src/modules/users/entities/user.entity";
import { hashPassword } from "src/utils/password-hashing";
import { DataSource } from "typeorm";
import { Seeder } from "typeorm-extension";

export class UserSeeder implements Seeder
{
  public async run(
    dataSource: DataSource,
  ): Promise<any> {
    const repository = dataSource.getRepository(User);
    await repository.insert([
      {
        name: 'Admin',
        last_name: 'Administrator',
        email: 'admin@example.com',
        password: await hashPassword('admin'),
        is_two_factor_enabled: false
      }
    ]);
  }
}