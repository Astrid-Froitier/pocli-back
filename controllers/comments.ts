import { NextFunction, Request, RequestHandler, Response } from 'express';
import * as Comment from '../models/comment';
import IComment from '../interfaces/IComment';
import { ErrorHandler } from '../helpers/errors';
import { formatSortString } from '../helpers/functions';
import Joi from 'joi';

///////////// COMMENTS ///////////////
// validates inputs
const validateComment = (req: Request, res: Response, next: NextFunction) => {
  let required: Joi.PresenceMode = 'optional';
  if (req.method === 'POST') {
    required = 'required';
  }
  const errors = Joi.object({
    text: Joi.string().max(255).presence(required),
    dateCreated: Joi.number().max(8).presence(required),
    dateModified: Joi.number().max(8).presence(required),
    idUser: Joi.number().max(5).presence(required),
    idUserAdmin: Joi.number().max(5).presence(required),
    idNew: Joi.number().max(5).presence(required),
    id: Joi.number().optional(),
  }).validate(req.body, { abortEarly: false }).error;
  if (errors) {
    next(new ErrorHandler(422, errors.message));
  } else {
    next();
  }
};

const commentExists = (async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Récupèrer l'id Comment de req.params
  const { idComment } = req.params;
  // Vérifier si le Comment existe
  try {
    const commentExists = await Comment.getCommentById(Number(idComment));
    // Si non, => erreur
    if (!commentExists) {
      next(new ErrorHandler(404, `This Comment doesn't exist`));
    }
    // Si oui => next
    else {
      // req.record = commentExists; // because we need deleted record to be sent after a delete in react-admin
      next();
    }
  } catch (err) {
    next(err);
  }
}) as RequestHandler;

// get all comments
const getAllComments = (async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const sortBy: string = req.query.sort as string;
    const comments = await Comment.getAllComments(formatSortString(sortBy));

    res.setHeader(
      'Content-Range',
      `comments : 0-${comments.length}/${comments.length + 1}`
    );
    return res.status(200).json(comments);
  } catch (err) {
    next(err);
  }
}) as RequestHandler; // Used to avoid eslint error : Promise returned in function argument where a void return was expected

// get one comment
const getOneComment = (async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { idComment } = req.params;
    const comment = await Comment.getCommentById(Number(idComment));
    comment ? res.status(200).json(comment) : res.sendStatus(404);
  } catch (err) {
    next(err);
  }
}) as RequestHandler;

// adds a comment
const addComment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const comment = req.body as IComment;
    comment.id = await Comment.addComment(comment);
    res.status(201).json(comment);
  } catch (err) {
    next(err);
  }
};

// updates a comment
const updateComment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { idComment } = req.params;
    const commentUpdated = await Comment.updateComment(
      Number(idComment),
      req.body as IComment
    );
    if (commentUpdated) {
      const comment = await Comment.getCommentById(Number(idComment));
      res.status(200).send(comment); // react-admin needs this response
    } else {
      throw new ErrorHandler(500, `Comment cannot be updated`);
    }
  } catch (err) {
    next(err);
  }
};

// delete one comment
const deleteComment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Récupèrer l'id comment de req.params
    const { idComment } = req.params;
    // Vérifier si le comment existe
    const comment = await Comment.getCommentById(Number(idComment));
    const commentDeleted = await Comment.deleteComment(Number(idComment));
    if (commentDeleted) {
      res.status(200).send(comment); // react-admin needs this response
    } else {
      throw new ErrorHandler(500, `This comment cannot be deleted`);
    }
  } catch (err) {
    next(err);
  }
};
export default {
  validateComment,
  commentExists,
  getAllComments,
  getOneComment,
  addComment,
  updateComment,
  deleteComment,
};
