'use strict'
const { Schema, model } = require('mongoose');

var PlanSchema = Schema({
    name: { type: String, required: true, unique: true },
    price: { type: Number, required: true },
    description: { type: String, required: false },
    adicional: { type: String, required: true },
    color: { type: String, required: true },
    tiempo: { type: String, required: true },
    status: { type: String, required: false, default: 'Desactivado' },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' },
    pago: { type: Schema.Types.ObjectId, ref: 'Pago' },
    createdAt: { type: Date, default: Date.now, required: true },
    updatedAt: { type: Date, default: Date.now, required: true }
}, { collection: 'plans' });

module.exports = model('Plan', PlanSchema);