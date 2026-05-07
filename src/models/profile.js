'use strict'
var mongoose = require('mongoose');
const { Schema, model } = require('mongoose');

const profileSchema = Schema({
    first_name: { type: String, require: true },
    last_name: { type: String, require: true },
    img: { type: String, require: false },
    estado: { type: String, require: false },
    ciudad: { type: String, require: false },
    telhome: { type: String, require: false },
    telmovil: { type: String, require: false },
    redssociales: { type: Array, required: false },
    linkedin: { type: String, require: false },
    shortdescription: { type: String, require: false },
    emailPaypal: { type: String, require: false },
    nombrePaypal: { type: String, require: false },
    direccion: { type: String, required: false },
    pais: { type: String, require: false, ref: 'Pais' },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' },
    blog: [{ type: Schema.Types.ObjectId, ref: 'Blog' }],
    favoritos: [{ type: Schema.Types.ObjectId, ref: 'Favorito' }],
    pagos: [{ type: Schema.Types.ObjectId, ref: 'Pago' }],
    subcription: [{ type: Schema.Types.ObjectId, ref: 'Subcriptionpaypal' }],
    articulosVistos: { type: Number, default: 0 },
    paypalSubscriptionId: { type: String, required: false }, // Para identificar el perfil en el webhook
    plan: { type: String, default: 'free' }, // 'free', 'mensual', 'trimestral', 'anual'
    fechaReinicio: { type: Date, default: Date.now }, // Para resetear los 3 artículos cada mes
}, { collection: 'profiles' });



module.exports = mongoose.model('Profile', profileSchema);