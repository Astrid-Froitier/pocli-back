import { RowDataPacket } from 'mysql2';

export default interface IDocumentType extends RowDataPacket {
  id: number;
  name: string;
}
