
const fs = require('fs');
const Profile = require('../models/profile');
const Blog = require('../models/blog');
const Sideadvertising = require('../models/sideadvice');
const Banner = require('../models/banner');
const Binancepay = require('../models/binancepay');

const borrarImagen = (path) => {

    if (fs.existsSync(path)) {
        //borrar la imagen anterior
        fs.unlinkSync(path);
    }
}


const actualizarImagen = async(tipo, id, nombreArchivo, extensionArchivo) => {
    try {
        const mapTipo = {
            'profiles': await Profile.findById(id),
            'blogs': await Blog.findById(id),
            'sideadvertisings': await Sideadvertising.findById(id),
            'banners': await Banner.findById(id),
            'binancepays': await Binancepay.findById(id),
        }
        const resultadoColeccion = mapTipo[tipo];
        if (resultadoColeccion.length == 0) {
            return false;
        }
        
        const path = `../../uploads/${tipo}/${resultadoColeccion.img}`
        if (fs.existsSync(path)) {
            //borrar la imagen si existe
            fs.unlinkSync(path)
        }
        resultadoColeccion.img = `${nombreArchivo}`; // Update the image name with concatenation
        resultadoColeccion.extension = extensionArchivo; // Store the file extension
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
