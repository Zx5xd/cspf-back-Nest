export enum UserType {
  User = "user",
  Expert = "expert"
}

export enum ChatType {
  TEXT="text",
  IMG="img",
  FILE="file",
  PET="pet"
}

export interface User {
  nickname: string;
  profileImg: string;
  userCode: string;
}

export interface Pet {
  petName: string;
  ownerName: string;
  kindName: string;
  birthday: Date;
  gender: string;
  neuter: boolean;
}

export interface Chat {
  userType: UserType;
  msgType: ChatType;
  profile: User;
  msg: string | null;
  imgUrl: string | null;
  petMsg: Pet | null;
  date: Date;
}