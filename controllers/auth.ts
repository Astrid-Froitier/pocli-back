import { Request, Response, NextFunction } from 'express';
import * as Family from '../models/family';
import * as Admin from '../models/admin';
import { ErrorHandler } from '../helpers/errors';
import IFamilyInfo from '../interfaces/IFamilyInfo';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import Joi from 'joi';
import IFamily from '../interfaces/IFamily';
import IAdmin from '../interfaces/IAdmin';

// validates login input
const validateLogin = (req: Request, res: Response, next: NextFunction) => {
  const errors = Joi.object({
    email: Joi.string().email().max(255).required(),
    password: Joi.string().min(8).max(15).required(),
  }).validate(req.body, { abortEarly: false }).error;
  if (errors) {
    next(new ErrorHandler(422, errors.message));
  } else {
    next();
  }
};

// logs a family
const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body as IFamily;
    const family = await Family.getFamilyByEmail(email);
    if (!family) throw new ErrorHandler(401, 'This family does not exist');
    else {
      const passwordIsCorrect: boolean = await Family.verifyPassword(
        password,
        (family.password)
      );
      if (passwordIsCorrect) {
        const token = calculateToken(email, Number(family.id));

        res.cookie('user_token', token);
        res.json({
          id: family.id,
          name: family.name,
          token: token,
        });
      } else throw new ErrorHandler(401, 'Invalid Credentials');
    }
  } catch (err) {
    next(err);
  }
};

const calculateToken = (familyEmail = '', idFamily = 0) => {
  return jwt.sign(
    { email: familyEmail, id: idFamily },
    `${process.env.PRIVATE_KEY}` as string
  );
};

// logs a family
const loginAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body as IAdmin;
    const admin = await Admin.getAdminByEmail(email);
    if (!admin) throw new ErrorHandler(401, 'This admin does not exist');
    else {
      const passwordIsCorrect: boolean = await Admin.verifyPassword(
        password,
        (admin.password)
      );
      if (passwordIsCorrect) {
        const token = calculateTokenAdmin(email, Number(admin.id));

        res.cookie('user_token', token);
        res.json({
          id: admin.id,
          name: admin.lastname,
          token: token,
        });
      } else throw new ErrorHandler(401, 'Invalid Credentials');
    }
  } catch (err) {
    next(err);
  }
};

const calculateTokenAdmin = (adminEmail = '', idAdmin = 0) => {
  return jwt.sign(
    { email: adminEmail, id: idAdmin },
    `${process.env.PRIVATE_KEY}` as string
  );
};

interface ICookie {
  user_token: string;
}

const getCurrentSession = (req: Request, res: Response, next: NextFunction) => {
  const myCookie = req.cookies as ICookie;
  if (!myCookie.user_token && !req.headers.authorization) {
    next(new ErrorHandler(401, 'Unauthorized user, please login'));
  } else {
    const token: string =
      myCookie.user_token || req.headers.authorization || '';
    req.userInfo = jwt.verify(
      token,
      `${process.env.PRIVATE_KEY}` as string
    ) as IFamilyInfo;
    if (req.userInfo === undefined) {
      next(new ErrorHandler(401, 'Unauthorized user, please login'));
    } else {
      next();
    }
  }
};

// const checkSessionPrivileges = (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   if (req.userInfo === undefined || req.userInfo.admin === 0) {
//     next(new ErrorHandler(401, 'You must be admin to perform this action'));
//   } else {
//     next();
//   }
// };

export default {
  login,
  loginAdmin,
  getCurrentSession,
//   checkSessionPrivileges,
  validateLogin,
};