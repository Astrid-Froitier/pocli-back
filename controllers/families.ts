import { Request, Response, NextFunction, RequestHandler } from 'express';
import { ErrorHandler } from '../helpers/errors';
import { formatSortString } from '../helpers/functions';
import Joi from 'joi';
import IFamily from '../interfaces/IFamily';
import * as Family from '../models/family';

// validates inputs
const validateFamily = (req: Request, res: Response, next: NextFunction) => {
  let required: Joi.PresenceMode = 'optional';
  if (req.method === 'POST') {
    required = 'required';
  }
  const errors = Joi.object({
    name: Joi.string().max(255).presence(required),
    streetNumber: Joi.number().presence(required),
    address: Joi.string().max(255).presence(required),
    phoneNumber: Joi.number().presence(required),
    email: Joi.string().max(255).presence(required),
    password: Joi.string().min(8).max(15).presence(required),
    idCity: Joi.number().presence(required),
    idRecipient: Joi.number().presence(required),
    isActive: Joi.number().max(1).presence(required),
  }).validate(req.body, { abortEarly: false }).error;
  if (errors) {
    next(new ErrorHandler(422, errors.message));
  } else {
    next();
  }
};
// sends an error if the email is already registered in the database.
const emailIsFree = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // get email from req.body.
    const { email } = req.body as IFamily;
    // Checks if email is into a registered user.
    const familyExists = await Family.getFamilyByEmail(email);
    // if email is not free = send an error.
    if (familyExists) {
      next(new ErrorHandler(400, `This family already exists`));
    } else {
      // if email is free, next.
    }
    next();
  } catch (err) {
    next(err);
  }
};

const getAllFamilies = (async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const sortBy: string = req.query.sort as string;
    const families = await Family.getAllFamilies(formatSortString(sortBy));

    res.setHeader(
      'Content-Range',
      `families : 0-${families.length}/${families.length + 1}`
    );
    return res.status(200).json(families);
  } catch (err) {
    next(err);
  }
}) as RequestHandler;

const getOneFamily = (async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { idFamily } = req.params;
    const family = await Family.getFamilyById(Number(idFamily));
    family ? res.status(200).json(family) : res.sendStatus(404);
  } catch (err) {
    next(err);
  }
}) as RequestHandler;

const familyExists = (async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { idFamily } = req.params;
  try {
    const familyExists = await Family.getFamilyById(Number(idFamily));
    if (!familyExists) {
      next(new ErrorHandler(404, `This family doesn't exist`));
    } else {
      next();
    }
  } catch (err) {
    next(err);
  }
}) as RequestHandler;

const addFamily = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const family = req.body as IFamily;
    family.id = await Family.addFamily(family);
    res.status(201).json(family);
  } catch (err) {
    next(err);
  }
};

const updateFamily = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { idFamily } = req.params;
    const familyUpdated = await Family.updateFamily(
      Number(idFamily),
      req.body as IFamily
    );
    if (familyUpdated) {
      const family = await Family.getFamilyById(Number(idFamily));
      res.status(200).send(family);
    } else {
      throw new ErrorHandler(500, `Family cannot be updated`);
    }
  } catch (err) {
    next(err);
  }
};

const deleteFamily = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { idFamily } = req.params;
    const family = await Family.getFamilyById(Number(idFamily));
    const familyDeleted = await Family.deleteFamily(Number(idFamily));
    if (familyDeleted) {
      res.status(200).send(family);
    } else {
      throw new ErrorHandler(500, `This family cannot be deleted`);
    }
  } catch (err) {
    next(err);
  }
};

export default {
  validateFamily,
  emailIsFree,
  getAllFamilies,
  getOneFamily,
  familyExists,
  addFamily,
  updateFamily,
  deleteFamily,
};
