import { RowDataPacket } from 'mysql2';

export default interface ICommunicationMember extends RowDataPacket {
  id: number;
  idFamilyMember: number;
}
