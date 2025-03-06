const path = require('path');
const fs = require('fs');
const { response } = require('express');
const { v4: uuidv4 } = require('uuid');
const { actualizarImagen } = require('../helpers/actualizar-imagen');
const cloudinary = require('cloudinary').v2;

// configurar cloudinary
cloudinary.config({
    api_key: process.env.API_KEY_CLOUDINARY,
    api_secret: process.env.API_SECRET_CLOUDINARY,
    cloud_name: process.env.CLOUD_NAME
})
const fileUpload = async (req, res = response) => {

    const tipo = req.params.tipo;
    const id = req.params.id;

    const tiposValidos = [
        'profiles', 'blogs', 'pagos', 
        'banners', 'binancepays', 
        'sideadvertisings'];

    if (!tiposValidos.includes(tipo)) {
        return res.status(400).json({
            ok: false,
            msg: 'No es un tipo permitido (tipo)'
        });
    }
    // validar que exista un archivo
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            msn: 'No hay ningun archivo'
        });
    }

    // procesar la imagen
    const file = req.files.img;

    const nombreCortado = file.name.split('.');
    const extensionArchivo = nombreCortado[nombreCortado.length - 1];

    //validar extension
    const extensionesValidas = ['png', 'jpg', 'jpeg', 'gif'];
    if (!extensionesValidas.includes(extensionArchivo)) {
        return res.status(400).json({
            ok: false,
            msn: 'No es una extension permitida'
        });
    }

    //generar el nombre del archivo
    const nombreArchivo = `${uuidv4()}.${extensionArchivo}`;

    //path para guardar la imagen
    const savePath = `./uploads/${tipo}/${nombreArchivo}`;
    // fs.mkdirSync(path.dirname(savePath), { recursive: true });
    path.dirname(savePath), { recursive: true }
     
    //mover la imagen
    file.mv(savePath, async (err) => {
        if (err) {
            // console.log(err)
            return res.status(500).json({
                ok: false,
                msg: 'Error al mover la imagen'
            });
        }
        // subir a Cloudinary
        try {
            const result = await cloudinary.uploader.upload(savePath, {
                folder: `articlesApp/uploads/${tipo}/`
            });
            console.log(result);
            
            //actualizar bd
            const nombreArchivo = result.secure_url
            actualizarImagen(tipo, id, nombreArchivo ); // Use the public ID from Cloudinary and the file extension
            // actualizarImagen(tipo, id, `${result.secure_url}` ); // Use the public ID from Cloudinary and the file extension
            // actualizarImagen(tipo, id, `${result.display_name}.${extensionArchivo}` ); // Use the public ID from Cloudinary and the file extension
            console.log(nombreArchivo);

            res.json({
                ok: true,
                msg: 'Archivo subido',
                nombreArchivo
            });
        } catch (error) {
            return res.status(500).json({
                ok: false,
                msg: 'Error al subir la imagen a Cloudinary',
                error: error.message
            });
        }
    });

};

const retornaImagen = (req, res) => {
    const tipo = req.params.tipo;
    const foto = req.params.foto;

    const pathImg = path.join(__dirname, `../../uploads/${tipo}/${foto}`);
    //traigo la foto desde cloudinary
    const urlImg = cloudinary.url(foto, {
        width: 300,
        height: 300,
        crop: 'fill'
    });
    //imagen por defecto
    if (fs.existsSync(pathImg)) {
        res.sendFile(pathImg);

    } else {
        const pathImg = path.join(__dirname, `../../uploads/${tipo}/no-image.jpg`);
        res.sendFile(pathImg);
    }


};






module.exports = {
    fileUpload,
    retornaImagen
}
