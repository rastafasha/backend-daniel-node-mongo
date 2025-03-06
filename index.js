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


//crear server de express
const app = express();

const server = require('http').Server(app);

// const { testing } = require('./testing');
//cron jobs
// const { crons } = require('./src/cronjobs/cronjobs');
//cron jobs

//cors
app.use(cors());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); // Temporarily allow all origins for testing
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});



const options = {
    cors: {
        origin: '*', // Temporarily allow all origins for testing
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
app.use('/api/contactos', require('./src/routes/contacto'));

app.use('/api/cursos', require('./src/routes/curso'));
app.use('/api/videos', require('./src/routes/video'));
app.use('/api/favoritos', require('./src/routes/favorito'));

app.use('/api/paypal', require('./src/routes/paypal'));
app.use('/api/binancepay', require('./src/routes/binancepay'));
app.use('/api/planpaypal', require('./src/routes/planpaypal'));
app.use('/api/subcriptionpaypal', require('./src/routes/subcripcionpaypaldb'));
app.use('/api/sideadvices', require('./src/routes/sideadvice'));


//rutas


//storage
const axios = require('axios');
TOKEN_VERCEL_STORAGE = '1290b16d-703d-4b01-9916-5fcd2906d708';

async function middleware(req, res) {
  try {
    const response = await axios.get(`https://api.vercel.com/v1/edge-config?slug=backend-daniel-node-mongo-storag`, {
      headers: {
        Authorization: `Bearer ${TOKEN_VERCEL_STORAGE}`,
        'Content-Type': 'application/json',
      },
      timeout: 5000 // agregar un timeout de 5 segundos
    });

    const greeting = response.data;

    res.json(greeting);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener la configuración' });
  }
}

// Para usar la función middleware en Node.js, puedes agregarla a una ruta en tu servidor
app.get('/storage', middleware);
//fin storage

//test
app.get("/", (req, res) => {
    res.json({ message: "Welcome to nodejs." });
});

app.get("/welcome", (req, res) => res.type('html').send(html));

app.use(bodyParser.json());




//lo ultimo
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public')); //ruta para produccion, evita perder la ruta
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
      Hello from Backend Nodejs!
    </section>
  </body>
</html>
`






server.listen(process.env.PORT, () => {
    console.log('Servidor en puerto: ' + process.env.PORT);
});
