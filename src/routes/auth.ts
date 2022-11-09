import { Router } from "express";
import { checkJwt } from "../middlewares/checkJwt";
import {
  AuthLoginHandler,
  AuthLoginRequest,
  AuthChangePassHandler,
  AuthChangePassRequest,
} from "../handlers/authentication/AuthHandlers";
import { inject, injectable } from "tsyringe";

@injectable()
class AuthRoutes {
  public router = Router();
  private authLoginHandler: AuthLoginHandler;
  private authChangePassHandler: AuthChangePassHandler;

  constructor(
    @inject(AuthChangePassHandler) authChangePassHandler: AuthChangePassHandler,
    @inject(AuthLoginHandler) authLoginHandler: AuthLoginHandler
  ) {
    this.authChangePassHandler = authChangePassHandler;
    this.authLoginHandler = authLoginHandler;
    this.intializeRoutes();
  }

  private intializeRoutes(): void {
    //Login route
    this.router.post("/login", async (req, res, next) => {
      try {
        const request = req.body as AuthLoginRequest;
        const response = await this.authLoginHandler.execute(request);

        res.status(200).json({ authorization: response.token });
      } catch (error) {
        next(error);
      }
    });
    //Change my password
    this.router.post("/change-password", [checkJwt], async (req, res, next) => {
      try {
        const request = req.body as AuthChangePassRequest;
        await this.authChangePassHandler.execute(request);

        res.status(204);
      } catch (error) {
        next(error);
      }
    });
  }
}

export default AuthRoutes;
