import { NextFunction, Request, RequestHandler, Response } from 'express';
import * as CommunicationMember from '../models/communicationMember';
import { ErrorHandler } from '../helpers/errors';
import { formatSortString } from '../helpers/functions';
import Joi from 'joi';

// validates inputs
const validateCommunicationMember = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let required: Joi.PresenceMode = 'optional';
  if (req.method === 'POST') {
    required = 'required';
  }
  const errors = Joi.object({
    idFamilyMember: Joi.number().presence(required),
    idCommunication: Joi.number().presence(required),
    id: Joi.number().optional(), // pour react-admin
  }).validate(req.body, { abortEarly: false }).error;
  if (errors) {
    next(new ErrorHandler(422, errors.message));
  } else {
    next();
  }
};

// get all CommunicationMembers
const getAllCommunicationMembers = (async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const sortBy: string = req.query.sort as string;
    const communicationMembers =
      await CommunicationMember.getAllCommunicationMembers(
        formatSortString(sortBy)
      );

    res.setHeader(
      'Content-Range',
      `communicationMembers : 0-${communicationMembers.length}/${
        communicationMembers.length + 1
      }`
    );
    return res.status(200).json(communicationMembers);
  } catch (err) {
    next(err);
  }
}) as RequestHandler; // Used to avoid eslint error : Promise returned in function argument where a void return was expected

// get one CommunicationMember
const getOneCommunicationMember = (async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { idCommunicationMember } = req.params;
    const communicationMember =
      await CommunicationMember.getCommunicationMemberById(
        Number(idCommunicationMember)
      );
    communicationMember
      ? res.status(200).json(communicationMember)
      : res.sendStatus(404);
  } catch (err) {
    next(err);
  }
}) as RequestHandler;

export default {
  getOneCommunicationMember,
  getAllCommunicationMembers,
  validateCommunicationMember,
};
