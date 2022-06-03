import { NextFunction, Request, RequestHandler, Response } from 'express';
import * as NewsType from '../models/newsType';
import INewsType from '../interfaces/INewsType';
import { ErrorHandler } from '../helpers/errors';
import { formatSortString } from '../helpers/functions';
import Joi from 'joi';

///////////// NewsTypeS ///////////////
// validates inputs
const validateNewsType = (req: Request, res: Response, next: NextFunction) => {
  let required: Joi.PresenceMode = 'optional';
  if (req.method === 'POST') {
    required = 'required';
  }
  const errors = Joi.object({
    name: Joi.string().max(100).presence(required),
  }).validate(req.body, { abortEarly: false }).error;
  if (errors) {
    next(new ErrorHandler(422, errors.message));
  } else {
    next();
  }
};

const nameIsFree = async (req: Request, _res: Response, next: NextFunction) => {
  try {
    // get name from req.body
    const { name } = req.body as INewsType;
    // Checks if name already belongs to a registered NewsType
    const newsTypeExists = await NewsType.getNewsTypeByName(name);
    // If name isn't free = Send an error
    if (newsTypeExists) {
      next(new ErrorHandler(400, `This newsType already exists`));
    } else {
      // if name is free, next
      next();
    }
  } catch (err) {
    next(err);
  }
};
// get all NewsTypes
const getAllNewsTypes = (async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const sortBy: string = req.query.sort as string;
    const newsType = await NewsType.getAllNewsTypes(formatSortString(sortBy));

    res.setHeader(
      'Content-Range',
      `newsType : 0-${newsType.length}/${newsType.length + 1}`
    );
    return res.status(200).json(newsType);
  } catch (err) {
    next(err);
  }
}) as RequestHandler; // Used to avoid eslint error : Promise returned in function argument where a void return was expected

// get one NewsType
const getOneNewsType = (async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { idNewsType } = req.params;
    const newsType = await NewsType.getNewsTypeById(Number(idNewsType));
    newsType ? res.status(200).json(newsType) : res.sendStatus(404);
  } catch (err) {
    next(err);
  }
}) as RequestHandler;

// checks if NewsType exists
const newsTypeExists = (async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Récupèrer l'id NewsType de req.params
  const { idNewsType } = req.params;
  // Vérifier si le NewsType existe
  try {
    const newsTypeExists = await NewsType.getNewsTypeById(Number(idNewsType));
    // Si non, => erreur
    if (!newsTypeExists) {
      next(new ErrorHandler(404, `This newsType doesn't exist`));
    }
    // Si oui => next
    else {
      req.record = newsTypeExists; // because we need deleted record to be sent after a delete in react-admin
      next();
    }
  } catch (err) {
    next(err);
  }
}) as RequestHandler;

// adds a NewsType
const addNewsType = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const newsType = req.body as INewsType;
    newsType.id = await NewsType.addNewsType(newsType);
    res.status(201).json(newsType);
  } catch (err) {
    next(err);
  }
};

// updates a NewsType
const updateNewsType = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { idNewsType } = req.params;
    const newsTypeUpdated = await NewsType.updateNewsType(
      Number(idNewsType),
      req.body as INewsType
    );
    if (newsTypeUpdated) {
      const newsType = await NewsType.getNewsTypeById(Number(idNewsType));
      res.status(200).send(newsType); // react-admin needs this response
    } else {
      throw new ErrorHandler(500, `newsType cannot be updated`);
    }
  } catch (err) {
    next(err);
  }
};

// delete one NewsType
const deleteNewsType = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Récupèrer l'id NewsType de req.params
    const { idNewsType } = req.params;
    // Vérifier si le NewsType existe
    const newsType = await NewsType.getNewsTypeById(Number(idNewsType));
    const NewsTypeDeleted = await NewsType.deleteNewsType(Number(idNewsType));
    if (NewsTypeDeleted) {
      res.status(200).send(newsType); // react-admin needs this response
    } else {
      throw new ErrorHandler(500, `This newsType cannot be deleted`);
    }
  } catch (err) {
    next(err);
  }
};
export default {
  getAllNewsTypes,
  getOneNewsType,
  newsTypeExists,
  nameIsFree,
  deleteNewsType,
  validateNewsType,
  addNewsType,
  updateNewsType,
};
