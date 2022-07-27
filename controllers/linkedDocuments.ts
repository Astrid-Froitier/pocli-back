import { NextFunction, Request, RequestHandler, Response } from 'express';
import * as LinkedDocument from '../models/linkedDocument';
import * as Document from '../models/document';
import * as Event from '../models/event';
import * as Communication from '../models/communication';
import * as FamilyMember from '../models/familyMember';
import * as Family from '../models/family';
import ILinkedDocument from '../interfaces/ILinkedDocument';
import IDocument from '../interfaces/IDocument';
import IEvent from '../interfaces/IEvent';
import ICommunication from '../interfaces/ICommunication';
import IFamilyMember from '../interfaces/IFamilyMember';
import IFamily from '../interfaces/IFamily';
import { ErrorHandler } from '../helpers/errors';
import { formatSortString } from '../helpers/functions';
import Joi from 'joi';

// validates inputs
const validateLinkedDocument = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let required: Joi.PresenceMode = 'optional';
  if (req.method === 'POST') {
    required = 'required';
  }
  const errors = Joi.object({
    idDocument: Joi.number().presence(required),
    date: Joi.date().allow(null),
    idActivity: Joi.number().allow(null),
    idEvent: Joi.number().allow(null),
    idFamilyMember: Joi.number().allow(null),
    idFamily: Joi.number().allow(null),
    isOpened: Joi.number().allow(null),
    linkType: Joi.string().allow(null),
    id: Joi.number().optional(), // pour react-admin
  }).validate(req.body, { abortEarly: false }).error;
  if (errors) {
    next(new ErrorHandler(422, errors.message));
  } else {
    next();
  }
};

// get all LinkedDocuments
const getAllLinkedDocuments = (async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const sortBy: string = req.query.sort as string;
    const linkedDocuments = await LinkedDocument.getAllLinkedDocuments(
      formatSortString(sortBy)
    );

    res.setHeader(
      'Content-Range',
      `LinkedDocuments : 0-${linkedDocuments.length}/${
        linkedDocuments.length + 1
      }`
    );
    return res.status(200).json(linkedDocuments);
  } catch (err) {
    next(err);
  }
}) as RequestHandler; // Used to avoid eslint error : Promise returned in function argument where a void return was expected

const getAllLinkedDocumentsByIdFamily = (async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { idFamily } = req.params;
    const linkedDocumentsByIdFamily =
      await LinkedDocument.getAllLinkedDocumentsByIdFamily(Number(idFamily));
    linkedDocumentsByIdFamily
      ? res.status(200).json(linkedDocumentsByIdFamily)
      : res.sendStatus(404);
  } catch (err) {
    next(err);
  }
}) as RequestHandler;

// get one LinkedDocument
const getOneLinkedDocument = (async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { idLinkedDocument } = req.params;
    const linkedDocument = await LinkedDocument.getLinkedDocumentById(
      Number(idLinkedDocument)
    );
    LinkedDocument ? res.status(200).json(linkedDocument) : res.sendStatus(404);
  } catch (err) {
    next(err);
  }
}) as RequestHandler;

// checks if an LinkedDocument exists before update or delete
const linkedDocumentExists = (async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { idLinkedDocument } = req.params;

  const linkedDocumentExists: ILinkedDocument =
    await LinkedDocument.getLinkedDocumentById(Number(idLinkedDocument));
  if (!linkedDocumentExists) {
    next(new ErrorHandler(409, `This LinkedDocument does not exist`));
  } else {
    // req.record = LinkedDocumentExists; // because we need deleted record to be sent after a delete in react-admin
    next();
  }
}) as RequestHandler;

// checks if an idDocument exists before post or update
const idDocumentExists = (async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { idDocument } = req.body as ILinkedDocument;

  if (!idDocument) {
    next();
  } else {
    const idDocumentExists: IDocument = await Document.getDocumentById(
      Number(idDocument)
    );
    if (!idDocumentExists) {
      next(new ErrorHandler(409, `This idDocument does not exist`));
    } else {
      // req.record = idDocumentExists; // because we need deleted record to be sent after a delete in react-admin
      next();
    }
  }
}) as RequestHandler;

