import { Request, Response, NextFunction, RequestHandler } from 'express';
import * as Event from '../models/event';
import * as PostType from '../models/postType';
import * as Activity from '../models/activity';
import IEvent from '../interfaces/IEvent';
import IPostType from '../interfaces/IPostType';
import IActivity from '../interfaces/IActivity';
import { ErrorHandler } from '../helpers/errors';
import { formatSortString } from '../helpers/functions';
import Joi from 'joi';

///////////// EVENT ///////////
// validates input
const validateEvent = (req: Request, res: Response, next: NextFunction) => {
  let required: Joi.PresenceMode = 'optional';
  if (req.method === 'POST') {
    required = 'required';
  }
  const errors = Joi.object({
    numberParticipantsMax: Joi.number().optional().allow(null), // pour react-admin qui envoie null et pas undefined
    date: Joi.string().max(10).presence(required),
    description: Joi.string().max(100).presence(required),
    text: Joi.string().max(1000).optional().allow(null),
    podcastLink: Joi.string().max(255).optional().allow(null),
    reservedAdherent: Joi.number().presence(required),
    price: Joi.number().optional().allow(null),
    idPostType: Joi.number().presence(required),
    idActivity: Joi.number().allow(null),
    id: Joi.number().optional(), // pour react-admin
  }).validate(req.body, { abortEarly: false }).error;
  if (errors) {
    console.log(errors.message);
    next(new ErrorHandler(422, errors.message));
  } else {
    next();
  }
};

// returns all events
const getAllEvents = (async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const sortBy: string = req.query.sort as string;
    const events = await Event.getAllEvents(formatSortString(sortBy));
    res.setHeader(
      'Content-Range',
      `events : 0-${events.length}/${events.length + 1}`
    );
    res.status(200).json(events);
  } catch (err) {
    next(err);
  }
}) as RequestHandler;

// get One Event
const getOneEvent = (async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { idEvent } = req.params;
    const event = await Event.getEventById(Number(idEvent));
    event ? res.status(200).json(event) : res.sendStatus(404);
  } catch (err) {
    next(err);
  }
}) as RequestHandler;

// returns all events by postType
const getAllEventsByPostType = (async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { idPostType } = req.params;
    const events = await Event.getEventByPostType(Number(idPostType));
    events ? res.status(200).json(events) : res.sendStatus(404);
  } catch (err) {
    next(err);
  }
}) as RequestHandler;

// returns all events by postType
const getAllEventsByActivity = (async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { idActivity } = req.params;
    const events = await Event.getEventByPostType(Number(idActivity));
    events ? res.status(200).json(events) : res.sendStatus(404);
  } catch (err) {
    next(err);
  }
}) as RequestHandler;

// checks if an event exists before update or delete
const eventExists = (async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { idEvent } = req.params;

  const eventExists: IEvent = await Event.getEventById(Number(idEvent));
  if (!eventExists) {
    next(new ErrorHandler(409, `This event does not exist`));
  } else {
    // req.record = eventExists; // because we need deleted record to be sent after a delete in react-admin
    next();
  }
}) as RequestHandler;

// checks if an idPostType exists before post or update
const idPostTypeExists = (async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { idPostType } = req.body as IEvent;

  if (!idPostType) {
    next();
  } else {
    const idPostTypeExists: IPostType = await PostType.getPostTypeById(
      Number(idPostType)
    );
    if (!idPostTypeExists) {
      next(new ErrorHandler(409, `This idPostType does not exist`));
    } else {
      // req.record = idPostTypeExists; // because we need deleted record to be sent after a delete in react-admin
      next();
    }
  }
}) as RequestHandler;

// checks if an idActvity exists before post or update
const idActvityExists = (async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { idActivity } = req.body as IEvent;

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

// adds an event

const addEvent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const eventId = await Event.addEvent(req.body as IEvent);
    if (eventId) {
      res.status(201).json({ id: eventId, ...req.body });
    } else {
      throw new ErrorHandler(500, `Event cannot be created`);
    }
  } catch (err) {
    next(err);
  }
};

// updates an event

const updateEvent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { idEvent } = req.params;
    const eventUpdated = await Event.updateEvent(
      Number(idEvent),
      req.body as IEvent
    );
    if (eventUpdated) {
      const event = await Event.getEventById(Number(idEvent));
      res.status(200).send(event); // react-admin needs this response
    } else {
      throw new ErrorHandler(500, `Event cannot be updated`);
    }
  } catch (err) {
    next(err);
  }
};

// delete one event
const deleteEvent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { idEvent } = req.params;
    const eventDeleted = await Event.deleteEvent(Number(idEvent));
    if (eventDeleted) {
      res.status(200).send(req.record); // react-admin needs this response
    } else {
      throw new ErrorHandler(409, `Event not found`);
    }
  } catch (err) {
    next(err);
  }
};

export default {
  getAllEvents,
  getOneEvent,
  getAllEventsByPostType,
  getAllEventsByActivity,
  deleteEvent,
  addEvent,
  updateEvent,
  validateEvent,
  eventExists,
  idPostTypeExists,
  idActvityExists,
};
