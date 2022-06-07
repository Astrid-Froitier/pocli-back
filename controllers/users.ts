import { NextFunction, Request, RequestHandler, Response } from 'express';
import * as User from '../models/user';
import IUser from '../interfaces/IUser';
import { ErrorHandler } from '../helpers/errors';
import { formatSortString } from '../helpers/functions';
import Joi from 'joi';
import { error, log } from 'console';

///////////// USERS ///////////////
// validates inputs
const validateUser = (req: Request, res: Response, next: NextFunction) => {
  let required: Joi.PresenceMode = 'optional';
  if (req.method === 'POST') {
    required = 'required';
  }
  const errors = Joi.object({
    firstname: Joi.string().max(50).presence(required),
    lastname: Joi.string().max(100).presence(required),
    email: Joi.string().email().max(150).presence(required),
    password: Joi.string().min(8).max(100).presence(required),
    streetNumber: Joi.number().max(100000).presence(required),
    address: Joi.string().max(100).presence(required),
    zipCode: Joi.number().max(100000).presence(required),
    city: Joi.string().max(100).presence(required),
    phoneNumber: Joi.number().max(10).presence(required),
    isAdmin: Joi.boolean().presence(required),
    isIntervenant: Joi.boolean().presence(required),
    isAdherent: Joi.boolean().presence(required),
    id: Joi.number().optional(),
  }).validate(req.body, { abortEarly: false }).error;
  if (errors) {
    next(new ErrorHandler(422, errors.message));
  } else {
    next();
  }
};

const emailIsFree = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    // get email from req.body
    const { email } = req.body as IUser;
    // Checks if email already belongs to a registered user
    const userExists = await User.getUserByEmail(email);
    // If email isn't free = Send an error
    if (userExists) {
      next(new ErrorHandler(400, `This user already exists`));
    } else {
      // if email is free, next
      next();
    }
  } catch (err) {
    next(err);
  }
};

const phoneNumberIsFree = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    // get phoneNumber from req.body
    const { phoneNumber } = req.body as IUser;
    // Checks if phoneNumber already belongs to a registered user
    const userExists = await User.getUserByPhoneNumber(phoneNumber);
    // If phoneNumber isn't free = Send an error
    if (userExists) {
      next(new ErrorHandler(400, `This user already exists`));
    } else {
      // if phoneNumber is free, next
      next();
    }
  } catch (err) {
    next(err);
  }
};

// get all users
const getAllUsers = (async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const sortBy: string = req.query.sort as string;
    const users = await User.getAllUsers(formatSortString(sortBy));

    res.setHeader(
      'Content-Range',
      `users : 0-${users.length}/${users.length + 1}`
    );
    return res.status(200).json(users);
  } catch (err) {
    next(err);
  }
}) as RequestHandler; // Used to avoid eslint error : Promise returned in function argument where a void return was expected

// get one user
const getOneUser = (async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { idUser } = req.params;
    const user = await User.getUserById(Number(idUser));
    user ? res.status(200).json(user) : res.sendStatus(404);
  } catch (err) {
    next(err);
  }
}) as RequestHandler;

// checks if user exists
const userExists = (async (req: Request, res: Response, next: NextFunction) => {
  // Récupèrer l'id user de req.params
  const { idUser } = req.params;
  // Vérifier si le user existe
  try {
    const userExists = await User.getUserById(Number(idUser));
    // Si non, => erreur
    if (!userExists) {
      next(new ErrorHandler(404, `This user doesn't exist`));
    }
    // Si oui => next
    else {
      // req.record = userExists; // because we need deleted record to be sent after a delete in react-admin
      next();
    }
  } catch (err) {
    next(err);
  }
}) as RequestHandler;

// adds a user
const addUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.body as IUser;
    console.log(user);
    user.id = await User.addUser(user);
    res.status(201).json(user);
  } catch (err) {
    error(err);
    next(err);
  }
};

// updates a user
const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { idUser } = req.params;
    const userUpdated = await User.updateUser(
      Number(idUser),
      req.body as IUser
    );
    if (userUpdated) {
      const user = await User.getUserById(Number(idUser));
      res.status(200).send(user); // react-admin needs this response
    } else {
      throw new ErrorHandler(500, `User cannot be updated`);
    }
  } catch (err) {
    next(err);
  }
};

// delete one user
const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Récupèrer l'id user de req.params
    const { idUser } = req.params;
    // Vérifier si le user existe
    const user = await User.getUserById(Number(idUser));
    const userDeleted = await User.deleteUser(Number(idUser));
    if (userDeleted) {
      res.status(200).send(user); // react-admin needs this response
    } else {
      throw new ErrorHandler(500, `This user cannot be deleted`);
    }
  } catch (err) {
    next(err);
  }
};
export default {
  getAllUsers,
  getOneUser,
  userExists,
  emailIsFree,
  deleteUser,
  validateUser,
  addUser,
  updateUser,
  phoneNumberIsFree,
};
