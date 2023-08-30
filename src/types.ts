export enum UserState {
  LOGGED_IN = "LOGGED_IN",
  LOGGED_OUT = "LOGGED_OUT",
  CHANGED = "CHANGED",
}

export type User = { id: string | null; state: UserState };
