import IPartner from '../interfaces/IPartner';
import IHistoryPartner from '../interfaces/IHistoryPartner';

import IUser from '../interfaces/IUser';
import IUserInfo from '../interfaces/IUserInfoInit';
declare global {
  namespace Express {
    interface Request {
      userInfo?: IUserInfo;
      record?: IUser | IPartner | IHistoryPartner; // used to store deleted record to send appropriate responses to react-admin
    }
  }
}
