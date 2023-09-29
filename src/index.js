require('dotenv').config();
const express = require('express');
const { dbConnection } = require('./database/config');
const cors = require('cors');
const path = require('path');
const http = require('http');
const bodyParser = require('body-parser');
//cronjobs - tareas programadas
const cron = require("node-cron");
//send email after 1 minute
const nodemailer = require("nodemailer");
//Monitoring Server Resources Over Time
const process = require("process");
const fs = require("fs");
const os = require("os");
//cronjobs 

const Pago = require('./models/pago');


//crear server de express
const app = express();

const server = require('http').Server(app);

// const { testing } = require('./testing');


//cors
app.use(cors());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});



const options = {
    cors: {
        origin: 'http://localhost:4200',
    },
};


//lectura y parseo del body
app.use(express.json());

//db
dbConnection();

//directiorio publico de pruebas de google
app.use(express.static('public'));


//rutas
app.use('/api/auth', require('./routes/auth'));
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/profile', require('./routes/profile'));
app.use('/api/blogs', require('./routes/blog'));
app.use('/api/categorias', require('./routes/categoria'));
app.use('/api/plans', require('./routes/plan'));
app.use('/api/pagos', require('./routes/pago'));
app.use('/api/banners', require('./routes/banner'));
app.use('/api/uploads', require('./routes/uploads'));
app.use('/api/todo', require('./routes/busquedas'));
app.use('/api/contacto', require('./routes/contacto'));

app.use('/api/cursos', require('./routes/curso'));
app.use('/api/videos', require('./routes/video'));
app.use('/api/favoritos', require('./routes/favorito'));

app.use('/api/paypal', require('./routes/paypal'));
app.use('/api/binancepay', require('./routes/binancepay'));
app.use('/api/planpaypal', require('./routes/planpaypal'));
app.use('/api/subcriptionpaypal', require('./routes/subcripcionpaypaldb'));

//test
app.get("/", (req, res) => {
    res.json({ message: "Welcome to nodejs." });
});

app.use(bodyParser.json());

//cron jobs

//repite cada 15 segundos
// cron.schedule("*/15 * * * * *", function () {
//   console.log("---------------------");
//   console.log("running a task every 15 seconds");
// });
//repite cada 15 segundos


//send email after 1 minute
cron.schedule("1 * * * *", function () {
    // mailService();
  });
  
  function mailService() {
    let mailTransporter = nodemailer.createTransport({
      service: "gmail",
      host: 'smtp.gmail.com',
        port: 587,
      auth: {
        user: "mercadocreativo@gmail.com",
  // use generated app password for gmail
        pass: "brcgdrbbddkmuxhk",
      },
    });
  
    // setting credentials
    let mailDetails = {
      from: "mercadocreativo@gmail.com",
    //   to: "<user-email>@gmail.com",
      to: "mercadocreativo@gmail.com",
      subject: "Test Mail using Cron Job",
      text: "Node.js Cron Job Email Demo Test from Reflectoring Blog",
    };
  
    // sending email
    mailTransporter.sendMail(mailDetails, function (err, data) {
      if (err) {
        console.log("error occurred", err.message);
      } else {
        console.log("---------------------");
        console.log("email sent successfully");
      }
    });
  }

//Monitoring Server Resources Over Time
// setting a cron job for every 15 seconds
// cron.schedule("*/15 * * * * *", function () {
//     let heap = process.memoryUsage().heapUsed / 1024 / 1024;
//     let date = new Date().toISOString();
//     const freeMemory = Math.round((os.freemem() * 100) / os.totalmem()) + "%";
  
//     //                 date | heap used | free memory
//     let csv = `${date}, ${heap}, ${freeMemory}\n`;
  
//     // storing log In .csv file
//     fs.appendFile("./uploads/demo.csv", csv, function (err) {
//       if (err) throw err;
//       console.log("server details logged!");
//     });
//   });
//Monitoring Server Resources Over Time

// remove the demo.csv file every twenty-first day of the month.
// cron.schedule("0 0 25 * *", function () {
//     console.log("---------------------");
//     console.log("deleting logged status");
//     fs.unlink("./demo.csv", err => {
//       if (err) throw err;
//       console.log("deleted successfully");
//     });
//   });


//update compra
//   cron.schedule("*/60 * * * * *", function () {
//   console.log("---------------------");
//   console.log("running a task every 60 seconds");

//   Pago.findByIdAndUpdate({ _id: id }, { status: 'Desactivado' }, (err, pago_data) => {
//     if (err) {
//         res.status(500).send({ message: err });
//     } else {
//         if (pago_data) {
//             res.status(200).send({ pago: pago_data });
//         } else {
//             res.status(403).send({ message: 'No se actualizó el pago, vuelva a intentar nuevamente.' });
//         }
//     }

//     console.log("--pago_data", pago_data);
// })

// });



//cron jobs


//lo ultimo
// app.get('*', (req, res) => {
//     res.sendFile(path.resolve(__dirname, 'public/index.html')); //ruta para produccion, evita perder la ruta
// });






server.listen(process.env.PORT, () => {
    console.log('Servidor en puerto: ' + process.env.PORT);
});