require('dotenv').config();
const express = require('express');
const { dbConnection } = require('./database/config');
const cors = require('cors');
const path = require('path');
const http = require('http');
const bodyParser = require('body-parser');
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
app.use('/api/paypal', require('./routes/paypal'));

//test
app.get("/", (req, res) => {
    res.json({ message: "Welcome to nodejs." });
});

app.use(bodyParser.json());



//lo ultimo
// app.get('*', (req, res) => {
//     res.sendFile(path.resolve(__dirname, 'public/index.html')); //ruta para produccion, evita perder la ruta
// });




server.listen(process.env.PORT, () => {
    console.log('Servidor en puerto: ' + process.env.PORT);
});