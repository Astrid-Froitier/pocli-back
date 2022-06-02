import { RowDataPacket } from 'mysql2';

export default interface IPartner extends RowDataPacket {
  id: number;
  name: string;
  logo: string;
  url: string;
  description: string;
  siretNumber: number;
  idPartnerType: number;
  idUser: number;
}
