import { NextFunction, Request, RequestHandler, Response } from 'express';
import * as PartnersType from '../models/partnersType';
import IPartnersType from '../interfaces/IPartnersType';
import { ErrorHandler } from '../helpers/errors';
import { formatSortString } from '../helpers/functions';
import Joi from 'joi';

///////////// PARTNERsTypeS ///////////////
// validates inputs
const validatePartnersType = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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
    const { name } = req.body as IPartnersType;
    // Checks if name already belongs to a registered partnersType
    const partnersTypeExists = await PartnersType.getPartnersTypeByName(name);
    // If name isn't free = Send an error
    if (partnersTypeExists) {
      next(new ErrorHandler(400, `This partnersType already exists`));
    } else {
      // if name is free, next
      next();
    }
  } catch (err) {
    next(err);
  }
};
// get all partnersTypes
const getAllPartnersTypes = (async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const sortBy: string = req.query.sort as string;
    const partnersTypes = await PartnersType.getAllPartnersTypes(
      formatSortString(sortBy)
    );

    res.setHeader(
      'Content-Range',
      `partnersTypes : 0-${partnersTypes.length}/${partnersTypes.length + 1}`
    );
    return res.status(200).json(partnersTypes);
  } catch (err) {
    next(err);
  }
}) as RequestHandler; // Used to avoid eslint error : Promise returned in function argument where a void return was expected

// get one partnersType
const getOnePartnersType = (async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { idPartnersType } = req.params;
    const partnersType = await PartnersType.getPartnersTypeById(
      Number(idPartnersType)
    );
    partnersType ? res.status(200).json(partnersType) : res.sendStatus(404);
  } catch (err) {
    next(err);
  }
}) as RequestHandler;

// checks if partnersType exists
const partnersTypeExists = (async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Récupèrer l'id partnersType de req.params
  const { idPartnersType } = req.params;
  // Vérifier si le partnersType existe
  try {
    const partnersTypeExists = await PartnersType.getPartnersTypeById(
      Number(idPartnersType)
    );
    // Si non, => erreur
    if (!partnersTypeExists) {
      next(new ErrorHandler(404, `This partnersType doesn't exist`));
    }
    // Si oui => next
    else {
      req.record = partnersTypeExists; // because we need deleted record to be sent after a delete in react-admin
      next();
    }
  } catch (err) {
    next(err);
  }
}) as RequestHandler;

// adds a partnersType
const addPartnersType = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const partnersType = req.body as IPartnersType;
    partnersType.id = await partnersType.addPartnersType(partnersType);
    res.status(201).json(partnersType);
  } catch (err) {
    next(err);
  }
};

// updates a partnersType
const updatePartnersType = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { idPartnersType } = req.params;
    const partnersTypeUpdated = await PartnersType.updatePartnersType(
      Number(idPartnersType),
      req.body as IPartnersType
    );
    if (partnersTypeUpdated) {
      const partnersType = await PartnersType.getPartnersTypeById(
        Number(idPartnersType)
      );
      res.status(200).send(partnersType); // react-admin needs this response
    } else {
      throw new ErrorHandler(500, `partnersType cannot be updated`);
    }
  } catch (err) {
    next(err);
  }
};

// delete one partnersType
const deletePartnersType = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Récupèrer l'id partnersType de req.params
    const { idPartnersType } = req.params;
    // Vérifier si le partnersType existe
    const partnersType = await PartnersType.getPartnersTypeById(
      Number(idPartnersType)
    );
    const partnersTypeDeleted = await partnersType.deletePartnersType(
      Number(idPartnersType)
    );
    if (partnersTypeDeleted) {
      res.status(200).send(partnersType); // react-admin needs this response
    } else {
      throw new ErrorHandler(500, `This partnersType cannot be deleted`);
    }
  } catch (err) {
    next(err);
  }
};
export default {
  getAllPartnersTypes,
  getOnePartnersType,
  partnersTypeExists,
  nameIsFree,
  deletePartnersType,
  validatePartnersType,
  addPartnersType,
  updatePartnersType,
};
