import { RowDataPacket } from 'mysql2';

export default interface IFamilyMember extends RowDataPacket {
  id: number;
  idFamily: number;
  firstname: string;
  birthday: string;
  avatar?: string;
}
