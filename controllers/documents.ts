import { NextFunction, Request, RequestHandler, Response } from 'express';
import * as Document from '../models/document';
import IDocument from '../interfaces/IDocument';
import { ErrorHandler } from '../helpers/errors';
import { formatSortString } from '../helpers/functions';
import Joi from 'joi';

// validates inputs
const validateDocument = (req: Request, res: Response, next: NextFunction) => {
  let required: Joi.PresenceMode = 'optional';
  if (req.method === 'POST') {
    required = 'required';
  }
  const errors = Joi.object({
    name: Joi.string().max(100).presence(required),
    url: Joi.string().max(255).presence(required),
    id: Joi.number().optional(), // pour react-admin
  }).validate(req.body, { abortEarly: false }).error;
  if (errors) {
    next(new ErrorHandler(422, errors.message));
  } else {
    next();
  }
};

// get all Documents
const getAllDocuments = (async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const sortBy: string = req.query.sort as string;
    const documents = await Document.getAllDocuments(formatSortString(sortBy));

    res.setHeader(
      'Content-Range',
      `documents : 0-${documents.length}/${documents.length + 1}`
    );
    return res.status(200).json(documents);
  } catch (err) {
    next(err);
  }
}) as RequestHandler; // Used to avoid eslint error : Promise returned in function argument where a void return was expected

// get one Document
const getOneDocument = (async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { idDocument } = req.params;
    const document = await Document.getDocumentById(Number(idDocument));
    document ? res.status(200).json(document) : res.sendStatus(404);
  } catch (err) {
    next(err);
  }
}) as RequestHandler;

// checks if an document exists before update or delete
const documentExists = (async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { idDocument } = req.params;

  const documentExists: IDocument = await Document.getDocumentById(
    Number(idDocument)
  );
  if (!documentExists) {
    next(new ErrorHandler(409, `This document does not exist`));
  } else {
    // req.record = documentExists; // because we need deleted record to be sent after a delete in react-admin
    next();
  }
}) as RequestHandler;

// adds a document

const addDocument = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const documentId = await Document.addDocument(req.body as IDocument);
    if (documentId) {
      res.status(201).json({ id: documentId, ...req.body });
    } else {
      throw new ErrorHandler(500, `Document cannot be created`);
    }
  } catch (err) {
    next(err);
  }
};

// updates a document

const updateDocument = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { idDocument } = req.params;
    const documentUpdated = await Document.updateDocument(
      Number(idDocument),
      req.body as IDocument
    );
    if (documentUpdated) {
      const document = await Document.getDocumentById(Number(idDocument));
      res.status(200).send(document); // react-admin needs this response
    } else {
      throw new ErrorHandler(500, `Document cannot be updated`);
    }
  } catch (err) {
    next(err);
  }
};

// delete one document
const deleteDocument = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { idDocument } = req.params;
    const documentDeleted = await Document.deleteDocument(Number(idDocument));
    if (documentDeleted) {
      res.status(200).send(req.record); // react-admin needs this response
    } else {
      throw new ErrorHandler(409, `Document not found`);
    }
  } catch (err) {
    next(err);
  }
};

export default {
  getOneDocument,
  getAllDocuments,
  validateDocument,
  documentExists,
  addDocument,
  updateDocument,
  deleteDocument,
};
