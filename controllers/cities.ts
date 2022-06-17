import { NextFunction, Request, RequestHandler, Response } from 'express';
import * as City from '../models/city';
import { ErrorHandler } from '../helpers/errors';
import { formatSortString } from '../helpers/functions';
import Joi from 'joi';
import ICity from '../interfaces/ICity';

// validates inputs
const validateCity = (req: Request, res: Response, next: NextFunction) => {
  let required: Joi.PresenceMode = 'optional';
  if (req.method === 'POST') {
    required = 'required';
  }
  const errors = Joi.object({
    name: Joi.string().max(100).presence(required),
    zipCode: Joi.number().presence(required),
    id: Joi.number().optional(), // pour react-admin
  }).validate(req.body, { abortEarly: false }).error;
  if (errors) {
    next(new ErrorHandler(422, errors.message));
  } else {
    next();
  }
};

// get all Cities
const getAllCities = (async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const sortBy: string = req.query.sort as string;
    const cities = await City.getAllCities(formatSortString(sortBy));

    res.setHeader(
      'Content-Range',
      `cities : 0-${cities.length}/${cities.length + 1}`
    );
    return res.status(200).json(cities);
  } catch (err) {
    next(err);
  }
}) as RequestHandler; // Used to avoid eslint error : Promise returned in function argument where a void return was expected

// get one City
const getOneCity = (async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { idCity } = req.params;
    const city = await City.getCityById(Number(idCity));
    city ? res.status(200).json(city) : res.sendStatus(404);
  } catch (err) {
    next(err);
  }
}) as RequestHandler;

const cityExists = (async (req: Request, res: Response, next: NextFunction) => {
  const { idCity } = req.params;
  try {
    const cityExists = await City.getCityById(Number(idCity));
    if (!cityExists) {
      next(new ErrorHandler(404, `This city doesn't exist`));
    } else {
      next();
    }
  } catch (err) {
    next(err);
  }
}) as RequestHandler;

const addCity = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const city = req.body as ICity;
    city.id = await City.addCity(city);
    res.status(201).json(city);
  } catch (err) {
    next(err);
  }
};

export default {
  getOneCity,
  getAllCities,
  validateCity,
  cityExists,
  addCity,
};
