import { NextFunction, Request, RequestHandler, Response } from 'express';
import * as Admin from '../models/admin';
import IAdmin from '../interfaces/IAdmin';
import { ErrorHandler } from '../helpers/errors';
import { formatSortString } from '../helpers/functions';
import Joi from 'joi';

///////////// AdminS ///////////////
// validates inputs
const validateAdmin = (req: Request, res: Response, next: NextFunction) => {
  let required: Joi.PresenceMode = 'optional';
  if (req.method === 'POST') {
    required = 'required';
  }
  const errors = Joi.object({
    firstname: Joi.string().max(100).presence(required),
    lastname: Joi.string().max(100).presence(required),
    email: Joi.string().email().max(255).presence(required),
    password: Joi.string().min(8).max(30).presence(required),
    id: Joi.number().optional(), // pour react-admin
  }).validate(req.body, { abortEarly: false }).error;
  if (errors) {
    next(new ErrorHandler(422, errors.message));
  } else {
    next();
  }
};

// Sends an error if the email is already registered in the database
const emailIsFree = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    // get email from req.body
    const { email } = req.body as IAdmin;
    // Checks if email already belongs to a registered Admin
    const adminExists = await Admin.getAdminByEmail(email);
    // If email isn't free = Send an error
    if (adminExists) {
      next(new ErrorHandler(400, `This admin already exists`));
    } else {
      // if email is free, next
      next();
    }
  } catch (err) {
    next(err);
  }
};

// get all admins
const getAllAdmins = (async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const sortBy: string = req.query.sort as string;
    const admins = await Admin.getAllAdmins(formatSortString(sortBy));

    res.setHeader(
      'Content-Range',
      `admins : 0-${admins.length}/${admins.length + 1}`
    );
    return res.status(200).json(admins);
  } catch (err) {
    next(err);
  }
}) as RequestHandler; // Used to avoid eslint error : Promise returned in function argument where a void return was expected

// get one Admin
const getOneAdmin = (async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { idAdmin } = req.params;
    const admin = await Admin.getAdminById(Number(idAdmin));
    admin ? res.status(200).json(admin) : res.sendStatus(404);
  } catch (err) {
    next(err);
  }
}) as RequestHandler;

// checks if Admin exists
const adminExists = (async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Récupèrer l'id Admin de req.params
  const { idAdmin } = req.params;
  // Vérifier si le Admin existe
  try {
    const adminExists = await Admin.getAdminById(Number(idAdmin));
    // Si non, => erreur
    if (!adminExists) {
      next(new ErrorHandler(404, `This admin doesn't exist`));
    }
    // Si oui => next
    else {
      // req.record = adminExists; // because we need deleted record to be sent after a delete in react-admin
      next();
    }
  } catch (err) {
    next(err);
  }
}) as RequestHandler;

// adds a Admin
const addAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const admin = req.body as IAdmin;
    admin.id = await Admin.addAdmin(admin);
    res.status(201).json({
      id: admin.id,
      firstname: admin.firstname,
      lastname: admin.lastname,
      email: admin.email,
    });
  } catch (err) {
    next(err);
  }
};

// updates a Admin
const updateAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { idAdmin } = req.params;
    const adminUpdated = await Admin.updateAdmin(
      Number(idAdmin),
      req.body as IAdmin
    );
    if (adminUpdated) {
      const admin = await Admin.getAdminById(Number(idAdmin));
      res.status(200).send(admin); // react-admin needs this response
    } else {
      throw new ErrorHandler(500, `Admin cannot be updated`);
    }
  } catch (err) {
    next(err);
  }
};

// delete one Admin
const deleteAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Récupèrer l'id Admin de req.params
    const { idAdmin } = req.params;
    // Vérifier si le Admin existe
    const admin = await Admin.getAdminById(Number(idAdmin));
    const adminDeleted = await Admin.deleteAdmin(Number(idAdmin));
    if (adminDeleted) {
      res.status(200).send(admin); // react-admin needs this response
    } else {
      throw new ErrorHandler(500, `This Admin cannot be deleted`);
    }
  } catch (err) {
    next(err);
  }
};

export default {
  getAllAdmins,
  getOneAdmin,
  adminExists,
  emailIsFree,
  deleteAdmin,
  validateAdmin,
  addAdmin,
  updateAdmin,
};
