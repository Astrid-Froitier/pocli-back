import { NextFunction, Request, RequestHandler, Response } from 'express';
import * as FamilyMemberActivity from '../models/familyMemberActivity';
import * as Activity from '../models/activity';
import * as FamilyMember from '../models/familyMember';
import IFamilyMemberActivity from '../interfaces/IFamilyMemberActivity';
import IFamilyMember from '../interfaces/IFamilyMember';
import IActivity from '../interfaces/IActivity';
import { ErrorHandler } from '../helpers/errors';
import { formatSortString } from '../helpers/functions';
import Joi from 'joi';

// validates inputs
const validateFamilyMemberActivity = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let required: Joi.PresenceMode = 'optional';
  if (req.method === 'POST') {
    required = 'required';
  }
  const errors = Joi.object({
    idActivity: Joi.number().presence(required),
    idFamilyMember: Joi.number().presence(required),
    id: Joi.number().optional(), // pour react-admin
  }).validate(req.body, { abortEarly: false }).error;
  if (errors) {
    next(new ErrorHandler(422, errors.message));
  } else {
    next();
  }
};

// get all familyMemberActivitys
const getAllFamilyMemberActivities = (async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const sortBy: string = req.query.sort as string;
    const familyMemberActivities =
      await FamilyMemberActivity.getAllFamilyMemberActivities(
        formatSortString(sortBy)
      );

    res.setHeader(
      'Content-Range',
      `familyMemberActivities : 0-${familyMemberActivities.length}/${
        familyMemberActivities.length + 1
      }`
    );
    return res.status(200).json(familyMemberActivities);
  } catch (err) {
    next(err);
  }
}) as RequestHandler; // Used to avoid eslint error : Promise returned in function argument where a void return was expected

// get one familyMemberActivity
const getOneFamilyMemberActivity = (async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { idFamilyMemberActivity } = req.params;
    const familyMemberActivity =
      await FamilyMemberActivity.getFamilyMemberActivityById(
        Number(idFamilyMemberActivity)
      );
    familyMemberActivity
      ? res.status(200).json(familyMemberActivity)
      : res.sendStatus(404);
  } catch (err) {
    next(err);
  }
}) as RequestHandler;

// checks if an familyMemberActivity exists before update or delete
const familyMemberActivityExists = (async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { idFamilyMemberActivity } = req.params;

  const familyMemberActivityExists: IFamilyMemberActivity =
    await FamilyMemberActivity.getFamilyMemberActivityById(
      Number(idFamilyMemberActivity)
    );
  if (!familyMemberActivityExists) {
    next(new ErrorHandler(409, `This familyMemberActivity does not exist`));
  } else {
    // req.record = familyMemberActivityExists; // because we need deleted record to be sent after a delete in react-admin
    next();
  }
}) as RequestHandler;

// checks if an idActivity exists before post or update
const idActivityExists = (async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { idActivity } = req.body as IActivity;

  if (!idActivity) {
    next();
  } else {
    const idActivityExists: IActivity = await Activity.getActivityById(
      Number(idActivity)
    );
    if (!idActivityExists) {
      next(new ErrorHandler(409, `This idActivity does not exist`));
    } else {
      // req.record = idActivityExists; // because we need deleted record to be sent after a delete in react-admin
      next();
    }
  }
}) as RequestHandler;

// checks if an idFamilyMember exists before post or update
const idFamilyMemberExists = (async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { idFamilyMember } = req.body as IFamilyMember;

  if (!idFamilyMember) {
    next();
  } else {
    const idFamilyMemberExists: IFamilyMember =
      await FamilyMember.getFamilyMemberById(Number(idFamilyMember));
    if (!idFamilyMemberExists) {
      next(new ErrorHandler(409, `This idFamilyMember does not exist`));
    } else {
      // req.record = idFamilyMemberExists; // because we need deleted record to be sent after a delete in react-admin
      next();
    }
  }
}) as RequestHandler;

// adds a familyMemberActivity

const addFamilyMemberActivity = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const familyMemberActivityId =
      await FamilyMemberActivity.addFamilyMemberActivity(
        req.body as IFamilyMemberActivity
      );
    if (familyMemberActivityId) {
      res.status(201).json({ id: familyMemberActivityId, ...req.body });
    } else {
      throw new ErrorHandler(500, `familyMemberActivity cannot be created`);
    }
  } catch (err) {
    next(err);
  }
};

// updates a familyMemberActivity

const updateFamilyMemberActivity = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { idFamilyMemberActivity } = req.params;
    const familyMemberActivityUpdated =
      await FamilyMemberActivity.updateFamilyMemberActivity(
        Number(idFamilyMemberActivity),
        req.body as IFamilyMemberActivity
      );
    if (familyMemberActivityUpdated) {
      const familyMemberActivity =
        await FamilyMemberActivity.getFamilyMemberActivityById(
          Number(idFamilyMemberActivity)
        );
      res.status(200).send(familyMemberActivity); // react-admin needs this response
    } else {
      throw new ErrorHandler(500, `familyMemberActivity cannot be updated`);
    }
  } catch (err) {
    next(err);
  }
};

// delete one familyMemberActivity
const deleteFamilyMemberActivity = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { idFamilyMemberActivity } = req.params;
    const familyMemberActivityDeleted =
      await FamilyMemberActivity.deleteFamilyMemberActivity(
        Number(idFamilyMemberActivity)
      );
    if (familyMemberActivityDeleted) {
      res.status(200).send(req.record); // react-admin needs this response
    } else {
      throw new ErrorHandler(409, `familyMemberActivity not found`);
    }
  } catch (err) {
    next(err);
  }
};

export default {
  validateFamilyMemberActivity,
  getAllFamilyMemberActivities,
  getOneFamilyMemberActivity,
  familyMemberActivityExists,
  idActivityExists,
  idFamilyMemberExists,
  addFamilyMemberActivity,
  updateFamilyMemberActivity,
  deleteFamilyMemberActivity,
};
