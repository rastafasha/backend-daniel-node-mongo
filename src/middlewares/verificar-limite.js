const Profile = require('../models/profile'); // Asegúrate de que la ruta al modelo sea correcta

const verificarLimiteArticulos = async (req, res, next) => {
    try {
        // Usamos req.uid porque es lo que viene de tu validarJWT
        const perfil = await Profile.findOne({ usuario: req.uid }); 

        if (!perfil) return res.status(404).json({ msg: 'Perfil no encontrado' });

        // 1. Si es premium, no contamos
        if (perfil.plan === 'premium') return next();

        // 2. Reinicio mensual
        const ahora = new Date();
        if (!perfil.fechaReinicio || ahora > perfil.fechaReinicio) {
            perfil.articulosVistos = 0;
            let proximoMes = new Date();
            perfil.fechaReinicio = new Date(proximoMes.setMonth(proximoMes.getMonth() + 1));
        }

        // 3. Verificación de límite
        if (perfil.articulosVistos < 3) {
            perfil.articulosVistos += 1;
            await perfil.save();
            return next();
        } else {
            // Enviamos un 403 (Prohibido) para que el frontend sepa que debe mostrar el plan de pago
            return res.status(403).json({ 
                ok: false, 
                msg: 'Límite mensual alcanzado' 
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Error en el servidor al verificar límite' });
    }
};


module.exports = { 
    verificarLimiteArticulos
 };
