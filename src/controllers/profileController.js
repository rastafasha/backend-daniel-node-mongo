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
            .populate('subcription') // Trae los documentos del modelo SubcriptionPaypal
            .populate({ 
                path: 'favoritos', 
                populate: { path: 'blog', model: 'Blog' } 
            })
            .populate('pagos')
            .populate('blog');

        if (!profile_data) {
            return res.status(404).send({ message: 'No se encontró el perfil' });
        }

        // 1. Ordenar suscripciones: La más nueva arriba (basado en createdAt)
        if (profile_data.subcription && profile_data.subcription.length > 0) {
            profile_data.subcription.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }

        // 2. Verificar estado Premium (buscamos si alguna en el historial está ACTIVE)
        const esPremium = (profile_data.plan !== 'free') || 
                   profile_data.subcription?.some(sub => sub.status === 'ACTIVE');

        res.status(200).send({ 
            profile: profile_data, 
            esPremium: esPremium, 
            quedanGratis: Math.max(0, 3 - (profile_data.articulosVistos || 0)) 
        });

    } catch (err) {
        console.error("Error en listarProfilePorUsuario:", err);
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


const sincronizarSuscripcionExistente = async (req, res) => {
    try {
        const { idPerfil } = req.params; // El ID del documento Profile

        // 1. Buscamos el perfil que ya tiene el ID de ayer
        const profile = await Profile.findById(idPerfil);

        

        if (!profile || !profile.paypalSubscriptionId) {
            return res.status(404).send({ message: 'Perfil no encontrado o no tiene ID de PayPal' });
        }

        // 2. Creamos el documento en la colección 'subcriptions'
        // Usamos los datos que ya tenemos y completamos con datos de prueba/ayer
        const nuevaSub = await Subcriptionpaypal.create({
            email: profile.emailPaypal || 'correo@ejemplo.com',
            monto: 0, // Ajusta el monto si lo conoces
            orderID: profile.paypalSubscriptionId, // El I-ASP5X...
            payerID: 'SINCRONIZADO_MANUAL',
            plan_id: 'P-8CJ06585H1246910MMSOZQNA', // Tu ID de plan mensual
            status: 'ACTIVE',
            usuario: profile.usuario,
            create_time: new Date()
        });

        // 3. Empujamos el ID de la nueva suscripción al array del perfil
        profile.subcription.push(nuevaSub._id);
        profile.plan = 'mensual'; // Aseguramos que el plan no sea 'free'
        await profile.save();

        res.status(200).send({ message: 'Sincronización exitosa', subId: nuevaSub._id });

    } catch (err) {
        res.status(500).send({ error: err.message });
    }
};

const fixSuscripcionAyer = async () => {
    const idPerfil = "69eaab0919ab9e7948b4bcbf"; // Sacado de tu imagen (Id. personalizada)
    const subIdPaypal = "I-ASP5X4YGDWJ1";      // Sacado de tu imagen (Id. de suscripción)

    const nuevaSub = await Subcriptionpaypal.create({
        email: "sb-oxcit51039797@personal.example.com", // El que sale en tu imagen
        monto: 0, // O el monto del plan
        orderID: subIdPaypal,
        payerID: "FIX_MANUAL",
        plan_id: "P-8CJ06585H1246910MMSOZQNA", // Tu ID de plan mensual
        status: 'ACTIVE',
        usuario: idPerfil,
        create_time: new Date()
    });

    // Lo metemos al array del perfil para que el .populate() lo encuentre
    await Profile.findByIdAndUpdate(idPerfil, {
        paypalSubscriptionId: subIdPaypal,
        plan: 'mensual',
        $push: { subcription: nuevaSub._id } 
    });

    console.log("¡Usuario sincronizado y ahora es Premium!");
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
    sincronizarSuscripcionExistente,
    fixSuscripcionAyer


};