const { response } = require('express');
const Profile = require('../models/profile');
const Subcriptionpaypal = require('../models/subcriptionPaypal');

const crearProfile = async (req, res) => {
    const uid = req.uid;

    // Definimos los valores por defecto del Plan Gratuito
    const datosPlanGratuito = {
        plan: 'free',
        articulosVistos: 0,
        // Seteamos la fecha de reinicio para dentro de 30 días
        fechaReinicio: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    };

    const profile = new Profile({ 
        usuario: uid, 
        ...req.body,       // Datos que vienen del formulario (nombre, ciudad, etc)
        ...datosPlanGratuito // Forzamos que empiece como Free con sus límites
    });

    try {
        const profileDB = await profile.save();
        res.json({
            ok: true,
            profile: profileDB
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el admin'
        });
    }
};


const actualizarProfile = async (req, res) => {

    const id = req.params.id;
    const uid = req.uid;

    try {

        const profile = await Profile.findById(id);
        if (!profile) {
            return res.status(500).json({
                ok: false,
                msg: 'profile no encontrado por el id'
            });
        }

        const cambiosProfile = {
            ...req.body,
            usuario: uid
        }

        const profileActualizado = await Profile.findByIdAndUpdate(id, cambiosProfile, { new: true });

        res.json({
            ok: true,
            profileActualizado
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error hable con el admin'
        });
    }


};

const getProfiles = async (req, res) => {

    const profiles = await Profile.find()

    res.json({
        ok: true,
        profiles
    });
};



const getProfile = async (req, res) => {

    const id = req.params.id;
    Profile.findById(id)
        .populate('usuario')
        .exec((err, profile) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar profile',
                    errors: err
                });
            }
            if (!profile) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El profile con el id ' + id + 'no existe',
                    errors: { message: 'No existe un profile con ese ID' }
                });

            }
            res.status(200).json({
                ok: true,
                profile: profile
            });
        });

};



const borrarProfile = async (req, res) => {

    const id = req.params.id;

    try {

        const profile = await Profile.findById(id);
        if (!profile) {
            return res.status(500).json({
                ok: false,
                msg: 'profile no encontrado por el id'
            });
        }

        await Profile.findByIdAndDelete(id);

        res.json({
            ok: true,
            msg: 'profile eliminado'
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error hable con el admin'
        });
    }
};

const listarProfilePorUsuario = async (req, res) => {
    try {
        const profile_data = await Profile.findOne({ usuario: req.params.id })
            .populate('usuario')
            .populate('subcription')
            .populate({
                path: 'favoritos',
                populate: {
                    path: 'blog', // Esto trae los datos del blog dentro del favorito
                    model: 'Blog'
                }
            })
            .populate('pagos')
            .populate('blog');

        if (!profile_data) {
            return res.status(404).send({ message: 'No se encontró el perfil' });
        }
        const esPremium = profile_data.subcription?.some(sub => sub.status === 'ACTIVE') || false;
        res.status(200).send({
            profile: profile_data,
            esPremium: esPremium,
            quedanGratis: Math.max(0, 3 - profile_data.articulosVistos)
        });
    } catch (err) {
        console.error(err); // Útil para ti en la terminal
    res.status(500).send({ message: 'Error en el servidor', error: err.message });
    }
};
//plan gratuito paypal por defecto
const activarPlanGratuitoInterno = async (req, res) => {
    try {
        const uid = req.uid; // ID del usuario desde el validarJWT

        const perfil = await Profile.findOneAndUpdate(
            { usuario: uid },
            { 
                plan: 'free', 
                articulosVistos: 0,
                // Reiniciamos la fecha para que tenga 30 días desde hoy
                fechaReinicio: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) 
            },
            { new: true }
        );

        res.json({
            ok: true,
            msg: 'Plan Gratuito activado correctamente',
            perfil
        });
    } catch (error) {
        res.status(500).json({ ok: false, msg: 'Error al activar el plan' });
    }
};

const saveSubscriptionId = async (req, res) => {
    try {
        const { uid, subscriptionId } = req.body;
        
        const profile = await Profile.findOneAndUpdate(
            { user: uid }, // O el campo que uses para identificar al dueño del perfil
            { paypalSubscriptionId: subscriptionId },
            { new: true }
        );

        if (!profile) {
            return res.status(404).json({ ok: false, msg: 'Perfil no encontrado' });
        }

        res.json({ ok: true, profile });
    } catch (error) {
        console.log(error);
        res.status(500).json({ ok: false, msg: 'Error al guardar suscripción' });
    }
};






module.exports = {
    crearProfile,
    getProfiles,
    getProfile,
    actualizarProfile,
    borrarProfile,
    listarProfilePorUsuario,
    activarPlanGratuitoInterno,
    saveSubscriptionId,
    


};