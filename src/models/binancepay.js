'use strict'
var mongoose = require('mongoose');
const { Schema, model } = require('mongoose');

const BinancepaySchema = Schema({
    img: { type: String, require: false },
    monto: { type: String, require: false },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' },
    pago: { type: Schema.Types.ObjectId, ref: 'Pago' },
    blog: { type: Schema.Types.ObjectId, ref: 'Blog' },
    status: { type: String, required: false, default: 'Desactivado' },
}, { collection: 'binancepays' });



module.exports = mongoose.model('Binancepay', BinancepaySchema);