import { Request, Response } from "express";
import { AppDataSource } from "../configs/DataSource";
import { validate } from "class-validator";
import { User } from "../domain/entities/user";

// TODO: REFAC THIS MODULE TO HEXAGONAL ARCHITECTURE
class UserController {
  static listAll = async (req: Request, res: Response) => {
    //Get users from database
    const userRepository = AppDataSource.getRepository(User);
    const users = await userRepository.find({
      select: ["id", "username", "role"], //We dont want to send the passwords on response
    });

    //Send the users object
    res.send(users);
  };

  static getOneById = async (req: Request, res: Response) => {
    //Get the ID from the url

    //Get the user from database
    const userRepository = AppDataSource.getRepository(User);
    try {
      const id = parseInt(req.params.id);
      const user = await userRepository.findOneOrFail({
        select: ["id", "username", "role"],
        where: { id: id },
      });
    } catch (error) {
      res.status(404).send("User not found");
    }
  };

  static newUser = async (req: Request, res: Response) => {
    console.log("entrou");
    //Get parameters from the body
    const { username, password, role } = req.body;
    console.log(password);
    const user = new User();
    user.username = username;
    user.password = password;
    user.role = role;

    // Validade if the parameters are ok
    const errors = await validate(user);
    if (errors.length > 0) {
      res.status(400).send(errors);
      return;
    }

    //Hash the password, to securely store on DB
    user.hashPassword();

    //Try to save. If fails, the username is already in use
    const userRepository = AppDataSource.getRepository(User);
    try {
      await userRepository.save(user);
    } catch (e) {
      res.status(409).send(e);
      return;
    }

    //If all ok, send 201 response
    res.status(201).send("User created");
  };

  static editUser = async (req: Request, res: Response) => {
    //Get the ID from the url
    const id = req.params.id;

    //Get values from the body
    const { username, role } = req.body;

    //Try to find user on database
    const userRepository = AppDataSource.getRepository(User);
    let user;
    try {
      user = await userRepository.findOneOrFail({
        where: { id: parseInt(id) },
      });
    } catch (error) {
      //If not found, send a 404 response
      res.status(404).send("User not found");
      return;
    }

    //Validate the new values on model
    user.username = username;
    user.role = role;
    const errors = await validate(user);
    if (errors.length > 0) {
      res.status(400).send(errors);
      return;
    }

    //Try to safe, if fails, that means username already in use
    try {
      await userRepository.save(user);
    } catch (e) {
      res.status(409).send("username already in use");
      return;
    }
    //After all send a 204 (no content, but accepted) response
    res.status(204).send();
  };

  static deleteUser = async (req: Request, res: Response) => {
    //Get the ID from the url
    const id = req.params.id;

    const userRepository = AppDataSource.getRepository(User);
    let user: User;
    try {
      user = await userRepository.findOneOrFail({
        where: { id: parseInt(id) },
      });
    } catch (error) {
      res.status(404).send("User not found");
      return;
    }
    userRepository.delete(id);

    //After all send a 204 (no content, but accepted) response
    res.status(204).send();
  };
}

export default UserController;
