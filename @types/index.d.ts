import IPartner from '../interfaces/IPartner';
import IUser from '../interfaces/IUser';
import IUserInfo from '../interfaces/IUserInfoInit';
declare global {
  namespace Express {
    interface Request {
      userInfo?: IUserInfo;
      record?: IUser | IPartner; // used to store deleted record to send appropriate responses to react-admin
    }
  }
}
