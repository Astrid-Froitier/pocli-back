import { RowDataPacket } from 'mysql2';

export default interface IPaymentRecord extends RowDataPacket {
  id: number;
  idPaymentMethod: number;
  numberCheck: number;
  isPaymentActivity: boolean;
  datePay: string;
  amountPay: number;
  idFamily: number;
  idFamilyMember: number;
  idActivity: number;
}
