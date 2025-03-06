const Profile = require('../models/profile');
const Blog = require('../models/blog');
const Sideadvertising = require('../models/sideadvice');
const Banner = require('../models/banner');
const Binancepay = require('../models/binancepay');



const actualizarImagenCloudinary = async(tipo, id, nombreArchivo) => {
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
        
        // No local file deletion logic needed
        resultadoColeccion.img = `${nombreArchivo}`; // Update the image name with concatenation
        // No need to store the file extension
        await resultadoColeccion.save();
        return true;


    } catch (error) {
        return false;
    }
}


module.exports = {
    actualizarImagenCloudinary
};

