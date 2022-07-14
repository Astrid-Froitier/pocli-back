import { Request, Response, NextFunction, RequestHandler } from 'express';
import { ErrorHandler } from '../helpers/errors';
import { formatSortString } from '../helpers/functions';
import Joi from 'joi';
import IFamilyMember from '../interfaces/IFamilyMember';
import * as FamilyMember from '../models/familyMember';

const validateFamilyMember = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let required: Joi.PresenceMode = 'optional';
  if (req.method === 'POST') {
    required = 'required';
  }
  const errors = Joi.object({
    idFamily: Joi.number().presence(required),
    firstname: Joi.string().max(255).presence(required),
    birthday: Joi.date().presence(required),
    isActive: Joi.number().presence(required),
  }).validate(req.body, { abortEarly: false }).error;
  if (errors) {
    next(new ErrorHandler(422, errors.message));
  } else {
    next();
  }
};

const getAllFamilyMembers = (async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const sortBy: string = req.query.sort as string;
    const familyMembers = await FamilyMember.getAllFamilyMembers(
      formatSortString(sortBy)
    );
    res.setHeader(
      'Content-Range',
      `familyMembers : 0-${familyMembers.length}/${familyMembers.length + 1}`
    );
    return res.status(200).json(familyMembers);
  } catch (err) {
    next(err);
  }
}) as RequestHandler;

const getAllFamilyMembersByIdFamily = (async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { idFamily } = req.params;
    const familyMembersByIdFamily = await FamilyMember.getAllFamilyMembersByIdFamily(
      Number(idFamily)
    );
    familyMembersByIdFamily ? res.status(200).json(familyMembersByIdFamily) : res.status(404);
  } catch (err) {
    next(err);
  }
}) as RequestHandler;

const getOneFamilyMember = (async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { idFamilyMember } = req.params;
    const familyMember = await FamilyMember.getFamilyMemberById(
      Number(idFamilyMember)
    );
    familyMember ? res.status(200).json(familyMember) : res.status(404);
  } catch (err) {
    next(err);
  }
}) as RequestHandler;

const familyMemberExists = (async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { idFamilyMember } = req.params;
  try {
    const familyMemberExists = await FamilyMember.getFamilyMemberById(
      Number(idFamilyMember)
    );
    if (!familyMemberExists) {
      next(new ErrorHandler(404, `This familyMember doesn't exist`));
    } else {
      next();
    }
  } catch (err) {
    next(err);
  }
}) as RequestHandler;

const addFamilyMember = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const familyMember = req.body as IFamilyMember;
    familyMember.id = await FamilyMember.addFamilyMember(familyMember);
    res.status(201).json(familyMember);
  } catch (err) {
    next(err);
  }
};

const deleteFamilyMember = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { idFamilyMember } = req.params;
    const familyMember = await FamilyMember.getFamilyMemberById(
      Number(idFamilyMember)
    );
    const familyMemberDeleted = await FamilyMember.deleteFamilyMember(
      Number(idFamilyMember)
    );
    if (familyMemberDeleted) {
      res.status(200).send(familyMember);
    } else {
      throw new ErrorHandler(500, `This member cannot be deleted`);
    }
  } catch (err) {
    next(err);
  }
};

export default {
  getAllFamilyMembersByIdFamily,
  validateFamilyMember,
  getAllFamilyMembers,
  getOneFamilyMember,
  familyMemberExists,
  addFamilyMember,
  deleteFamilyMember,
};
