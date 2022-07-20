import { RowDataPacket } from 'mysql2';

export default interface IPartner extends RowDataPacket {
  id: number;
  firstname: string;
  lastname: string;
  function: string;
  url: string;
}