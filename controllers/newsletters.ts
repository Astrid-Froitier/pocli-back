import { NextFunction, Request, RequestHandler, Response } from 'express';
import * as Newsletter from '../models/newsletter';
import INewsletter from '../interfaces/INewsletter';
import { ErrorHandler } from '../helpers/errors';
import { formatSortString } from '../helpers/functions';
import Joi from 'joi';

// validates inputs
const validateNewsletter = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let required: Joi.PresenceMode = 'optional';
  if (req.method === 'POST') {
    required = 'required';
  }
  const errors = Joi.object({
    url: Joi.string().max(100).presence(required),
    id: Joi.number().optional(), // pour react-admin
  }).validate(req.body, { abortEarly: false }).error;
  if (errors) {
    next(new ErrorHandler(422, errors.message));
  } else {
    next();
  }
};

// get all Newsletters
const getAllNewsletters = (async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const sortBy: string = req.query.sort as string;
    const newsletters = await Newsletter.getAllNewsletters(
      formatSortString(sortBy)
    );

    res.setHeader(
      'Content-Range',
      `Newsletters : 0-${newsletters.length}/${newsletters.length + 1}`
    );
    return res.status(200).json(newsletters);
  } catch (err) {
    next(err);
  }
}) as RequestHandler; // Used to avoid eslint error : Promise returned in function argument where a void return was expected

// get one Newsletter
const getOneNewsletter = (async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { idNewsletter } = req.params;
    const newsletter = await Newsletter.getNewsletterById(Number(idNewsletter));
    newsletter ? res.status(200).json(newsletter) : res.sendStatus(404);
  } catch (err) {
    next(err);
  }
}) as RequestHandler;

// checks if an Newsletter exists before update or delete
const newsletterExists = (async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { idNewsletter } = req.params;

  const newsletterExists: INewsletter = await Newsletter.getNewsletterById(
    Number(idNewsletter)
  );
  if (!newsletterExists) {
    next(new ErrorHandler(409, `This Newsletter does not exist`));
  } else {
    // req.record = newsletterExists; // because we need deleted record to be sent after a delete in react-admin
    next();
  }
}) as RequestHandler;

// adds a Newsletter

const addNewsletter = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const newsletterId = await Newsletter.addNewsletter(
      req.body as INewsletter
    );
    if (newsletterId) {
      res.status(201).json({ id: newsletterId, ...req.body });
    } else {
      throw new ErrorHandler(500, `Newsletter cannot be created`);
    }
  } catch (err) {
    next(err);
  }
};

// updates a Newsletter

const updateNewsletter = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { idNewsletter } = req.params;
    const newsletterUpdated = await Newsletter.updateNewsletter(
      Number(idNewsletter),
      req.body as INewsletter
    );
    if (newsletterUpdated) {
      const newsletter = await Newsletter.getNewsletterById(
        Number(idNewsletter)
      );
      res.status(200).send(newsletter); // react-admin needs this response
    } else {
      throw new ErrorHandler(500, `Newsletter cannot be updated`);
    }
  } catch (err) {
    next(err);
  }
};

// delete one Newsletter
const deleteNewsletter = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { idNewsletter } = req.params;
    const newsletterDeleted = await Newsletter.deleteNewsletter(
      Number(idNewsletter)
    );
    if (newsletterDeleted) {
      res.status(200).send(req.record); // react-admin needs this response
    } else {
      throw new ErrorHandler(409, `Newsletter not found`);
    }
  } catch (err) {
    next(err);
  }
};

export default {
  getOneNewsletter,
  getAllNewsletters,
  validateNewsletter,
  newsletterExists,
  addNewsletter,
  updateNewsletter,
  deleteNewsletter,
};
