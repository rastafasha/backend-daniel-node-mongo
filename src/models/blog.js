'use strict'
const { Schema, model } = require('mongoose');

var BlogSchema = Schema({

    name: { type: String, required: true },
    img: { type: String, required: false },
    description: { type: String, required: false },
    adicional: { type: String, required: true },
    price: { type: Number, required: true },
    slug: { type: String, required: true },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' },
    categoria: { type: Schema.Types.ObjectId, ref: 'Categoria' },
    pago: { type: Schema.Types.ObjectId, ref: 'Pago' },
    binancepay: { type: Schema.Types.ObjectId, ref: 'Binancepay' },
    ventas: { type: Number },
    status: { type: String, required: false, default: 'Desactivado' },
    isFeatured: { type: Boolean, required: true },
    createdAt: { type: Date, default: Date.now, required: true },
    updatedAt: { type: Date, default: Date.now, required: true }
}, { collection: 'blogs' });



module.exports = model('Blog', BlogSchema);