import { RowDataPacket } from 'mysql2';

export default interface INew extends RowDataPacket {
  id: number;
  date: number;
  streetNumber: number;
  address: string;
  zipCode: number;
  city: string;
  hours: number;
  numberOfParticipants: number;
  idUser: number;
  idNewsType: number;
}
