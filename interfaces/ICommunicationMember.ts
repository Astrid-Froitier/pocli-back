import { RowDataPacket } from 'mysql2';

export default interface ICommunicationMember extends RowDataPacket {
  id: number;
  idFamilyMember?: number;
  idFamily?: number;
  idActivity?: number;
  idCommunication: number;
  isOpened: number;
  isTrashed: number;
}
