const { response } = require('express');
const Plan = require('../models/plan');
const fs = require('fs');


const getPlans = async(req, res) => {

    const plans = await Plan.find()
        .populate('usuario')
        .populate('pago')

    res.json({
        ok: true,
        plans
    });
};

const getPlan = async(req, res) => {

    const id = req.params.id;
    const uid = req.uid;

    Plan.findById(id)
        .populate('usuario')
        .populate('pago')
        .exec((err, plan) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar Plan',
                    errors: err
                });
            }
            if (!plan) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El Plan con el id ' + id + 'no existe',
                    errors: { message: 'No existe un Plan con ese ID' }
                });

            }
            res.status(200).json({
                ok: true,
                plan: plan
            });
        });

};

const crearPlan = async(req, res) => {

    const uid = req.uid;
    const plan = new Plan({
        usuario: uid,
        ...req.body
    });

    try {

        const planDB = await plan.save();

        res.json({
            ok: true,
            plan: planDB
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el admin',
        });
    }


};

const actualizarPlan = async(req, res) => {

    const id = req.params.id;
    const uid = req.uid;

    try {

        const plan = await Plan.findById(id);
        if (!plan) {
            return res.status(500).json({
                ok: false,
                msg: 'plan no encontrado por el id'
            });
        }

        const cambiosPlan = {
            ...req.body,
            usuario: uid
        }

        const planActualizado = await Plan.findByIdAndUpdate(id, cambiosPlan, { new: true });

        res.json({
            ok: true,
            planActualizado
        });

    } catch (error) {

        res.status(500).json({
            ok: false,
            msg: 'Error hable con el admin'
        });
    }


};

const borrarPlan = async(req, res) => {

    const id = req.params.id;

    try {

        const plan = await Plan.findById(id);
        if (!plan) {
            return res.status(500).json({
                ok: false,
                msg: 'plan no encontrado por el id'
            });
        }

        await Plan.findByIdAndDelete(id);

        res.json({
            ok: true,
            msg: 'plan eliminado'
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

    Plan.findByIdAndUpdate({ _id: id }, { status: 'Desactivado' }, (err, plan_data) => {
        if (err) {
            res.status(500).send({ message: err });
        } else {
            if (plan_data) {
                res.status(200).send({ plan: plan_data });
            } else {
                res.status(403).send({ message: 'No se actualizó el plan, vuelva a intentar nuevamente.' });
            }
        }
    })
}

function activar(req, res) {
    var id = req.params['id'];
    // console.log(id);
    Plan.findByIdAndUpdate({ _id: id }, { status: 'Activo' }, (err, plan_data) => {
        if (err) {
            res.status(500).send({ message: err });
        } else {
            if (plan_data) {
                res.status(200).send({ plan: plan_data });
            } else {
                res.status(403).send({ message: 'No se actualizó el plan, vuelva a intentar nuevamente.' });
            }
        }
    })
}






module.exports = {
    getPlans,
    crearPlan,
    getPlan,
    actualizarPlan,
    borrarPlan,
    desactivar,
    activar


};