// checks if an idEvent exists before post or update
const idEventExists = (async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { idEvent } = req.body as ILinkedDocument;

  if (!idEvent) {
    next();
  } else {
    const idEventExists: IEvent = await Event.getEventById(Number(idEvent));
    if (!idEventExists) {
      next(new ErrorHandler(409, `This idEvent does not exist`));
    } else {
      // req.record = idEventExists; // because we need deleted record to be sent after a delete in react-admin
      next();
    }
  }
}) as RequestHandler;

// checks if an idCommunication exists before post or update
const idCommunicationExists = (async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { idCommunication } = req.body as ILinkedDocument;

  if (!idCommunication) {
    next();
  } else {
    const idCommunicationExists: ICommunication =
      await Communication.getCommunicationById(Number(idCommunication));
    if (!idCommunicationExists) {
      next(new ErrorHandler(409, `This idCommunication does not exist`));
    } else {
      // req.record = idCommunicationExists; // because we need deleted record to be sent after a delete in react-admin
      next();
    }
  }
}) as RequestHandler;

// checks if an idFamilyMember exists before post or update
const idFamilyMemberExists = (async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { idFamilyMember } = req.body as ILinkedDocument;

  if (!idFamilyMember) {
    next();
  } else {
    const idFamilyMemberExists: IFamilyMember =
      await FamilyMember.getFamilyMemberById(Number(idFamilyMember));
    if (!idFamilyMemberExists) {
      next(new ErrorHandler(409, `This idFamilyMember does not exist`));
    } else {
      // req.record = idFamilyMemberExists; // because we need deleted record to be sent after a delete in react-admin
      next();
    }
  }
}) as RequestHandler;

// checks if an idFamilyMember exists before post or update
const idFamilyExists = (async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { idFamily } = req.body as ILinkedDocument;

  if (!idFamily) {
    next();
  } else {
    const idFamilyExists: IFamily = await Family.getFamilyById(
      Number(idFamily)
    );
    if (!idFamilyExists) {
      next(new ErrorHandler(409, `This idFamily does not exist`));
    } else {
      // req.record = idFamilyExists; // because we need deleted record to be sent after a delete in react-admin
      next();
    }
  }
}) as RequestHandler;

// adds a LinkedDocument

const addLinkedDocument = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const LinkedDocumentId = await LinkedDocument.addLinkedDocument(
      req.body as ILinkedDocument
    );
    if (LinkedDocumentId) {
      res.status(201).json({ id: LinkedDocumentId, ...req.body });
    } else {
      throw new ErrorHandler(500, `LinkedDocument cannot be created`);
    }
  } catch (err) {
    next(err);
  }
};

// updates a LinkedDocument

const updateLinkedDocument = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { idLinkedDocument } = req.params;
    const linkedDocumentUpdated = await LinkedDocument.updateLinkedDocument(
      Number(idLinkedDocument),
      req.body as ILinkedDocument
    );
    if (linkedDocumentUpdated) {
      const linkedDocument = await LinkedDocument.getLinkedDocumentById(
        Number(idLinkedDocument)
      );
      res.status(200).send(linkedDocument); // react-admin needs this response
    } else {
      throw new ErrorHandler(500, `LinkedDocument cannot be updated`);
    }
  } catch (err) {
    next(err);
  }
};

// delete one LinkedDocument
const deleteLinkedDocument = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { idLinkedDocument } = req.params;
    const linkedDocumentDeleted = await LinkedDocument.deleteLinkedDocument(
      Number(idLinkedDocument)
    );
    if (linkedDocumentDeleted) {
      res.status(200).send(req.record); // react-admin needs this response
    } else {
      throw new ErrorHandler(409, `LinkedDocument not found`);
    }
  } catch (err) {
    next(err);
  }
};

export default {
  validateLinkedDocument,
  getAllLinkedDocuments,
  getAllLinkedDocumentsByIdFamily,
  getOneLinkedDocument,
  linkedDocumentExists,
  idDocumentExists,
  idEventExists,
  idCommunicationExists,
  idFamilyExists,
  idFamilyMemberExists,
  addLinkedDocument,
  updateLinkedDocument,
  deleteLinkedDocument,
};
