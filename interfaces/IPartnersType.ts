import { RowDataPacket } from 'mysql2';

export default interface IPartnerType extends RowDataPacket {
  id: number;
  name: string;
}
