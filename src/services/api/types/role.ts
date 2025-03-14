export enum RoleEnum {
  ADMIN = 1,
  USER = 2,
  VENDOR = 3, 
  PREVENDOR = 4, 
}

export type Role = {
  id: number | string;
  name?: string;
};
