import { Request, Response, NextFunction, RequestHandler } from 'express';
import * as PostType from '../models/postType';
import IPostType from '../interfaces/IPostType';
import { ErrorHandler } from '../helpers/errors';
import { formatSortString } from '../helpers/functions';
import Joi from 'joi';

const validatePostType = (req: Request, res: Response, next: NextFunction) => {
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

const getAllPostTypes = (async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const sortBy: string = req.query.sort as string;
    const postTypes = await PostType.getAllPostType(formatSortString(sortBy));

    res.setHeader(
      'Content-Range',
      `users : 0-${postTypes.length}/${postTypes.length + 1}`
    );
    return res.status(200).json(postTypes);
  } catch (err) {
    next(err);
  }
}) as RequestHandler;

const getOnePostType = (async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { idPostType } = req.params;
    const postType = await PostType.getPostTypeById(Number(idPostType));
    postType ? res.status(200).json(postType) : res.sendStatus(404);
  } catch (err) {
    next(err);
  }
}) as RequestHandler;

export default {
  validatePostType,
  getAllPostTypes,
  getOnePostType,
};
