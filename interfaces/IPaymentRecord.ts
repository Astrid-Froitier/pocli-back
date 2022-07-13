import { RowDataPacket } from 'mysql2';

export default interface IPaymentRecord extends RowDataPacket {
  id: number;
  idPaymentMethod: number;
  checkNumber?: number;
  isPaymentActivity: number;
  dateStart: string;
  dateEnd: string;
  amount: number;
  idFamily: number;
  idFamilyMember?: number;
  idActivity?: number;
}
