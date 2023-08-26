import { User } from "./user.interface";

export interface LoginResponseRegister {
  user: User;
  token: string;
}
