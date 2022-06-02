import IPartner from '../interfaces/IPartner';
import IPartnersType from '../interfaces/IPartnersType';
import IUser from '../interfaces/IUser';
import IUserInfo from '../interfaces/IUserInfoInit';
declare global {
  namespace Express {
    interface Request {
      userInfo?: IUserInfo;
      record?: IUser | IPartner | IPartnersType; // used to store deleted record to send appropriate responses to react-admin
    }
  }
}
