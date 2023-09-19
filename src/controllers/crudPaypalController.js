const { response } = require('express');
const Paypalplans = require('../models/paypalPlan');


const getPlanPaypals = async(req, res) => {

    const paypalplans = await Paypalplans.find();

    res.json({
        ok: true,
        paypalplans
    });
};

const getPlanPaypal = async(req, res) => {

    const id = req.params.id;

    Paypalplans.findById(id)
        .exec((err, paypalplan) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar paypalplan',
                    errors: err
                });
            }
            if (!paypalplan) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El paypalplan con el id ' + id + 'no existe',
                    errors: { message: 'No existe un paypalplan con ese ID' }
                });

            }
            res.status(200).json({
                ok: true,
                paypalplan: paypalplan
            });
        });

};

const crearPlanPaypal = async(req, res) => {

    const uid = req.uid;
    const paypalplan = new Paypalplans({
        usuario: uid,
        ...req.body
    });

    try {

        const paypalplanDB = await paypalplan.save();

        res.json({
            ok: true,
            paypalplan: paypalplanDB
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el admin'
        });
    }


};

const actualizarPlanPaypal = async(req, res) => {

    const id = req.params.id;
    const uid = req.uid;

    try {

        const paypalplan = await Paypalplans.findById(id);
        if (!paypalplan) {
            return res.status(500).json({
                ok: false,
                msg: 'paypalplan no encontrado por el id'
            });
        }

        const cambiosPaypalplan = {
            ...req.body,
            usuario: uid
        }

        const paypalplanActualizado = await Paypalplans.findByIdAndUpdate(id, cambiosPaypalplan, { new: true });

        res.json({
            ok: true,
            paypalplanActualizado
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

    Paypalplans.findByIdAndUpdate({ _id: id }, { status: 'Desactivado' }, (err, paypalplan_data) => {
        if (err) {
            res.status(500).send({ message: err });
        } else {
            if (paypalplan_data) {
                res.status(200).send({ paypalplan: paypalplan_data });
            } else {
                res.status(403).send({ message: 'No se actualizó el paypalplan, vuelva a intentar nuevamente.' });
            }
        }
    })
}

function activar(req, res) {
    var id = req.params['id'];
    // console.log(id);
    Paypalplans.findByIdAndUpdate({ _id: id }, { status: 'Activo' }, (err, paypalplan_data) => {
        if (err) {
            res.status(500).send({ message: err });
        } else {
            if (paypalplan_data) {
                res.status(200).send({ subcription: paypalplan_data });
            } else {
                res.status(403).send({ message: 'No se actualizó el paypalplan, vuelva a intentar nuevamente.' });
            }
        }
    })
}




module.exports = {
    getPlanPaypals,
    getPlanPaypal,
    crearPlanPaypal,
    actualizarPlanPaypal,
    desactivar,
    activar,


};