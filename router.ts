import activitiesController from './controllers/activities';
import adminsController from './controllers/admins';
import communicationMembersController from './controllers/communicationMembers';
import communicationsController from './controllers/communications';
import citiesController from './controllers/cities';
import documentsController from './controllers/documents';
import eventsController from './controllers/events';
import familiesController from './controllers/families';
import familyMemberActivitiesController from './controllers/familyMemberActivities';
import familyMemberEventsController from './controllers/familyMemberEvents';
import familyMembersController from './controllers/familyMembers';
import linkedDocumentsController from './controllers/linkedDocuments';
import newslettersController from './controllers/newsletters';
import partnersController from './controllers/partners';
import paymentMethodsController from './controllers/paymentMethods';
import paymentRecordsController from './controllers/paymentRecords';
import postTypesController from './controllers/postTypes';
import recipientsController from './controllers/recipients';
import authController from './controllers/auth';
import { Express } from 'express';

const setupRoutes = (server: Express) => {
  // LOGIN
  server.post('/api/login', authController.validateLogin, authController.login);
  server.post('/api/admins/login', authController.validateLogin, authController.loginAdmin);

  // TABLE ACTIVITIES
  server.get('/api/activities', activitiesController.getAllActivities);
  server.get(
    '/api/activities/:idActivity',
    activitiesController.getOneActivity
  );

  server.post(
    '/api/activities',
    activitiesController.validateActivity,
    activitiesController.addActivity
  );

  server.put(
    '/api/activities/:idActivity',
    activitiesController.validateActivity,
    activitiesController.activityExitsts,
    activitiesController.updateActivity
  );

  server.delete(
    '/api/activities/:idActivity',
    activitiesController.activityExitsts,
    activitiesController.deleteActivity
  );

  // TABLE ADMINS
  server.get('/api/admins', adminsController.getAllAdmins);
  server.get('/api/admins/:idAdmin', adminsController.getOneAdmin);

  server.post(
    '/api/admins',
    adminsController.validateAdmin,
    adminsController.emailIsFree,
    adminsController.addAdmin
  );

  server.put(
    '/api/admins/:idAdmin',
    adminsController.validateAdmin,
    adminsController.adminExists,
    adminsController.updateAdmin
  );

  server.delete(
    '/api/admins/:idAdmin',
    adminsController.adminExists,
    adminsController.deleteAdmin
  );

  // TABLE CITIES
  server.get('/api/cities', citiesController.getAllCities);
  server.get('/api/cities/:idCity', citiesController.getOneCity);

  server.post(
    '/api/cities',
    citiesController.validateCity,
    citiesController.addCity
  );

  server.put(
    '/api/cities/:idCity',
    citiesController.validateCity,
    citiesController.cityExists,
    citiesController.updateCity
  );

  server.delete(
    '/api/cities/:idCity',
    citiesController.cityExists,
    citiesController.deleteCity
  );

  // TABLE COMMUNICATIONS
  server.get(
    '/api/communications',
    communicationsController.getAllCommunications
  );
  server.get(
    '/api/communications/:idCommunication',
    communicationsController.getOneCommunication
  );
  server.post(
    '/api/communications/',
    communicationsController.validateCommunication,
    communicationsController.communicationExists,
    communicationsController.addCommunication
  );

  server.delete(
    '/api/communications/:idCommunication',
    communicationsController.communicationExists,
    communicationsController.deleteCommunication
  );

  // TABLE COMMUNICATIONMEMBERS
  server.get(
    '/api/communicationMembers',
    communicationMembersController.getAllCommunicationMembers
  );
  server.get(
    '/api/communicationMembers/:idCommunicationMember',
    communicationMembersController.getOneCommunicationMember
  );
  server.get(
    '/api/families/:idFamily/communicationMembers',
    communicationMembersController.getAllCommunicationMembersByIdFamily
  );

  server.post(
    '/api/communicationMembers',
    communicationMembersController.validateCommunicationMember,
    communicationMembersController.addCommunicationMember
  );

  server.put(
    '/api/communicationMembers/:idCommunicationMember',
    communicationMembersController.validateCommunicationMember,
    communicationMembersController.communicationMemberExists,
    communicationMembersController.updateCommunicationMember
  );

  server.delete(
    '/api/communicationMembers/:idCommunicationMember',
    communicationMembersController.communicationMemberExists,
    communicationMembersController.deleteCommunicationMember
  );

  // TABLE DOCUMENTS
  server.get('/api/documents', documentsController.getAllDocuments);
  server.get('/api/documents/:idDocument', documentsController.getOneDocument);

  server.post(
    '/api/documents',
    documentsController.validateDocument,
    documentsController.addDocument
  );

  server.put(
    '/api/documents/:idDocument',
    documentsController.validateDocument,
    documentsController.documentExists,
    documentsController.updateDocument
  );

  server.delete(
    '/api/documents/:idDocument',
    documentsController.documentExists,
    documentsController.deleteDocument
  );

  // TABLE EVENTS
  server.get('/api/events', eventsController.getAllEvents);
  server.get('/api/events/:idEvent', eventsController.getOneEvent);
  server.get(
    '/api/events/postTypes/:idPostType',
    eventsController.getAllEventsByPostType
  );
  server.get(
    '/api/events/activities/:idActivity',
    eventsController.getAllEventsByActivity
  );

  server.post(
    '/api/events/',
    eventsController.validateEvent,
    eventsController.idPostTypeExists,
    eventsController.idActvityExists,
    eventsController.addEvent
  );

  server.put(
    '/api/events/:idEvent',
    eventsController.validateEvent,
    eventsController.eventExists,
    eventsController.idPostTypeExists,
    eventsController.idActvityExists,
    eventsController.updateEvent
  );

  server.delete(
    '/api/events/:idEvent',
    eventsController.eventExists,
    eventsController.deleteEvent
  );

  // TABLE FAMILIES
  server.get('/api/families', familiesController.getAllFamilies);
  server.get('/api/families/:idFamily', familiesController.getOneFamily);

  server.post(
    '/api/families',
    familiesController.validateFamily,
    familiesController.emailIsFree,
    familiesController.addFamily
  );

  server.put(
    '/api/families/:idFamily',
    familiesController.validateFamily,
    familiesController.familyExists,
    familiesController.updateFamily
  );

  server.delete(
    '/api/families/:idFamily',
    familiesController.familyExists,
    familiesController.deleteFamily
  );

  // TABLE FAMILYMEMBERS
  server.get('/api/familyMembers', familyMembersController.getAllFamilyMembers);

  server.get(
    '/api/familyMembers/:idFamilyMember',
    familyMembersController.getOneFamilyMember
  );
  server.get(
    '/api/families/:idFamily/familyMembers',
    familyMembersController.getAllFamilyMembersByIdFamily
  );

  server.post(
    '/api/familyMembers',
    familyMembersController.validateFamilyMember,
    familyMembersController.addFamilyMember
  );

  server.put(
    '/api/familyMembers/:idFamilyMember',
    familyMembersController.validateFamilyMember,
    familyMembersController.familyMemberExists,
    familyMembersController.updateFamilyMember
  );

  server.delete(
    '/api/familyMembers/:idFamilyMember',
    familyMembersController.familyMemberExists,
    familyMembersController.deleteFamilyMember
  );

  // TABLE FAMILYMEMBERACTIVITIES
  server.get(
    '/api/familyMemberActivities',
    familyMemberActivitiesController.getAllFamilyMemberActivities,
    familyMemberActivitiesController.getOneFamilyMemberActivity
  );

  server.post(
    '/api/familyMemberActivities',
    familyMemberActivitiesController.validateFamilyMemberActivity,
    familyMemberActivitiesController.addFamilyMemberActivity
  );

  server.put(
    '/api/familyMemberActivities/:idFamilyMemberActivity',
    familyMemberActivitiesController.validateFamilyMemberActivity,
    familyMemberActivitiesController.familyMemberActivityExists
  );

  server.delete(
    '/api/familyMemberActivities/:idFamilyMemberActivity',
    familyMemberActivitiesController.familyMemberActivityExists,
    familyMemberActivitiesController.deleteFamilyMemberActivity
  );

  // TABLE FAMILYMEMBEREVENTS
  server.get(
    '/api/familyMemberEvents',
    familyMemberEventsController.getAllFamilyMemberEvents,
    familyMemberEventsController.getOneFamilyMemberEvent
  );

  server.post(
    '/api/familyMemberEvents',
    familyMemberEventsController.validateFamilyMemberEvent,
    familyMemberEventsController.addFamilyMemberEvent
  );

  server.put(
    '/api/familyMemberEvents/:idFamilyMemberEvent',
    familyMemberEventsController.validateFamilyMemberEvent,
    familyMemberEventsController.familyMemberEventExists
  );

  server.delete(
    '/api/familyMemberEvents/:idFamilyMemberEvent',
    familyMemberEventsController.familyMemberEventExists,
    familyMemberEventsController.deleteFamilyMemberEvent
  );

  // TABLE LINKEDDOCUMENTS
  server.get(
    '/api/linkedDocuments',
    linkedDocumentsController.getAllLinkedDocuments
  );
  server.get(
    '/api/linkedDocuments/:idLinkedDocument',
    linkedDocumentsController.getOneLinkedDocument
  );
  server.get(
    '/api/families/:idFamily/linkedDocuments',
    linkedDocumentsController.getAllLinkedDocumentsByIdFamily
  );

  server.post(
    '/api/linkedDocuments',
    linkedDocumentsController.validateLinkedDocument,
    linkedDocumentsController.idEventExists,
    linkedDocumentsController.idDocumentExists,
    linkedDocumentsController.addLinkedDocument
  );

  server.put(
    '/api/linkedDocuments/:idLinkedDocument',
    linkedDocumentsController.validateLinkedDocument,
    linkedDocumentsController.linkedDocumentExists,
    linkedDocumentsController.idEventExists,
    linkedDocumentsController.idDocumentExists,
    linkedDocumentsController.updateLinkedDocument
  );

  server.delete(
    '/api/linkedDocuments/:idLinkedDocument',
    linkedDocumentsController.linkedDocumentExists,
    linkedDocumentsController.deleteLinkedDocument
  );

  // TABLE NEWSLETTER
  server.get('/api/newsletters', newslettersController.getAllNewsletters);
  server.get(
    '/api/newsletters/:idNewsletter',
    newslettersController.getOneNewsletter
  );

  server.post(
    '/api/newsletters',
    newslettersController.validateNewsletter,
    newslettersController.addNewsletter
  );

  server.put(
    '/api/newsletters/:idNewsletter',
    newslettersController.validateNewsletter,
    newslettersController.newsletterExists,
    newslettersController.updateNewsletter
  );

  server.delete(
    '/api/newsletters/:idNewsletter',
    newslettersController.newsletterExists,
    newslettersController.deleteNewsletter
  );

  // TABLE PARTNERS
  server.get('/api/partners', partnersController.getAllPartners);
  server.get('/api/partners/:idPartner', partnersController.getOnePartner);

  server.post(
    '/api/partners',
    partnersController.validatePartner,
    partnersController.addPartner
  );

  server.put(
    '/api/partners/:idPartner',
    partnersController.validatePartner,
    partnersController.partnerExists
  );

  server.delete(
    '/api/partners/:idPartner,',
    partnersController.partnerExists,
    partnersController.deletePartner
  );

  // TABLE PAYMENTMETHODS
  server.get(
    '/api/paymentMethods',
    paymentMethodsController.getAllPaymentMethods
  );
  server.get(
    '/api/paymentMethods/:idPaymentMethod',
    paymentMethodsController.getOnePaymentMethod
  );

  // TABLE PAYMENTRECORDS
  server.get(
    '/api/paymentRecords',
    paymentRecordsController.getAllPaymentRecords
  );

  server.get(
    '/api/paymentRecords/:idPaymentRecord',
    paymentRecordsController.getOnePaymentRecord
  );

  server.get(
    '/api/families/:idFamily/paymentRecords',
    paymentRecordsController.getAllPaymentRecordsByIdFamily
  );

  server.post(
    '/api/paymentRecords',
    paymentRecordsController.validatePaymentRecord,
    paymentRecordsController.addPaymentRecord
  );

  server.put(
    '/api/paymentRecords/:idPaymentRecord',
    paymentRecordsController.validatePaymentRecord,
    paymentRecordsController.paymentRecordExists,
    paymentRecordsController.updatePaymentRecord
  );

  server.delete(
    '/api/paymentRecords/:idPaymentRecord',
    paymentRecordsController.paymentRecordExists,
    paymentRecordsController.deletePaymentRecord
  );

  // TABLE POSTTYPES
  server.get('/api/postTypes', postTypesController.getAllPostTypes);
  server.get('/api/postTypes/:idPostType', postTypesController.getOnePostType);

  // TABLE RECIPIENTS
  server.get('/api/recipients', recipientsController.getAllRecipients);
  server.get(
    '/api/recipients/:idRecipient',
    recipientsController.getOneRecipient
  );

  server.post(
    '/api/recipients',
    recipientsController.validateRecipient,
    recipientsController.addRecipient
  );

  server.put(
    '/api/recipients/:idRecipient',
    recipientsController.validateRecipient,
    recipientsController.recipientExists
  );

  server.delete(
    '/api/recipients/:idRecipient',
    recipientsController.recipientExists,
    recipientsController.deleteRecipient
  );
};

export default setupRoutes;
