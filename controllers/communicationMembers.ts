import { NextFunction, Request, RequestHandler, Response } from 'express';
import * as CommunicationMember from '../models/communicationMember';
import { ErrorHandler } from '../helpers/errors';
import { formatSortString } from '../helpers/functions';
import Joi from 'joi';
import ICommunicationMember from '../interfaces/ICommunicationMember';

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
    idFamilyMember: Joi.number().allow(null),
    idFamily: Joi.number().presence(required),
    idCommunication: Joi.number().presence(required),
    isOpened: Joi.number().presence(required),
    isTrashed: Joi.number().presence(required),
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

const getAllCommunicationMembersByIdFamily = (async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { idFamily } = req.params;
    const communicationMembersByIdFamily =
      await CommunicationMember.getAllCommunicationMembersByIdFamily(
        Number(idFamily)
      );
    communicationMembersByIdFamily
      ? res.status(200).json(communicationMembersByIdFamily)
      : res.sendStatus(404);
  } catch (err) {
    next(err);
  }
}) as RequestHandler;

const communicationMemberExists = (async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { idCommunicationMember } = req.params;
  try {
    const communicationMemberExists =
      await CommunicationMember.getCommunicationMemberById(
        Number(idCommunicationMember)
      );
    if (!communicationMemberExists) {
      next(new ErrorHandler(404, `This communicationMember doesn't exist`));
    } else {
      next();
    }
  } catch (err) {
    next(err);
  }
}) as RequestHandler;

// add one communicationMember
const addCommunicationMember = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const communicationMemberId =
      await CommunicationMember.addCommunicationMember(
        req.body as ICommunicationMember
      );
    if (communicationMemberId) {
      res.status(201).json({ id: communicationMemberId, ...req.body });
    } else {
      throw new ErrorHandler(500, `CommunicationMember cannot be created`);
    }
  } catch (err) {
    next(err);
  }
};

// updates an event
const updateCommunicationMember = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { idCommunicationMember } = req.params;
    const communicationMemberUpdated =
      await CommunicationMember.updateCommunicationMember(
        Number(idCommunicationMember),
        req.body as ICommunicationMember
      );
    if (communicationMemberUpdated) {
      const communicationMember =
        await CommunicationMember.getCommunicationMemberById(
          Number(idCommunicationMember)
        );
      res.status(200).send(communicationMember); // react-admin needs this response
    } else {
      throw new ErrorHandler(500, `CommunicationMember cannot be updated`);
    }
  } catch (err) {
    next(err);
  }
};

// delete one communicationMember
const deleteCommunicationMember = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { idCommunicationMember } = req.params;
    const communicationMemberDeleted =
      await CommunicationMember.deleteCommunicationMember(
        Number(idCommunicationMember)
      );
    if (communicationMemberDeleted) {
      res.status(200).send(req.record); // react-admin needs this response
    } else {
      throw new ErrorHandler(409, `CommunicationMember not found`);
    }
  } catch (err) {
    next(err);
  }
};

export default {
  getAllCommunicationMembersByIdFamily,
  getOneCommunicationMember,
  getAllCommunicationMembers,
  validateCommunicationMember,
  communicationMemberExists,
  addCommunicationMember,
  updateCommunicationMember,
  deleteCommunicationMember,
};
