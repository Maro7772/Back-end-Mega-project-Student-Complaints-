import { IUser } from "../Types/Interfaces";

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}