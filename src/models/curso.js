'use strict'
const { Schema, model } = require('mongoose');

var cursoSchema = Schema({
    name: { type: String, required: true, unique: true },
    price: { type: Number, required: true },
    description: { type: String, required: false },
    adicional: { type: String, required: true },
    tiempo: { type: String, required: true },
    youtubeUrl: { type: String, required: false },
    image: { type: String, required: false },
    status: { type: String, required: false, default: 'Desactivado' },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' },
    categoria: { type: Schema.Types.ObjectId, ref: 'Categoria' },
    pago: { type: Schema.Types.ObjectId, ref: 'Pago' },
    video: { type: Schema.Types.ObjectId, ref: 'Video' },
    createdAt: { type: Date, default: Date.now, required: true },
    updatedAt: { type: Date, default: Date.now, required: true }
}, { collection: 'cursos' });

module.exports = model('Curso', cursoSchema);