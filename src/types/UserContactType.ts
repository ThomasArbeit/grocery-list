import type { UserType } from "./UserType";

export type UserContactType = UserType & {
  isContact: boolean;
  contactTableId: number | null; // ID from the contacts table
}