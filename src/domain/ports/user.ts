import { User } from "../../domain/entities/user";

export interface IUserRepository {
  //  Get user by username.
  getByUsername(username: string): Promise<User>;
  //  Get user by id.
  getById(id: number): Promise<User>;
  //  Create or Update user data.
  persistOrUpdate(user: User): Promise<void>;
}
