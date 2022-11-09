import { Request, Response, NextFunction } from "express";
import { AppDataSource } from "../configs/DataSource";
import { User } from "../domain/entities/user";

export const checkRole = (roles: Array<string>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const id = res.locals.jwtPayload.userId;

    //Get user role from the database
    const userRepository = AppDataSource.getRepository(User);
    let user: User;
    try {
      user = await userRepository.findOne({ where: { id: id } });
      if (!user) throw new Error();
    } catch (error) {
      res.status(401).send({ message: "user not found" });
      return;
    }

    //Check if array of authorized roles includes the user's role
    if (roles.indexOf(user.role) > -1) next();
    else res.status(403).send({ message: "missig necessary permissions" });
  };
};
