import { Request, Response, NextFunction, RequestHandler } from 'express';
import * as Partner from '../models/partner';
import IPartner from '../interfaces/IPartner';
import { ErrorHandler } from '../helpers/errors';
import { formatSortString } from '../helpers/functions';
import Joi from 'joi';


const validatePartner = (req: Request, res: Response, next: NextFunction) => {
    let required: Joi.PresenceMode = 'optional';
    if (req.method === 'POST') {
      required = 'required';
    }
    const errors = Joi.object({
        name: Joi.string().max(100).presence(required),
        logo: Joi.string().max(100).presence(required),
        url: Joi.string().max(100).presence(required),
        id: Joi.number().optional(), // pour react-admin
      }).validate(req.body, { abortEarly: false }).error;
      if (errors) {
        next(new ErrorHandler(422, errors.message));
      } else {
        next();
      }
    };

const getAllPartners = (async (
    req: Request,
    res: Response,
    next: NextFunction
    ) => {
    try {
        const sortBy: string = req.query.sort as string;
        const partners = await Partner.getAllPartners(formatSortString(sortBy));
    
        res.setHeader(
        'Content-Range',
        `users : 0-${partners.length}/${partners.length + 1}`
        );
        return res.status(200).json(partners);
    } catch (err) {
        next(err);
    }
    }) as RequestHandler;

    const getOnePartnerById = (async (req: Request, res: Response, next: NextFunction) => {
        try {
          const { idPartner } = req.params;
          const partner = await Partner.getPartnerById(Number(idPartner));
          partner ? res.status(200).json(partner) : res.sendStatus(404);
        } catch (err) {
          next(err);
        }
      }) as RequestHandler;

      const getOnePartnerByName = (async (req: Request, res: Response, next: NextFunction) => {
        try {
          const { idPartner } = req.params;
          const partner = await Partner.getPartnerByName(Number(idPartner));
          partner ? res.status(200).json(partner) : res.sendStatus(404);
        } catch (err) {
          next(err);
        }
      }) as RequestHandler;

    export {
      validatePartner,
        getAllPartners,
        getOnePartnerById,
        getOnePartnerByName,
    };