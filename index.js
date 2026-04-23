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
// Initialize socket.io with the server
const allowedOrigins = [
  "http://localhost:4200",
  "http://localhost:4203",
  "https://malcolmcordova.com/article-shop",
  "https://malcolmcordova.com/admin-node-articles-shop",
];

// Configuración compartida
const corsOptions = {
  origin: (origin, callback) => {
    // Si el origen está en la lista o es una petición local (sin origen)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Origin no permitido por CORS'));
    }
  },
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 204
};

//cors
app.use(cors(corsOptions));


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
app.use('/api/planpaypal', require('./src/routes/planpaypal'));
app.use('/api/subcriptionpaypal', require('./src/routes/subcripcionpaypaldb'));
app.use('/api/sideadvices', require('./src/routes/sideadvice'));


//rutas



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
