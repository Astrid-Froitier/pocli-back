// import addressesController from './controllers/addressesInit';
// // import authController from './controllers/authInit';
// import commentsController from './controllers/comments';
// import historyNewsController from './controllers/historyNews';
// import historyPartnersController from './controllers/historyPartners';
// import historyUsersController from './controllers/historyUsers';
// import newsController from './controllers/news';
// import newsTypesController from './controllers/newsTypes';
// import partnersController from './controllers/partners';
// import partnersTypesController from './controllers/partnersTypes';
// import usersController from './controllers/users';
import { Express } from 'express';
import familiesController from './controllers/families';

const setupRoutes = (server: Express) => {
  //   // get
  //   server.get('/api/users', usersController.getAllUsers);
  //   server.get('/api/comments', commentsController.getAllComments);
  //   server.get('/api/historyNews', historyNewsController.getAllHistoryNews);
  //   server.get(
  //     '/api/historyPartners',
  //     historyPartnersController.getAllHistoryPartners
  //   );
  //   server.get('/api/historyUsers', historyUsersController.getAllHistoryUsers);
  //   server.get('/api/news', newsController.getAllNews);
  //   server.get('/api/newsTypes', newsTypesController.getAllNewsTypes);
  //   server.get('/api/partners', partnersController.getAllPartners);
  //   server.get('/api/partnersTypes', partnersTypesController.getAllPartnersTypes);
  //   // get by id
  //   server.get('/api/users/:idUser', usersController.getOneUser);
  //   server.get('/api/comments/:idComment', commentsController.getOneComment);
  //   server.get(
  //     '/api/historyNews/:idHistoryNew',
  //     historyNewsController.getOneHistoryNew
  //   );
  //   server.get(
  //     '/api/historyPartners/:idHistoryPartner',
  //     historyPartnersController.getOneHistoryPartner
  //   );
  //   server.get(
  //     '/api/historyUsers/:idHistoryUsers',
  //     historyUsersController.getOneHistoryUser
  //   );
  //   server.get('/api/news/:idNew', newsController.getOneNew);
  //   server.get('/api/newsTypes/:idNewsTypes', newsTypesController.getOneNewsType);
  //   server.get('/api/partners/:idPartners', partnersController.getOnePartner);
  //   server.get(
  //     '/api/partnersTypes/:idPartnersTypes',
  //     partnersTypesController.getOnePartnersType
  //   );
  //   // post
  //   server.post(
  //     '/api/users',
  //     usersController.validateUser,
  //     usersController.emailIsFree,
  //     usersController.phoneNumberIsFree,
  //     usersController.addUser
  //   );
  //   server.post(
  //     '/api/comments',
  //     commentsController.validateComment,
  //     commentsController.addComment
  //   );
  //   server.post(
  //     '/api/historyNews',
  //     historyNewsController.validateHistoryNew,
  //     historyNewsController.addHistoryNew
  //   );
  //   server.post(
  //     '/api/historyPartners',
  //     historyPartnersController.validateHistoryPartner,
  //     historyPartnersController.nameIsFree,
  //     historyPartnersController.siretNumberIsFree,
  //     historyPartnersController.addHistoryPartner
  //   );
  //   server.post(
  //     '/api/historyUsers',
  //     historyUsersController.validateHistoryUser,
  //     historyUsersController.emailIsFree,
  //     historyUsersController.phoneNumberIsFree,
  //     historyUsersController.addHistoryUser
  //   );
  //   server.post('/api/news', newsController.validateNew, newsController.addNew);
  //   server.post(
  //     '/api/newsTypes',
  //     newsTypesController.validateNewsType,
  //     newsTypesController.nameIsFree,
  //     newsTypesController.addNewsType
  //   );
  //   server.post(
  //     '/api/partners',
  //     partnersController.validatePartner,
  //     partnersController.nameIsFree,
  //     partnersController.siretNumberIsFree,
  //     partnersController.addPartner
  //   );
  //   server.post(
  //     '/api/partnersTypes',
  //     partnersTypesController.validatePartnersType,
  //     partnersTypesController.nameIsFree,
  //     partnersTypesController.addPartnersType
  //   );
  //   // put
  //   server.put(
  //     '/api/users/:idUser',
  //     usersController.validateUser,
  //     usersController.userExists,
  //     usersController.updateUser
  //   );
  //   server.put(
  //     '/api/:idComment',
  //     commentsController.validateComment,
  //     commentsController.commentExists,
  //     commentsController.updateComment
  //   );
  //   server.put(
  //     '/api/:idHistoryNew',
  //     historyNewsController.validateHistoryNew,
  //     historyNewsController.historyNewExists,
  //     historyNewsController.updateHistoryNew
  //   );
  //   server.put(
  //     '/api/:idHistoryPartner',
  //     historyPartnersController.validateHistoryPartner,
  //     historyPartnersController.historyPartnerExists,
  //     historyPartnersController.updateHistoryPartner
  //   );
  //   server.put(
  //     '/api/:idHistoryUser',
  //     historyUsersController.validateHistoryUser,
  //     historyUsersController.historyUserExists,
  //     historyUsersController.updateHistoryUser
  //   );
  //   server.put(
  //     '/api/:idNews',
  //     newsController.validateNew,
  //     newsController.newExists,
  //     newsController.updateNew
  //   );
  //   server.put(
  //     '/api/:idNewsTypes',
  //     newsTypesController.validateNewsType,
  //     newsTypesController.newsTypeExists,
  //     newsTypesController.updateNewsType
  //   );
  //   server.put(
  //     '/api/:idPartner',
  //     partnersController.validatePartner,
  //     partnersController.partnerExists,
  //     partnersController.updatepartner
  //   );
  //   server.put(
  //     '/api/:idPartnersType',
  //     partnersTypesController.validatePartnersType,
  //     partnersTypesController.partnersTypeExists,
  //     partnersTypesController.updatePartnersType
  //   );
  //   // delete by id
  //   server.delete(
  //     '/api/users/:idUser',
  //     usersController.userExists,
  //     usersController.deleteUser
  //   );
  //   server.delete(
  //     '/api/comments/:idComment',
  //     commentsController.commentExists,
  //     commentsController.deleteComment
  //   );
  //   server.delete(
  //     '/api/historyNews/:idHistoryNew',
  //     historyNewsController.historyNewExists,
  //     historyNewsController.deleteHistoryNew
  //   );
  //   server.delete(
  //     '/api/historyPartners/:idHistoryPartner',
  //     historyPartnersController.historyPartnerExists,
  //     historyPartnersController.deleteHistoryPartner
  //   );
  //   server.delete(
  //     '/api/historyUsers/:idHistoryUser',
  //     historyUsersController.historyUserExists,
  //     historyUsersController.deleteHistoryUser
  //   );
  //   server.delete(
  //     '/api/news/:idNew',
  //     newsController.newExists,
  //     newsController.deleteNew
  //   );
  //   server.delete(
  //     '/api/newsTypes/newsType',
  //     newsTypesController.newsTypeExists,
  //     newsTypesController.deleteNewsType
  //   );
  //   server.delete(
  //     '/api/partners/:idPartner',
  //     partnersController.partnerExists,
  //     partnersController.deletePartner
  //   );
  //   server.delete(
  //     '/api/partnersTypes/:idPartnersType',
  //     partnersTypesController.partnersTypeExists,
  //     partnersTypesController.deletePartnersType
  //   );
};

