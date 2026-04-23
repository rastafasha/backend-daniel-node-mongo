const { response } = require('express');
const Video = require('../models/video');


const getVideos = async(req, res) => {

    const videos = await Video.find({})
    // .populate('curso')
    res.json({
        ok: true,
        videos
    });
};

const getVideo = async(req, res) => {

    const id = req.params.id;
    const uid = req.uid;

    Video.findById(id, {})
    // .populate('curso')
        .exec((err, video) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar video',
                    errors: err
                });
            }
            if (!video) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El video con el id ' + id + 'no existe',
                    errors: { message: 'No existe un video con ese ID' }
                });

            }
            res.status(200).json({
                ok: true,
                video: video
            });
        });

};

const crearVideo = async(req, res) => {

    const uid = req.uid;
    const video = new Video({
        usuario: uid,
        ...req.body
    });

    try {

        const videoDB = await video.save();

        res.json({
            ok: true,
            video: videoDB
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el admin'
        });
    }


};

const actualizarVideo = async(req, res) => {

    const id = req.params.id;
    const uid = req.uid;

    try {

        const video = await Video.findById(id);
        if (!video) {
            return res.status(500).json({
                ok: false,
                msg: 'video no encontrado por el id'
            });
        }

        const cambiosVideo = {
            ...req.body,
            usuario: uid
        }

        const videoActualizado = await Curso.findByIdAndUpdate(id, cambiosVideo, { new: true });

        res.json({
            ok: true,
            videoActualizado
        });

    } catch (error) {

        res.status(500).json({
            ok: false,
            msg: 'Error hable con el admin'
        });
    }


};

const borrarVideo = async(req, res) => {

    const id = req.params.id;

    try {

        const video = await Video.findById(id);
        if (!video) {
            return res.status(500).json({
                ok: false,
                msg: 'video no encontrado por el id'
            });
        }

        await Video.findByIdAndDelete(id);

        res.json({
            ok: true,
            msg: 'video eliminado'
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error hable con el admin'
        });
    }
};


function desactivar(req, res) {
    var id = req.params['id'];

    Video.findByIdAndUpdate({ _id: id }, { status: 'Desactivado' }, (err, video_data) => {
        if (err) {
            res.status(500).send({ message: err });
        } else {
            if (video_data) {
                res.status(200).send({ video: video_data });
            } else {
                res.status(403).send({ message: 'No se actualizó el video, vuelva a intentar nuevamente.' });
            }
        }
    })
}

function activar(req, res) {
    var id = req.params['id'];
    // console.log(id);
    Video.findByIdAndUpdate({ _id: id }, { status: 'Activo' }, (err, video_data) => {
        if (err) {
            res.status(500).send({ message: err });
        } else {
            if (video_data) {
                res.status(200).send({ video: video_data });
            } else {
                res.status(403).send({ message: 'No se actualizó el video, vuelva a intentar nuevamente.' });
            }
        }
    })
}

const listarVideoPorCurso = (req, res) => {
    var id = req.params['id'];
    Video.find({ curso: id }, (err, video_data) => {
        if (!err) {
            if (video_data) {
                res.status(200).send({ videos: video_data });
            } else {
                res.status(500).send({ error: err });
            }
        } else {
            res.status(500).send({ error: err });
        }
    })
    // .populate('curso');
}



module.exports = {
    getVideos,
    getVideo,
    crearVideo,
    actualizarVideo,
    borrarVideo,
    desactivar,
    activar,
    listarVideoPorCurso,
};