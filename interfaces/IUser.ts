import { RowDataPacket } from 'mysql2';

export default interface IUser extends RowDataPacket {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  streetNumber: number;
  address: string;
  zipCode: number;
  city: string;
  phoneNumber: number;
  isAdmin: boolean;
  isIntervenant: boolean;
  isAdherent: boolean;
}
