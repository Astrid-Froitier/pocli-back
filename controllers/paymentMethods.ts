import { Request, Response, NextFunction, RequestHandler } from 'express';
import * as PaymentMethod from '../models/paymentMethod';
import IPaymentMethod from '../interfaces/IPaymentMethod';
import { ErrorHandler } from '../helpers/errors';
import { formatSortString } from '../helpers/functions';
import Joi from 'joi';


const validatePartnerMethod = (req: Request, res: Response, next: NextFunction) => {
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

const getAllPaymentMethods = (async (
    req: Request,
    res: Response,
    next: NextFunction
    ) => {
    try {
        const sortBy: string = req.query.sort as string;
        const paymentMethods = await PaymentMethod.getAllPaymentMethods(formatSortString(sortBy));
    
        res.setHeader(
        'Content-Range',
        `users : 0-${paymentMethods.length}/${paymentMethods.length + 1}`
        );
        return res.status(200).json(paymentMethods);
    } catch (err) {
        next(err);
    }
    }) as RequestHandler;

const getOnePaymentMethodById = (async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { idPaymentMethod } = req.params;
        const paymentMethod = await PaymentMethod.getPaymentMethodById(Number(idPaymentMethod));
        paymentMethod ? res.status(200).json(paymentMethod) : res.sendStatus(404);
    } catch (err) {
        next(err);
    }
    }) as RequestHandler;

const getOnePaymentMethodByName = (async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { idPaymentMethod } = req.params;
        const paymentMethod = await PaymentMethod.getPaymentMethodByName(Number(idPaymentMethod));
        paymentMethod ? res.status(200).json(paymentMethod) : res.sendStatus(404);
    } catch (err) {
        next(err);
    }
    }) as RequestHandler;

    export {
        validatePartnerMethod,
        getAllPaymentMethods,
        getOnePaymentMethodById,
        getOnePaymentMethodByName,
    };