const { response } = require('express');
const Subcriptionpaypal = require('../models/subcriptionPaypal');


const getSubcriptionPlanPaypals = async(req, res) => {

    const subcriptionPaypals = await Subcriptionpaypal.find()
    .populate('usuario');

    res.json({
        ok: true,
        subcriptionPaypals
    });
};

const getSubcriptionPlanPaypal = async(req, res) => {

    const id = req.params.id;

    Subcriptionpaypal.findById(id)
        .populate('usuario')
        .exec((err, subcriptionPaypal) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar subcriptionPaypal',
                    errors: err
                });
            }
            if (!subcriptionPaypal) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El subcriptionPaypal con el id ' + id + 'no existe',
                    errors: { message: 'No existe un subcriptionPaypal con ese ID' }
                });

            }
            res.status(200).json({
                ok: true,
                subcriptionPaypal: subcriptionPaypal
            });
        });

};

const crearSubcriptionPlanPaypal = async(req, res) => {

    const uid = req.uid;
    const subcriptionPaypal = new Subcriptionpaypal({
        usuario: uid,
        ...req.body
    });

    try {

        const subcriptionPaypalDB = await subcriptionPaypal.save();

        res.json({
            ok: true,
            subcriptionPaypal: subcriptionPaypalDB
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el admin'
        });
    }


};

const actualizarSubcriptionPlanPaypal = async(req, res) => {

    const id = req.params.id;
    const uid = req.uid;

    try {

        const subcriptionPaypal = await Subcriptionpaypal.findById(id);
        if (!subcriptionPaypal) {
            return res.status(500).json({
                ok: false,
                msg: 'subcriptionPaypal no encontrado por el id'
            });
        }

        const cambiosSubcriptionPaypal = {
            ...req.body,
            usuario: uid
        }

        const subcriptionPaypalActualizado = await Subcriptionpaypal.findByIdAndUpdate(id, cambiosSubcriptionPaypal, { new: true });

        res.json({
            ok: true,
            subcriptionPaypalActualizado
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

    Subcriptionpaypal.findByIdAndUpdate({ _id: id }, { status: 'Desactivado' }, (err, subcriptionPaypal_data) => {
        if (err) {
            res.status(500).send({ message: err });
        } else {
            if (subcriptionPaypal_data) {
                res.status(200).send({ subcriptionPaypal: subcriptionPaypal_data });
            } else {
                res.status(403).send({ message: 'No se actualizó el subcriptionPaypal, vuelva a intentar nuevamente.' });
            }
        }
    })
}

function activar(req, res) {
    var id = req.params['id'];
    // console.log(id);
    Subcriptionpaypal.findByIdAndUpdate({ _id: id }, { status: 'Activo' }, (err, subcriptionPaypal_data) => {
        if (err) {
            res.status(500).send({ message: err });
        } else {
            if (subcriptionPaypal_data) {
                res.status(200).send({ subcription: subcriptionPaypal_data });
            } else {
                res.status(403).send({ message: 'No se actualizó el paypalplan, vuelva a intentar nuevamente.' });
            }
        }
    })
}

function listar_newest(req, res) {
    Subcriptionpaypal.find({}).populate('usuario').sort({ createdAt: -1 }).limit(4).exec((err, data) => {
        if (data) {
            res.status(200).send({ subcriptions: data });
        }
    });
}




const listarPorUsuario = (req, res) => {
    var id = req.params['id'];
    Subcriptionpaypal.find({ usuario: id }, (err, subcription_data) => {
        if (!err) {
            if (subcription_data) {
                res.status(200).send({ subcription: subcription_data });
            } else {
                res.status(500).send({ error: err });
            }
        } else {
            res.status(500).send({ error: err });
        }
    }).populate('usuario');
}

module.exports = {
    getSubcriptionPlanPaypals,
    getSubcriptionPlanPaypal,
    crearSubcriptionPlanPaypal,
    actualizarSubcriptionPlanPaypal,
    desactivar,
    activar,
    listar_newest,
    listarPorUsuario


};