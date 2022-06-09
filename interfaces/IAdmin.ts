import { RowDataPacket } from 'mysql2';

export default interface IAdmin extends RowDataPacket {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  password: string;
}
