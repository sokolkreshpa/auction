import { IBid } from 'app/entities/bid/bid.model';

export interface IUsers {
  id?: number;
  username?: string | null;
  name?: string | null;
  surname?: string | null;
  tel?: string | null;
  email?: string | null;
  ssn?: string | null;
  status?: string | null;
  id?: IBid | null;
}

export class Users implements IUsers {
  constructor(
    public id?: number,
    public username?: string | null,
    public name?: string | null,
    public surname?: string | null,
    public tel?: string | null,
    public email?: string | null,
    public ssn?: string | null,
    public status?: string | null,
    public id?: IBid | null
  ) {}
}

export function getUsersIdentifier(users: IUsers): number | undefined {
  return users.id;
}
