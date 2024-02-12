/// <reference types="vite/client" />

type UserDataType = {
  age: number;
  email: string;
  name: string;
  gender: string;
  _id: string;
};
type TotalUsersDataType = { data: UserDataType[]; count: number };
