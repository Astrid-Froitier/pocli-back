import IPartner from '../interfaces/IPartner';
import IPartnersType from '../interfaces/IPartnersType';
import IHistoryPartner from '../interfaces/IHistoryPartner';
import IUser from '../interfaces/IUser';
import IUserInfo from '../interfaces/IUserInfoInit';
import INewsType from '../interfaces/INewsType';
import INew from '../interfaces/INew';
import IHistoryNew from '../interfaces/IHistoryNew';
import IComment from '../interfaces/IComment';
import IHistoryUser from '../interfaces/IHistoryUser';
declare global {
  namespace Express {
    interface Request {
      userInfo?: IUserInfo;
      record?:
        | IUser
        | IHistoryNew
        | IPartner
        | IHistoryPartner
        | INewsType
        | IPartnersType
        | INew
        | IComment
        | IHistoryUser;
      // used to store deleted record to send appropriate responses to react-admin
    }
  }
}
