import activitiesController from './controllers/activities';
import adminsController from './controllers/admins';
import communicationMembersController from './controllers/communicationMembers';
import citiesController from './controllers/cities';
import documentsController from './controllers/documents';
import eventsController from './controllers/events';
import familiesController from './controllers/families';
import familyMembersController from './controllers/familyMembers';
import partnersController from './controllers/partners';
import paymentMethodsController from './controllers/paymentMethods';
import paymentRecordsController from './controllers/paymentRecords';
import postTypesController from './controllers/postTypes';
import recipientsController from './controllers/recipients';
import { Express } from 'express';

const setupRoutes = (server: Express) => {
  server.get('/coucou', (req, res) => {
    res.status(200).json('hibou');
  });

  // TABLE ACTIVITIES
  server.get('/api/activities', activitiesController.getAllActivities);
  server.get('/api/activitie/:idActivity', activitiesController.getOneActivity);

  server.post(
    '/api/activities',
    activitiesController.validateActivity,
    activitiesController.addActivity
  );

  server.put(
    '/api/activities',
    activitiesController.validateActivity,
    activitiesController.activityExitsts,
    activitiesController.updateActivity
  );

  server.delete(
    '/api/activities',
    activitiesController.activityExitsts,
    activitiesController.deleteActivity
  );

  // TABLE ADMINS
  server.get('/api/admins', adminsController.getAllAdmins);
  server.get('/api/admin/:idAdmin', adminsController.getOneAdmin);
  server.post(
    '/api/admins',
    adminsController.validateAdmin,
    adminsController.emailIsFree,
    adminsController.addAdmin
  );
  server.put(
    '/api/admin/:idAdmin',
    adminsController.validateAdmin,
    adminsController.adminExists,
    adminsController.addAdmin
  );
  server.delete(
    '/api/admin/:idAdmin',
    adminsController.adminExists,
    adminsController.deleteAdmin
  );

  // TABLE CITIES
  server.get('/api/cities', citiesController.getAllCities);
  server.get('/api/activitie/:idCity', citiesController.getOneCity);

  server.post(
    '/api/cities',
    citiesController.validateCity,
    citiesController.addCity
  );

  server.put(
    '/api/cities',
    citiesController.validateCity,
    citiesController.cityExists
  );

  // TABLE COMMUNICATIONMEMBERS
  server.get(
    '/api/communicationMembers',
    communicationMembersController.getAllCommunicationMembers
  );
  server.get(
    '/api/communicationMember/:idCommunicationMember',
    communicationMembersController.getOneCommunicationMember
  );

  // TABLE DOCUMENTS
  server.get('/api/documents', documentsController.getAllDocuments);
  server.get('/api/document/:idDocument', documentsController.getOneDocument);
  server.post(
    '/api/documents',
    documentsController.validateDocument,
    documentsController.addDocument
  );
  server.put(
    '/api/document/:idDocument',
    documentsController.validateDocument,
    documentsController.documentExists,
    documentsController.updateDocument
  );
  server.delete(
    '/api/document/:idDocument',
    documentsController.documentExists,
    documentsController.deleteDocument
  );

  // TABLE EVENTS
  server.get('/api/events', eventsController.getAllEvents);
  server.get('/api/event/:idEvent', eventsController.getOneEvent);
  server.post(
    '/api/events',
    eventsController.validateEvent,
    eventsController.addEvent
  );
  server.put(
    '/api/event/:idEvents',
    eventsController.validateEvent,
    eventsController.eventExists,
    eventsController.updateEvent
  );
  server.delete(
    '/api/events/:idEvents',
    eventsController.eventExists,
    eventsController.deleteEvent
  );

  // TABLE FAMILIES
  server.get('/api/families', familiesController.getAllFamilies);
  server.get('/api/family/:idFamily', familiesController.getOneFamily);
  server.post(
    '/api/families',
    familiesController.validateFamily,
    familiesController.emailIsFree,
    familiesController.addFamily
  );
  server.put(
    '/api/family/:idFamily',
    familiesController.validateFamily,
    familiesController.familyExists,
    familiesController.updateFamily
  );
  server.delete(
    '/api/family/:idFamily',
    familiesController.familyExists,
    familiesController.deleteFamily
  );

  // TABLE FAMILYMEMBERS
  server.get(
    '/api/familyMembers',
    familyMembersController.getAllFamilyMembers,
    familyMembersController.getOneFamilyMember
  );
  server.post(
    '/api/familyMembers',
    familyMembersController.validateFamilyMember,
    familyMembersController.addFamilyMember
  );
  server.put(
    '/api/familyMembers',
    familyMembersController.validateFamilyMember,
    familyMembersController.familyMemberExists
  );
  server.delete(
    '/api/familyMembers',
    familyMembersController.familyMemberExists,
    familyMembersController.deleteFamilyMember
  );

  // TABLE PARTNERS
  server.get('/api/partners', partnersController.getAllPartners);
  server.get('/api/partner/:idPartner', partnersController.getOnePartner);

  server.post(
    '/api/partners',
    partnersController.validatePartner,
    partnersController.addPartner
  );
  server.put(
    '/api/partners',
    partnersController.validatePartner,
    partnersController.partnerExists
  );
  server.delete(
    '/api/partners,',
    partnersController.partnerExists,
    partnersController.deletePartner
  );

  // TABLE PAYMENTMETHODS
  server.get(
    '/api/paymentMethods',
    paymentMethodsController.getAllPaymentMethods
  );
  server.get(
    '/api/paymentMethod/:idPaymentMethod',
    paymentMethodsController.getOnePaymentMethod
  );

  // TABLE PAYMENTRECORDS
  server.get(
    '/api/paymentRecords',
    paymentRecordsController.getAllPaymentRecords
  );
  server.get(
    '/api/paymentRecord/:idPaymentRecord',
    paymentRecordsController.getOnePaymentRecord
  );
  server.post(
    '/api/paymentRecords',
    paymentRecordsController.validatePaymentRecord,
    paymentRecordsController.addPaymentRecord
  );
  server.put(
    '/api/paymentRecord/:idPaymentRecord',
    paymentRecordsController.validatePaymentRecord,
    paymentRecordsController.paymentRecordExists,
    paymentRecordsController.updatePaymentRecord
  );
  server.delete(
    '/api/paymentRecord/:idPaymentRecord',
    paymentRecordsController.paymentRecordExists,
    paymentRecordsController.deletePaymentRecord
  );

  // TABLE POSTTYPES
  server.get('/api/postTypes', postTypesController.getAllPostTypes);
  server.get('/api/postType/:idPostType', postTypesController.getOnePostType);

  // TABLE RECIPIENTS
  server.get('/api/recipients', recipientsController.getAllRecipients);
  server.get(
    '/api/recipient/:idRecipient',
    recipientsController.getOneRecipient
  );
  server.post(
    '/api/recipients',
    recipientsController.validateRecipient,
    recipientsController.addRecipient
  );
  server.put(
    '/api/recipients',
    recipientsController.validateRecipient,
    recipientsController.recipientExists
  );
  server.delete(
    '/api/recipients',
    recipientsController.recipientExists,
    recipientsController.deleteRecipient
  );
};

export default setupRoutes;
