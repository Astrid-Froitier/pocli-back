import { RowDataPacket } from 'mysql2';

export default interface IEvent extends RowDataPacket {
  id: number;
  numberParticipantsMax?: number;
  name: string;
  description: string;
  text?: string;
  podcastLink?: string;
  reservedAdherent: number;
  price?: number;
  idPostType: number;
  idActivity: number;
}
