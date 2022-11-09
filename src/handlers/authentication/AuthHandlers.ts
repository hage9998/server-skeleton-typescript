import * as jwt from "jsonwebtoken";
import { validate } from "class-validator";
import { User } from "../../domain/entities/user";
import config from "../../configs/config";
import { Handler } from "commons/handler";
import { inject, injectable } from "tsyringe";
import { HttpException } from "../../commons/errors";
import { StatusCodes } from "http-status-codes";
import { IUserRepository } from "domain/ports/user";

export type AuthLoginRequest = {
  username: string;
  password: string;
};

export type AuthLoginResponse = {
  token: string;
};

@injectable()
export class AuthLoginHandler
  implements Handler<AuthLoginRequest, Promise<AuthLoginResponse>>
{
  private userRepo: IUserRepository;
  constructor(@inject("UserRepository") userRepo: IUserRepository) {
    this.userRepo = userRepo;
  }
  async execute(request: AuthLoginRequest): Promise<AuthLoginResponse> {
    const { username, password } = request;

    if (!(username && password))
      throw new HttpException(
        StatusCodes.BAD_REQUEST,
        "missing username or password"
      );

    const user: User = await this.userRepo.getByUsername(username);

    if (!user)
      throw new HttpException(
        StatusCodes.UNAUTHORIZED,
        "username or password incorrect"
      );

    // Check if encrypted password match
    if (!user.checkIfUnencryptedPasswordIsValid(password))
      throw new HttpException(
        StatusCodes.UNAUTHORIZED,
        "username or password incorrect"
      );

    //Sing JWT, valid for 1 hour
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      config.jwtSecret,
      { expiresIn: "1h" }
    );

    return { token };
  }
}

export type AuthChangePassRequest = {
  userId: number;
  oldPassword: string;
  newPassword: string;
};

export type AuthChangePassResponse = void;

@injectable()
export class AuthChangePassHandler
  implements Handler<AuthChangePassRequest, Promise<AuthChangePassResponse>>
{
  private userRepo: IUserRepository;
  constructor(@inject("UserRepository") userRepo: IUserRepository) {
    this.userRepo = userRepo;
  }

  async execute(request: AuthChangePassRequest): Promise<void> {
    const { userId, oldPassword, newPassword } = request;

    //Get parameters from the body
    if (!(oldPassword && newPassword))
      throw new HttpException(StatusCodes.BAD_REQUEST, "missing parameters");

    const user: User = await this.userRepo.getById(userId);
    if (!user)
      throw new HttpException(StatusCodes.UNAUTHORIZED, "user not found");

    //Check if old password matchs
    if (!user.checkIfUnencryptedPasswordIsValid(oldPassword))
      throw new HttpException(
        StatusCodes.UNAUTHORIZED,
        "old password incorrect"
      );

    //Validate de model (password lenght)
    user.password = newPassword;
    const errors = await validate(user);
    if (errors.length > 0)
      throw new HttpException(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "problems with user"
      );
    //Hash the new password and save
    user.hashPassword();
    this.userRepo.persistOrUpdate(user);
  }
}
