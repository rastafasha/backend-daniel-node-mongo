const { response } = require('express');
const Binancepay = require('../models/binancepay');


const getBinancepays = async(req, res) => {

    const binancepays = await Binancepay.find({})
    .populate('usuario')
    .populate('pago')
    .populate('blog');

    res.json({
        ok: true,
        binancepays
    });
};

const getBinancepay = async(req, res) => {

    const id = req.params.id;
    const uid = req.uid;

    Binancepay.findById(id, {})
    .populate('usuario')
    .populate('pago')
    .populate('blog')
        .exec((err, binancepay) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar binancepay',
                    errors: err
                });
            }
            if (!binancepay) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El Binancepay con el id ' + id + 'no existe',
                    errors: { message: 'No existe un Binancepay con ese ID' }
                });

            }
            res.status(200).json({
                ok: true,
                binancepay: binancepay
            });
        });

};

const crearBinancepay = async(req, res) => {

    const uid = req.uid;
    const binancepay = new Binancepay({
        usuario: uid,
        ...req.body
    });

    try {

        const binancepayDB = await binancepay.save();

        res.json({
            ok: true,
            blobinancepayg: binancepayDB
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el admin'
        });
    }


};

const actualizarBinancepay = async(req, res) => {

    const id = req.params.id;
    const uid = req.uid;

    try {

        const binancepay = await Binancepay.findById(id);
        if (!binancepay) {
            return res.status(500).json({
                ok: false,
                msg: 'binancepay no encontrado por el id'
            });
        }

        const cambiosBinancepay = {
            ...req.body,
            usuario: uid
        }

        const binancepayActualizado = await Binancepay.findByIdAndUpdate(id, cambiosBinancepay, { new: true });

        res.json({
            ok: true,
            binancepayActualizado
        });

    } catch (error) {

        res.status(500).json({
            ok: false,
            msg: 'Error hable con el admin'
        });
    }


};

const borrarBinancepay = async(req, res) => {

    const id = req.params.id;

    try {

        const binancepay = await Binancepay.findById(id);
        if (!binancepay) {
            return res.status(500).json({
                ok: false,
                msg: 'binancepay no encontrado por el id'
            });
        }

        await Binancepay.findByIdAndDelete(id);

        res.json({
            ok: true,
            msg: 'binancepay eliminado'
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

    Binancepay.findByIdAndUpdate({ _id: id }, { status: 'Desactivado' }, (err, binancepay_data) => {
        if (err) {
            res.status(500).send({ message: err });
        } else {
            if (binancepay_data) {
                res.status(200).send({ binancepay: binancepay_data });
            } else {
                res.status(403).send({ message: 'No se actualizó el binancepay, vuelva a intentar nuevamente.' });
            }
        }
    })
}

function activar(req, res) {
    var id = req.params['id'];
    // console.log(id);
    Binancepay.findByIdAndUpdate({ _id: id }, { status: 'Activo' }, (err, binancepay_data) => {
        if (err) {
            res.status(500).send({ message: err });
        } else {
            if (binancepay_data) {
                res.status(200).send({ binancepay: binancepay_data });
            } else {
                res.status(403).send({ message: 'No se actualizó el binancepay, vuelva a intentar nuevamente.' });
            }
        }
    })
}

const destacado = async(req, res, next) => {

    try {
        const binancepays = await Binancepay.find({
            where: {
                isFeatured: true
            }
        })

        res.json({
            success: true,
            data: {
                binancepays: binancepays
            }
        })

    } catch (error) {
        return next(error);
    }
};

function listar_newest(req, res) {
    Binancepay.find().sort({ createdAt: -1 }).limit(4).exec((err, data) => {
        if (data) {
            res.status(200).send({ binancepays: data });
        }
    });
}



module.exports = {
    getBinancepays,
    getBinancepay,
    crearBinancepay,
    actualizarBinancepay,
    borrarBinancepay,
    desactivar,
    activar,
    destacado,
    listar_newest,


};