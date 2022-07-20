import { NextFunction, Request, RequestHandler, Response } from 'express';
import * as DocumentType from '../models/documentType';
import IDocumentType from '../interfaces/IDocumentType';
import { ErrorHandler } from '../helpers/errors';
import { formatSortString } from '../helpers/functions';
import Joi from 'joi';

// validates inputs
const validateDocumentType = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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

// get all DocumentTypes
const getAllDocumentTypes = (async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const sortBy: string = req.query.sort as string;
    const documentTypes = await DocumentType.getAllDocumentTypes(
      formatSortString(sortBy)
    );

    res.setHeader(
      'Content-Range',
      `DocumentTypes : 0-${documentTypes.length}/${documentTypes.length + 1}`
    );
    return res.status(200).json(documentTypes);
  } catch (err) {
    next(err);
  }
}) as RequestHandler; // Used to avoid eslint error : Promise returned in function argument where a void return was expected

// get one DocumentType
const getOneDocumentType = (async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { idDocumentType } = req.params;
    const documentType = await DocumentType.getDocumentTypeById(
      Number(idDocumentType)
    );
    documentType ? res.status(200).json(documentType) : res.sendStatus(404);
  } catch (err) {
    next(err);
  }
}) as RequestHandler;

// checks if an DocumentType exists before update or delete
const documentTypeExists = (async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { idDocumentType } = req.params;

  const documentTypeExists: IDocumentType =
    await DocumentType.getDocumentTypeById(Number(idDocumentType));
  if (!documentTypeExists) {
    next(new ErrorHandler(409, `This documentType does not exist`));
  } else {
    // req.record = DocumentTypeExists; // because we need deleted record to be sent after a delete in react-admin
    next();
  }
}) as RequestHandler;

// adds a DocumentType

const addDocumentType = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const documentTypeId = await DocumentType.addDocumentType(
      req.body as IDocumentType
    );
    if (documentTypeId) {
      res.status(201).json({ id: documentTypeId, ...req.body });
    } else {
      throw new ErrorHandler(500, `DocumentType cannot be created`);
    }
  } catch (err) {
    next(err);
  }
};

// updates a DocumentType

const updateDocumentType = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { idDocumentType } = req.params;
    const documentTypeUpdated = await DocumentType.updateDocumentType(
      Number(idDocumentType),
      req.body as IDocumentType
    );
    if (documentTypeUpdated) {
      const documentType = await DocumentType.getDocumentTypeById(
        Number(idDocumentType)
      );
      res.status(200).send(documentType); // react-admin needs this response
    } else {
      throw new ErrorHandler(500, `DocumentType cannot be updated`);
    }
  } catch (err) {
    next(err);
  }
};

// delete one DocumentType
const deleteDocumentType = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { idDocumentType } = req.params;
    const documentTypeDeleted = await DocumentType.deleteDocumentType(
      Number(idDocumentType)
    );
    if (documentTypeDeleted) {
      res.status(200).send(req.record); // react-admin needs this response
    } else {
      throw new ErrorHandler(409, `DocumentType not found`);
    }
  } catch (err) {
    next(err);
  }
};

export default {
  getOneDocumentType,
  getAllDocumentTypes,
  validateDocumentType,
  documentTypeExists,
  addDocumentType,
  updateDocumentType,
  deleteDocumentType,
};
