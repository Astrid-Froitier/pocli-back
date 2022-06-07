import { NextFunction, Request, RequestHandler, Response } from 'express';
import * as HistoryUser from '../models/historyUser';
import IHistoryUser from '../interfaces/IHistoryUser';
import { ErrorHandler } from '../helpers/errors';
import { formatSortString } from '../helpers/functions';
import Joi from 'joi';

///////////// HISTORYUSERS ///////////////
// validates inputs
const validateHistoryUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let required: Joi.PresenceMode = 'optional';
  if (req.method === 'POST') {
    required = 'required';
  }
  const errors = Joi.object({
    firstname: Joi.string().max(50).presence(required),
    lastname: Joi.string().max(100).presence(required),
    email: Joi.string().email().max(150).presence(required),
    password: Joi.string().min(8).max(100).presence(required),
    streetNumber: Joi.number().max(5).presence(required),
    address: Joi.string().max(100).presence(required),
    zipCode: Joi.number().max(5).presence(required),
    city: Joi.string().max(100).presence(required),
    phoneNumber: Joi.number().max(10).presence(required),
    isAdmin: Joi.boolean().presence(required),
    isIntervenant: Joi.boolean().presence(required),
    isAdherent: Joi.boolean().presence(required),
    idUserPost: Joi.number().max(5).presence(required),
    idUserAdmin: Joi.number().max(5).presence(required),
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
    const { email } = req.body as IHistoryUser;
    // Checks if email already belongs to a registered historyUser
    const historyUserExists = await HistoryUser.getHistoryUserByEmail(email);
    // If email isn't free = Send an error
    if (historyUserExists) {
      next(new ErrorHandler(400, `This historyUser already exists`));
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
    const { phoneNumber } = req.body as IHistoryUser;
    // Checks if phoneNumber already belongs to a registered historyUser
    const historyUserExists = await HistoryUser.getHistoryUserByPhoneNumber(
      phoneNumber
    );
    // If phoneNumber isn't free = Send an error
    if (historyUserExists) {
      next(new ErrorHandler(400, `This historyUser already exists`));
    } else {
      // if phoneNumber is free, next
      next();
    }
  } catch (err) {
    next(err);
  }
};

// get all historyUser
const getAllHistoryUsers = (async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const sortBy: string = req.query.sort as string;
    const historyUser = await HistoryUser.getAllHistoryUsers(
      formatSortString(sortBy)
    );

    res.setHeader(
      'Content-Range',
      `historyUser : 0-${historyUser.length}/${historyUser.length + 1}`
    );
    return res.status(200).json(historyUser);
  } catch (err) {
    next(err);
  }
}) as RequestHandler; // Used to avoid eslint error : Promise returned in function argument where a void return was expected

// get one historyUser
const getOneHistoryUser = (async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { idHistoryUser } = req.params;
    const historyUser = await HistoryUser.getHistoryUserById(
      Number(idHistoryUser)
    );
    historyUser ? res.status(200).json(historyUser) : res.sendStatus(404);
  } catch (err) {
    next(err);
  }
}) as RequestHandler;

// checks if historyUser exists
const historyUserExists = (async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Récupèrer l'id Historyuser de req.params
  const { idHistoryUser } = req.params;
  // Vérifier si le Historyuser existe
  try {
    const historyUserExists = await HistoryUser.getHistoryUserById(
      Number(idHistoryUser)
    );
    // Si non, => erreur
    if (!historyUserExists) {
      next(new ErrorHandler(404, `This historyUser doesn't exist`));
    }
    // Si oui => next
    else {
      // req.record = historyUserExists; // because we need deleted record to be sent after a delete in react-admin
      next();
    }
  } catch (err) {
    next(err);
  }
}) as RequestHandler;

// adds a Historyuser
const addHistoryUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const historyUser = req.body as IHistoryUser;
    historyUser.id = await HistoryUser.addHistoryUser(historyUser);
    res.status(201).json(historyUser);
  } catch (err) {
    next(err);
  }
};

// updates a Historyuser
const updateHistoryUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { idHistoryUser } = req.params;
    const historyUserUpdated = await HistoryUser.updateHistoryUser(
      Number(idHistoryUser),
      req.body as IHistoryUser
    );
    if (historyUserUpdated) {
      const historyUser = await HistoryUser.getHistoryUserById(
        Number(idHistoryUser)
      );
      res.status(200).send(historyUser); // react-admin needs this response
    } else {
      throw new ErrorHandler(500, `historyUser cannot be updated`);
    }
  } catch (err) {
    next(err);
  }
};

// delete one historyUser
const deleteHistoryUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Récupèrer l'id Historyuser de req.params
    const { idHistoryUser } = req.params;
    // Vérifier si le Historyuser existe
    const historyUser = await HistoryUser.getHistoryUserById(
      Number(idHistoryUser)
    );
    const historyUserDeleted = await HistoryUser.deleteHistoryUser(
      Number(idHistoryUser)
    );
    if (historyUserDeleted) {
      res.status(200).send(historyUser); // react-admin needs this response
    } else {
      throw new ErrorHandler(500, `This historyUser cannot be deleted`);
    }
  } catch (err) {
    next(err);
  }
};
export default {
  getAllHistoryUsers,
  getOneHistoryUser,
  historyUserExists,
  emailIsFree,
  deleteHistoryUser,
  validateHistoryUser,
  addHistoryUser,
  updateHistoryUser,
  phoneNumberIsFree,
};
