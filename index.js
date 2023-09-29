require('dotenv').config();
const express = require('express');
const { dbConnection } = require('./src/database/config');
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

const Pago = require('./src/models/pago');


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
app.use('/api/auth', require('./src/routes/auth'));
app.use('/api/usuarios', require('./src/routes/usuarios'));
app.use('/api/profile', require('./src/routes/profile'));
app.use('/api/blogs', require('./src/routes/blog'));
app.use('/api/categorias', require('./src/routes/categoria'));
app.use('/api/plans', require('./src/routes/plan'));
app.use('/api/pagos', require('./src/routes/pago'));
app.use('/api/banners', require('./src/routes/banner'));
app.use('/api/uploads', require('./src/routes/uploads'));
app.use('/api/todo', require('./src/routes/busquedas'));
app.use('/api/contacto', require('./src/routes/contacto'));

app.use('/api/cursos', require('./src/routes/curso'));
app.use('/api/videos', require('./src/routes/video'));
app.use('/api/favoritos', require('./src/routes/favorito'));

app.use('/api/paypal', require('./src/routes/paypal'));
app.use('/api/binancepay', require('./src/routes/binancepay'));
app.use('/api/planpaypal', require('./src/routes/planpaypal'));
app.use('/api/subcriptionpaypal', require('./src/routes/subcripcionpaypaldb'));

//test
app.get("/", (req, res) => {
    res.json({ message: "Welcome to nodejs." });
});

app.get("/welcome", (req, res) => res.type('html').send(html));

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
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public/index.html')); //ruta para produccion, evita perder la ruta
});



server.keepAliveTimeout = 120 * 1000;
server.headersTimeout = 120 * 1000;

const html = `
<!DOCTYPE html>
<html>
  <head>
    <title>Hello from Render!</title>
    <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.5.1/dist/confetti.browser.min.js"></script>
    <script>
      setTimeout(() => {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          disableForReducedMotion: true
        });
      }, 500);
    </script>
    <style>
      @import url("https://p.typekit.net/p.css?s=1&k=vnd5zic&ht=tk&f=39475.39476.39477.39478.39479.39480.39481.39482&a=18673890&app=typekit&e=css");
      @font-face {
        font-family: "neo-sans";
        src: url("https://use.typekit.net/af/00ac0a/00000000000000003b9b2033/27/l?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3") format("woff2"), url("https://use.typekit.net/af/00ac0a/00000000000000003b9b2033/27/d?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3") format("woff"), url("https://use.typekit.net/af/00ac0a/00000000000000003b9b2033/27/a?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3") format("opentype");
        font-style: normal;
        font-weight: 700;
      }
      html {
        font-family: neo-sans;
        font-weight: 700;
        font-size: calc(62rem / 16);
      }
      body {
        background: white;
      }
      section {
        border-radius: 1em;
        padding: 1em;
        position: absolute;
        top: 50%;
        left: 50%;
        margin-right: -50%;
        transform: translate(-50%, -50%);
      }
    </style>
  </head>
  <body>
    <section>
      Hello from Render!
    </section>
  </body>
</html>
`






server.listen(process.env.PORT, () => {
    console.log('Servidor en puerto: ' + process.env.PORT);
});