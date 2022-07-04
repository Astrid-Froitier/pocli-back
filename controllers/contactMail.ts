// import express from 'express';
// const app = express();
// import IContactMail from '../interfaces/IContactMail';
// import nodemailer from 'nodemailer-react';
// import cors from 'cors';
// require('dotenv').config();

// const port = process.env.PORT || 8000;

// app.use(express.json());

// const corsOptions = {
  // origin: process.env.CORS_ORIGIN,
  // credentials: true, // access-control-allow-credentials:true
//   optionSuccessStatus: 200,
//   maxAge: 3600,
// };
// app.use(cors(corsOptions));

// app.post('/', (req: Request, res: Response) => {
//   const { firstname, lastname, email, subject, text } = req.body;
//   const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//       user: 'jimmy.ganci@gmail.com',
//       pass: process.env.PWD_GMAIL,
//     },
//   });

//   const mailOptions = {
//     from: 'myPortefolio',
//     to: 'jimmy.ganci@gmail.com',
//     subject: subject,
//     text: `Vous avez reçu un mail de: ${email}!
// 	Prénom:${firstname}
// 	Nom:${lastname}
// 	Sujet:${subject}
// 	Message: ${text}`,
//   };

//   transporter.sendMail(mailOptions, function (error: object, info: object) {
//     if (error) {
//       console.log(error);
//     } else {
//       console.log('Email sent: ' + info.response);
//     }
//   });
//   res.status(200).send();
// });

// app.listen(port, () => {
//   console.log(`Server listening on port ${port}`);
// });
