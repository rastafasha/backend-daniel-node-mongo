const fs = require('fs');
const Profile = require('../models/profile');
const Blog = require('../models/blog');
const Pago = require('../models/pago');
const Banner = require('../models/banner');

const borrarImagen = (path) => {

    if (fs.existsSync(path)) {
        //borrar la imagen anterior
        fs.unlinkSync(path);
    }
}


const actualizarImagen = async(tipo, id, nombreArchivo) => {
    try {
        const mapTipo = {
            'profiles': await Profile.findById(id),
            'blogs': await Blog.findById(id),
            'pagos': await Pago.findById(id),
            'banners': await Banner.findById(id),
        }
        const resultadoColeccion = mapTipo[tipo];
        if (resultadoColeccion.length == 0) {
            return false;
        }

        const path = `../uploads/${tipo}/${resultadoColeccion.img}`
        if (fs.existsSync(path)) {
            //borrar la imagen si existe
            fs.unlinkSync(path)
        }
        resultadoColeccion.img = nombreArchivo;
        await resultadoColeccion.save();
        return true;


    } catch (error) {
        return false;
    }
}


module.exports = {
    actualizarImagen,
    borrarImagen
};