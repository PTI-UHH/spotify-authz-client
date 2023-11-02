import { AccessToken } from "@spotify/web-api-ts-sdk";

export interface User {
  id?: string;
  email?: string;
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
