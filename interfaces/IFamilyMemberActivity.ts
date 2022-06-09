import { RowDataPacket } from 'mysql2';

export default interface IFamilyMemberActivity extends RowDataPacket {
  id: number;
  idActivity: number;
  idFamilyMember: number;
}