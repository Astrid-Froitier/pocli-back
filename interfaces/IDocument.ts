import { RowDataPacket } from 'mysql2';

export default interface IDocument extends RowDataPacket {
  id: number;
  name: string;
  url: string;
  idDocumentType: number;
}
