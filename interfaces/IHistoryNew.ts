import { RowDataPacket } from 'mysql2';

export default interface IHistoryNew extends RowDataPacket {
  id: number;
  date: number;
  streetNumber: number;
  address: string;
  zipCode: number;
  city: string;
  hours: number;
  numberOfParticipants: number;
  idUserPost: number;
  idUserAdmin: number;
  idNew: number;
}
