import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../configs/config";

export const checkJwt = (req: Request, res: Response, next: NextFunction) => {
  try {
    let token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ message: "missing token" });
    }

    if (token.toLowerCase().startsWith("bearer")) {
      token = token.slice("bearer".length).trim();
    }

    const jwtPayload = jwt.verify(token, config.jwtSecret) as JwtPayload;

    res.locals.jwtPayload = jwtPayload;

    const { userId, username } = jwtPayload;

    const newToken = jwt.sign({ userId, username }, config.jwtSecret, {
      expiresIn: "1h",
    });
    res.setHeader("token", newToken);
  } catch (error) {
    res.status(401).send({ message: "Invalid token" });
    return;
  }

  next();
};
