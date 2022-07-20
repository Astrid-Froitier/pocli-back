import { Request, Response, NextFunction, RequestHandler } from 'express';
import * as Partner from '../models/partner';
import IPartner from '../interfaces/IPartner';
import { ErrorHandler } from '../helpers/errors';
import { formatSortString } from '../helpers/functions';
import Joi from 'joi';

const validatePartner = (req: Request, res: Response, next: NextFunction) => {
  let required: Joi.PresenceMode = 'optional';
  if (req.method === 'POST') {
    required = 'required';
  }
  const errors = Joi.object({
    name: Joi.string().max(100).presence(required),
    logo: Joi.string().max(100).presence(required),
    url: Joi.string().max(255).presence(required),
    id: Joi.number().optional(), // pour react-admin
  }).validate(req.body, { abortEarly: false }).error;
  if (errors) {
    next(new ErrorHandler(422, errors.message));
  } else {
    next();
  }
};

const getAllPartners = (async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const sortBy: string = req.query.sort as string;
    const partners = await Partner.getAllPartners(formatSortString(sortBy));

    res.setHeader(
      'Content-Range',
      `users : 0-${partners.length}/${partners.length + 1}`
    );
    return res.status(200).json(partners);
  } catch (err) {
    next(err);
  }
}) as RequestHandler;

const getOnePartner = (async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { idPartner } = req.params;
    const partner = await Partner.getPartnerById(Number(idPartner));
    partner ? res.status(200).json(partner) : res.sendStatus(404);
  } catch (err) {
    next(err);
  }
}) as RequestHandler;

const partnerExists = (async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { idPartner } = req.params;
  try {
    const partnerExists = await Partner.getPartnerById(Number(idPartner));
    if (!partnerExists) {
      next(new ErrorHandler(404, `This partner doesn't exist`));
    } else {
      next();
    }
  } catch (err) {
    next(err);
  }
}) as RequestHandler;

const addPartner = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const partner = req.body as IPartner;
    partner.id = await Partner.addPartner(partner);
    res.status(201).json(partner);
  } catch (err) {
    next(err);
  }
};

const updatedPartners = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { idPartner } = req.params;
    const partnerUpdated = await Partner.updatedPartners(
      Number(idPartner),
      req.body as IPartner
    );
    if (partnerUpdated) {
      const partner = await Partner.getPartnerById(Number(idPartner));
      res.status(200).send(partner);
    } else {
      throw new ErrorHandler(500, `Partner cannot be updated`);
    }
  } catch (err) {
    next(err);
  }
};

const deletePartner = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { idPartner } = req.params;
    const partner = await Partner.getPartnerById(Number(idPartner));
    const partnerDeleted = await Partner.deletePartner(Number(idPartner));
    if (partnerDeleted) {
      res.status(200).send(partner);
    } else {
      throw new ErrorHandler(500, `This partner cannot be deleted`);
    }
  } catch (err) {
    next(err);
  }
};

export default {
  validatePartner,
  getAllPartners,
  getOnePartner,
  partnerExists,
  addPartner,
  updatedPartners,
  deletePartner,
};
