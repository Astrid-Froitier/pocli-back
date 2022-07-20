import { Request, Response, NextFunction, RequestHandler } from 'express';
import * as PocliMember from '../models/pocliMember';
import IPocliMember from '../interfaces/IPocliMember';
import { ErrorHandler } from '../helpers/errors';
import { formatSortString } from '../helpers/functions';
import Joi from 'joi';

const validatePocliMember = (req: Request, res: Response, next: NextFunction) => {
  let required: Joi.PresenceMode = 'optional';
  if (req.method === 'POST') {
    required = 'required';
  }
  const errors = Joi.object({
    firstname: Joi.string().max(50).presence(required),
    lastname: Joi.string().max(50).presence(required),
    function: Joi.string().max(50).presence(required),
    url: Joi.string().max(255).presence(required),
    id: Joi.number().optional(), // pour react-admin
  }).validate(req.body, { abortEarly: false }).error;
  if (errors) {
    next(new ErrorHandler(422, errors.message));
  } else {
    next();
  }
};

const getAllPocliMembers = (async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const sortBy: string = req.query.sort as string;
    const pocliMembers = await PocliMember.getAllPocliMembers(formatSortString(sortBy));

    res.setHeader(
      'Content-Range',
      `pocliMembers : 0-${pocliMembers.length}/${pocliMembers.length + 1}`
    );
    return res.status(200).json(pocliMembers);
  } catch (err) {
    next(err);
  }
}) as RequestHandler;

const getOnePocliMember = (async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { idPocliMember } = req.params;
    const pocliMember = await PocliMember.getPocliMemberById(Number(idPocliMember));
    pocliMember ? res.status(200).json(pocliMember) : res.sendStatus(404);
  } catch (err) {
    next(err);
  }
}) as RequestHandler;

const pocliMemberExists = (async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { idPocliMember } = req.params;
  try {
    const pocliMemberExists = await PocliMember.getPocliMemberById(Number(idPocliMember));
    if (!pocliMemberExists) {
      next(new ErrorHandler(404, `This pocliMember doesn't exist`));
    } else {
      next();
    }
  } catch (err) {
    next(err);
  }
}) as RequestHandler;

const addPocliMember = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const pocliMember = req.body as IPocliMember;
    pocliMember.id = await PocliMember.addPocliMember(pocliMember);
    res.status(201).json(pocliMember);
  } catch (err) {
    next(err);
  }
};

const updatedPocliMember = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { idPocliMember } = req.params;
    const pocliMemberUpdated = await PocliMember.updatedPocliMember(
      Number(idPocliMember),
      req.body as IPocliMember
    );
    if (pocliMemberUpdated) {
      const pocliMember = await PocliMember.getPocliMemberById(Number(idPocliMember));
      res.status(200).send(pocliMember);
    } else {
      throw new ErrorHandler(500, `PocliMember cannot be updated`);
    }
  } catch (err) {
    next(err);
  }
};

const deletePocliMember = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { idPocliMember } = req.params;
    const pocliMember = await PocliMember.getPocliMemberById(Number(idPocliMember));
    const pocliMemberDeleted = await PocliMember.deletePocliMember(Number(idPocliMember));
    if (pocliMemberDeleted) {
      res.status(200).send(pocliMember);
    } else {
      throw new ErrorHandler(500, `This pocliMember cannot be deleted`);
    }
  } catch (err) {
    next(err);
  }
};

export default {
  validatePocliMember,
  getAllPocliMembers,
  getOnePocliMember,
  pocliMemberExists,
  addPocliMember,
  updatedPocliMember,
  deletePocliMember,
};