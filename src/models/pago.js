'use strict'
const { Schema, model } = require('mongoose');

var PagoSchema = Schema({
    referencia: { type: String, required: true },
    monto: { type: Number, required: true },
    img: { type: String, required: false },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' },
    // plan: { type: Schema.Types.ObjectId, ref: 'Plan' },
    blog: { type: Array },
    subcriptionPaypal: { type: Schema.Types.ObjectId, ref: 'Subcriptionpaypal' },
    binancepay: { type: Schema.Types.ObjectId, ref: 'Binancepay' },
    status: { type: String, required: false, default: 'PENDING' },
    validacion: { type: String, required: false, default: 'PENDING' },
    createdAt: { type: Date, default: Date.now, required: true },
    updatedAt: { type: Date, default: Date.now, required: true }
}, { collection: 'pagos' });

module.exports = model('Pago', PagoSchema);