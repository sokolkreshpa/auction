export interface IUsers {
  id?: number;
  userName?: string | null;
}

export class Users implements IUsers {
  constructor(public id?: number, public userName?: string | null) {}
}

export function getUsersIdentifier(users: IUsers): number | undefined {
  return users.id;
}
