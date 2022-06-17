import { NextFunction, Request, RequestHandler, Response } from 'express';
import * as Activity from '../models/activity';
import { ErrorHandler } from '../helpers/errors';
import { formatSortString } from '../helpers/functions';
import Joi from 'joi';
import IActivity from '../interfaces/IActivity';

// validates inputs
const validateActivity = (req: Request, res: Response, next: NextFunction) => {
  let required: Joi.PresenceMode = 'optional';
  if (req.method === 'POST') {
    required = 'required';
  }
  const errors = Joi.object({
    name: Joi.string().max(100).presence(required),
    id: Joi.number().optional(), // pour react-admin
  }).validate(req.body, { abortEarly: false }).error;
  if (errors) {
    next(new ErrorHandler(422, errors.message));
  } else {
    next();
  }
};

// get all Activities
const getAllActivities = (async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const sortBy: string = req.query.sort as string;
    const activities = await Activity.getAllActivities(
      formatSortString(sortBy)
    );

    res.setHeader(
      'Content-Range',
      `activities : 0-${activities.length}/${activities.length + 1}`
    );
    return res.status(200).json(activities);
  } catch (err) {
    next(err);
  }
}) as RequestHandler; // Used to avoid eslint error : Promise returned in function argument where a void return was expected

// get one Activity
const getOneActivity = (async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { idActivity } = req.params;
    const activity = await Activity.getActivityById(Number(idActivity));
    activity ? res.status(200).json(activity) : res.sendStatus(404);
  } catch (err) {
    next(err);
  }
}) as RequestHandler;

const activityExitsts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { idActivity } = req.params;
  try {
    const activityExitsts = await Activity.getActivityById(Number(idActivity));
    if (!activityExitsts) {
      next(new ErrorHandler(404, `This activity doesn't exists`));
    } else {
      next();
    }
  } catch (err) {
    next();
  }
};

const addActivity = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const activity = req.body as IActivity;
    activity.id = await Activity.addActivity(activity);
    res.status(201).json(activity);
  } catch (err) {
    next(err);
  }
};

const updateActivity = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { idActivity } = req.params;
    const activityUpdated = await Activity.updateActivity(
      Number(idActivity),
      req.body as IActivity
    );
    if (activityUpdated) {
      const activity = await Activity.getActivityById(Number(idActivity));
      res.status(200).send(activity);
    } else {
      throw new ErrorHandler(500, `Activity cannot be updated`);
    }
  } catch (err) {
    next(err);
  }
};

const deleteActivity = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { idActivity } = req.params;
    const activity = await Activity.getActivityById(Number(idActivity));
    const actititydeleted = await Activity.deleteActivity(Number(idActivity));
    if (actititydeleted) {
      res.status(200).send(activity);
    } else {
      throw new ErrorHandler(500, `This activity cannot be deleted`);
    }
  } catch (err) {
    next(err);
  }
};

export default {
  getOneActivity,
  getAllActivities,
  validateActivity,
  activityExitsts,
  addActivity,
  updateActivity,
  deleteActivity,
};
