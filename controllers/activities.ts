import { NextFunction, Request, RequestHandler, Response } from 'express';
import * as Activity from '../models/activity';
import { ErrorHandler } from '../helpers/errors';
import { formatSortString } from '../helpers/functions';
import Joi from 'joi';

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

export default {
  getOneActivity,
  getAllActivities,
  validateActivity,
};
