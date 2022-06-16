import { RowDataPacket } from 'mysql2';

export default interface IFamily extends RowDataPacket {
  id: number;
  name: string;
  streetNumber: number;
  address: string;
  phoneNumber: number;
  email: string;
  password: string;
  idCity: number;
  idRecipient: number;
  isActive: number;
}