export default setupRoutes;

// //   // LOGIN
// //   server.post('/api/login', authController.validateLogin, authController.login);

// //   // ADDRESSES
// //   // get addresses
// //   server.get('/api/addresses', addressesController.getAllAddresses);
// //   // get address by id
// //   server.get('/api/addresses/:idAddress', addressesController.getAddressById);

// //   // get addresses by user
// //   server.get(
// //     '/api/users/:idUser/addresses',
// //     usersController.userExists,
// //     authController.getCurrentSession,
// //     usersController.getAddressesByUser
// //   );
// //   // delete addresses by user
// //   server.delete(
// //     '/api/users/:idUser/addresses',
// //     authController.getCurrentSession,
// //     authController.checkSessionPrivileges,
// //     usersController.userExists,
// //     usersController.deleteAddressesByUser
// //   );
// //   // delete address by id
// //   server.delete(
// //     '/api/addresses/:idAddress',
// //     authController.getCurrentSession,
// //     authController.checkSessionPrivileges,
// //     addressesController.addressExists,
// //     addressesController.deleteAddress
// //   );
// //   // add an address
// //   server.post(
// //     '/api/addresses/',
// //     authController.getCurrentSession,
// //     authController.checkSessionPrivileges,
// //     addressesController.validateAddress,
// //     addressesController.addAddress
// //   );
// //   // put address, checks if an address exists and updates it
// //   server.put(
// //     '/api/addresses/:idAddress',
// //     authController.getCurrentSession,
// //     authController.checkSessionPrivileges,
// //     addressesController.addressExists,
// //     addressesController.validateAddress,
// //     addressesController.updateAddress
// //   );
// // };
