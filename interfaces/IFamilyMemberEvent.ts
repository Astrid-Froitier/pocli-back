import { RowDataPacket } from 'mysql2';

export default interface IFamilyMemberEvent extends RowDataPacket {
  id: number;
  idFamilyMember: number;
  idEvent: number;

}