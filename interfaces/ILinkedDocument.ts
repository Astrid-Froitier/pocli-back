import { RowDataPacket } from 'mysql2';

export default interface ILinkedDocument extends RowDataPacket {
  id: number;
  idDocument: number;
  date: string;
  idActivity?: number;
  idEvent?: number;
  idCommunication?: number;
  idFamilyMember?: number;
  idFamily?: number;
}
