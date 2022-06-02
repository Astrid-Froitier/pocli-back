import { NextFunction, Request, RequestHandler, Response } from 'express';
import * as Partner from '../models/partner';
import IPartner from '../interfaces/IPartner';
import { ErrorHandler } from '../helpers/errors';
import { formatSortString } from '../helpers/functions';
import Joi from 'joi';

///////////// PARTNERS ///////////////
// validates inputs
const validatePartner = (req: Request, res: Response, next: NextFunction) => {
  let required: Joi.PresenceMode = 'optional';
  if (req.method === 'POST') {
    required = 'required';
  }
  const errors = Joi.object({
    name: Joi.string().max(100).presence(required),
    logo: Joi.string().max(100).presence(required),
    url: Joi.string().max(100).presence(required),
    description: Joi.string().max(250).presence(required),
    siretNumber: Joi.number().max(5).presence(required),
    idPartnerType: Joi.number().max(10).presence(required),
    idUser: Joi.number().max(10).presence(required),
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
    const { name } = req.body as IPartner;
    // Checks if name already belongs to a registered partner
    const partnerExists = await Partner.getPartnerByName(name);
    // If name isn't free = Send an error
    if (partnerExists) {
      next(new ErrorHandler(400, `This partner already exists`));
    } else {
      // if name is free, next
      next();
    }
  } catch (err) {
    next(err);
  }
};

const siretNumberIsFree = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    // get siretNumber from req.body
    const { siretNumber } = req.body as IPartner;
    // Checks if siretNumber already belongs to a registered partner
    const partnerExists = await Partner.getPartnerBySiretNumber(siretNumber);
    // If siretNumber isn't free = Send an error
    if (partnerExists) {
      next(new ErrorHandler(400, `This partner already exists`));
    } else {
      // if siretNumber is free, next
      next();
    }
  } catch (err) {
    next(err);
  }
};

// get all partners
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
      `partners : 0-${partners.length}/${partners.length + 1}`
    );
    return res.status(200).json(partners);
  } catch (err) {
    next(err);
  }
}) as RequestHandler; // Used to avoid eslint error : Promise returned in function argument where a void return was expected

// get one partner
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

// checks if partner exists
const partnerExists = (async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Récupèrer l'id partner de req.params
  const { idPartner } = req.params;
  // Vérifier si le partner existe
  try {
    const partnerExists = await Partner.getPartnerById(Number(idPartner));
    // Si non, => erreur
    if (!partnerExists) {
      next(new ErrorHandler(404, `This partner doesn't exist`));
    }
    // Si oui => next
    else {
      req.record = partnerExists; // because we need deleted record to be sent after a delete in react-admin
      next();
    }
  } catch (err) {
    next(err);
  }
}) as RequestHandler;

// adds a partner
const addpartner = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const partner = req.body as IPartner;
    partner.id = await partner.addpartner(partner);
    res.status(201).json(partner);
  } catch (err) {
    next(err);
  }
};

// updates a partner
const updatepartner = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { idPartner } = req.params;
    const partnerUpdated = await Partner.updatePartner(
      Number(idPartner),
      req.body as IPartner
    );
    if (partnerUpdated) {
      const partner = await Partner.getPartnerById(Number(idPartner));
      res.status(200).send(partner); // react-admin needs this response
    } else {
      throw new ErrorHandler(500, `partner cannot be updated`);
    }
  } catch (err) {
    next(err);
  }
};

// delete one partner
const deletePartner = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Récupèrer l'id partner de req.params
    const { idPartner } = req.params;
    // Vérifier si le partner existe
    const partner = await Partner.getPartnerById(Number(idPartner));
    const partnerDeleted = await partner.deletePartner(Number(idPartner));
    if (partnerDeleted) {
      res.status(200).send(partner); // react-admin needs this response
    } else {
      throw new ErrorHandler(500, `This partner cannot be deleted`);
    }
  } catch (err) {
    next(err);
  }
};
export default {
  getAllPartners,
  getOnePartner,
  partnerExists,
  nameIsFree,
  deletePartner,
  validatePartner,
  addpartner,
  updatepartner,
  siretNumberIsFree,
};
