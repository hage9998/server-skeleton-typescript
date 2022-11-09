import { User } from "../../domain/entities/user";
import { IUserRepository } from "domain/ports/user";
import { injectable } from "tsyringe";
import { AppDataSource } from "../../configs/DataSource";

@injectable()
export class UserRepository implements IUserRepository {
  private repo = AppDataSource.getRepository(User);

  async getByUsername(username: string): Promise<User> {
    return await this.repo.findOne({ where: { username } });
  }
  async getById(id: number): Promise<User> {
    return await this.repo.findOne({ where: { id } });
  }
  async persistOrUpdate(user: User): Promise<void> {
    await this.repo.save(user);
  }
}
