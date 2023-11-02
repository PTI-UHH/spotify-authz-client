import { AccessToken } from "@spotify/web-api-ts-sdk";

export enum UserState {
  LOGGED_IN = "LOGGED_IN",
  LOGGED_OUT = "LOGGED_OUT",
  CHANGED = "CHANGED",
}

export interface User {
  id?: string;
  email?: string;
  state?: UserState;
}

export interface UserDTO {
  id: string;
  active: boolean;
  accessToken?: AccessTokenDTO;
  createdAt: string;
  updatedAt: string;
}

export interface AccessTokenDTO extends Omit<AccessToken, "expires"> {
  expires: string;
  updatedAt: string;
}
