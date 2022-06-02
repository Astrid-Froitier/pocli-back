import { NextFunction, Request, RequestHandler, Response } from 'express';
import * as New from '../models/new';
import INew from '../interfaces/INew';
import { ErrorHandler } from '../helpers/errors';
import { formatSortString } from '../helpers/functions';
import Joi from 'joi';

///////////// NEWS ///////////////
// validates inputs
const validateNew = (req: Request, res: Response, next: NextFunction) => {
  let required: Joi.PresenceMode = 'optional';
  if (req.method === 'POST') {
    required = 'required';
  }
  const errors = Joi.object({
    date: Joi.number().max(8).presence(required),
    streetNumber: Joi.number().max(5).presence(required),
    address: Joi.string().min(0).max(100).presence(required),
    zipCode: Joi.number().max(10).presence(required),
    city: Joi.string().max(100).presence(required),
    hours: Joi.number().max(5).presence(required),
    numberOfParticipants: Joi.number().max(3).presence(required),
    idUser: Joi.number().max(5).presence(required),
  }).validate(req.body, { abortEarly: false }).error;
  if (errors) {
    next(new ErrorHandler(422, errors.message));
  } else {
    next();
  }
};

// get all news
const getAllNews = (async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sortBy: string = req.query.sort as string;
    const news = await New.getAllNews(formatSortString(sortBy));

    res.setHeader(
      'Content-Range',
      `news : 0-${news.length}/${news.length + 1}`
    );
    return res.status(200).json(news);
  } catch (err) {
    next(err);
  }
}) as RequestHandler; // Used to avoid eslint error : Promise returned in function argument where a void return was expected

// get one new
const getOneNew = (async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { idNew } = req.params;
    const newNew = await New.getNewById(Number(idNew));
    newNew ? res.status(200).json(newNew) : res.sendStatus(404);
  } catch (err) {
    next(err);
  }
}) as RequestHandler;

// adds a new
const addNew = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const newNew = req.body as INew;
    newNew.id = await New.addNew(newNew);
    res.status(201).json(newNew);
  } catch (err) {
    next(err);
  }
};

// updates a new
const updateNew = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { idNew } = req.params;
    const newUpdated = await New.updateNew(Number(idNew), req.body as INew);
    if (newUpdated) {
      const newNew = await New.getNewById(Number(idNew));
      res.status(200).send(newNew); // react-admin needs this response
    } else {
      throw new ErrorHandler(500, `New cannot be updated`);
    }
  } catch (err) {
    next(err);
  }
};

// delete one new
const deleteNew = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Récupèrer l'id new de req.params
    const { idNew } = req.params;
    // Vérifier si le new existe
    const delNew = await New.getNewById(Number(idNew));
    const newDeleted = await New.deleteNew(Number(idNew));
    if (newDeleted) {
      res.status(200).send(delNew); // react-admin needs this response
    } else {
      throw new ErrorHandler(500, `This new cannot be deleted`);
    }
  } catch (err) {
    next(err);
  }
};
export default {
  validateNew,
  getAllNews,
  getOneNew,
  addNew,
  updateNew,
  deleteNew,
};
