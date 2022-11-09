import { Router } from "express";
import UserController from "../handlers/UserController";
import { checkJwt } from "../middlewares/checkJwt";
import { checkRole } from "../middlewares/checkRole";

// TODO: REFAC THIS MODULE TO HEXAGONAL ARCHITECTURE
class UserRoutes {
  public router = Router();

  constructor() {
    this.intializeRoutes();
  }

  private intializeRoutes(): void {
    //Get all users
    this.router.get(
      "/",
      checkJwt,
      checkRole(["ADMIN"]),
      UserController.listAll
    );

    // Get one user
    this.router.get(
      "/:id([0-9]+)",
      [checkJwt, checkRole(["ADMIN"])],
      UserController.getOneById
    );

    //Create a new user
    this.router.post("/", UserController.newUser);

    //Edit one user
    this.router.patch(
      "/:id([0-9]+)",
      [checkJwt, checkRole(["ADMIN"])],
      UserController.editUser
    );

    //Delete one user
    this.router.delete(
      "/:id([0-9]+)",
      [checkJwt, checkRole(["ADMIN"])],
      UserController.deleteUser
    );
  }
}

export default UserRoutes;
