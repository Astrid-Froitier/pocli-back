import { NextFunction, Request, RequestHandler, Response } from 'express';
import * as FamilyMemberEvent from '../models/familyMemberEvent';
import * as Event from '../models/event';
import * as FamilyMember from '../models/familyMember';
import IFamilyMemberEvent from '../interfaces/IFamilyMemberEvent';
import IFamilyMember from '../interfaces/IFamilyMember';
import IEvent from '../interfaces/IEvent';
import { ErrorHandler } from '../helpers/errors';
import { formatSortString } from '../helpers/functions';
import Joi from 'joi';

// validates inputs
const validateFamilyMemberEvent = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let required: Joi.PresenceMode = 'optional';
  if (req.method === 'POST') {
    required = 'required';
  }
  const errors = Joi.object({
    idEvent: Joi.number().presence(required),
    idFamilyMember: Joi.number().presence(required),
    id: Joi.number().optional(), // pour react-admin
  }).validate(req.body, { abortEarly: false }).error;
  if (errors) {
    next(new ErrorHandler(422, errors.message));
  } else {
    next();
  }
};

// get all familyMemberEvents
const getAllFamilyMemberEvents = (async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const sortBy: string = req.query.sort as string;
    const familyMemberEvents = await FamilyMemberEvent.getAllFamilyMemberEvents(
      formatSortString(sortBy)
    );

    res.setHeader(
      'Content-Range',
      `familyMemberEvents : 0-${familyMemberEvents.length}/${
        familyMemberEvents.length + 1
      }`
    );
    return res.status(200).json(familyMemberEvents);
  } catch (err) {
    next(err);
  }
}) as RequestHandler; // Used to avoid eslint error : Promise returned in function argument where a void return was expected

// get one familyMemberEvent
const getOneFamilyMemberEvent = (async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { idFamilyMemberEvent } = req.params;
    const familyMemberEvent = await FamilyMemberEvent.getFamilyMemberEventById(
      Number(idFamilyMemberEvent)
    );
    familyMemberEvent
      ? res.status(200).json(familyMemberEvent)
      : res.sendStatus(404);
  } catch (err) {
    next(err);
  }
}) as RequestHandler;

// checks if an familyMemberEvent exists before update or delete
const familyMemberEventExists = (async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { idFamilyMemberEvent } = req.params;

  const familyMemberEventExists: IFamilyMemberEvent =
    await FamilyMemberEvent.getFamilyMemberEventById(
      Number(idFamilyMemberEvent)
    );
  if (!familyMemberEventExists) {
    next(new ErrorHandler(409, `This familyMemberEvent does not exist`));
  } else {
    // req.record = familyMemberEventExists; // because we need deleted record to be sent after a delete in react-admin
    next();
  }
}) as RequestHandler;

// checks if an idEvent exists before post or update
const idEventExists = (async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { idEvent } = req.body as IEvent;

  if (!idEvent) {
    next();
  } else {
    const idEventExists: IEvent = await Event.getEventById(Number(idEvent));
    if (!idEventExists) {
      next(new ErrorHandler(409, `This idEvent does not exist`));
    } else {
      // req.record = idEventExists; // because we need deleted record to be sent after a delete in react-admin
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

// adds a familyMemberEvent

const addFamilyMemberEvent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const familyMemberEventId = await FamilyMemberEvent.addFamilyMemberEvent(
      req.body as IFamilyMemberEvent
    );
    if (familyMemberEventId) {
      res.status(201).json({ id: familyMemberEventId, ...req.body });
    } else {
      throw new ErrorHandler(500, `familyMemberEvent cannot be created`);
    }
  } catch (err) {
    next(err);
  }
};

// updates a familyMemberEvent

const updateFamilyMemberEvent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { idFamilyMemberEvent } = req.params;
    const familyMemberEventUpdated =
      await FamilyMemberEvent.updateFamilyMemberEvent(
        Number(idFamilyMemberEvent),
        req.body as IFamilyMemberEvent
      );
    if (familyMemberEventUpdated) {
      const familyMemberEvent =
        await FamilyMemberEvent.getFamilyMemberEventById(
          Number(idFamilyMemberEvent)
        );
      res.status(200).send(familyMemberEvent); // react-admin needs this response
    } else {
      throw new ErrorHandler(500, `familyMemberEvent cannot be updated`);
    }
  } catch (err) {
    next(err);
  }
};

// delete one familyMemberEvent
const deleteFamilyMemberEvent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { idFamilyMemberEvent } = req.params;
    const familyMemberEventDeleted =
      await FamilyMemberEvent.deleteFamilyMemberEvent(
        Number(idFamilyMemberEvent)
      );
    if (familyMemberEventDeleted) {
      res.status(200).send(req.record); // react-admin needs this response
    } else {
      throw new ErrorHandler(409, `familyMemberEvent not found`);
    }
  } catch (err) {
    next(err);
  }
};

export default {
  validateFamilyMemberEvent,
  getAllFamilyMemberEvents,
  getOneFamilyMemberEvent,
  familyMemberEventExists,
  idEventExists,
  idFamilyMemberExists,
  addFamilyMemberEvent,
  updateFamilyMemberEvent,
  deleteFamilyMemberEvent,
};
