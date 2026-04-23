'use strict'
var mongoose = require('mongoose');
const { Schema, model } = require('mongoose');

const favoritoSchema = Schema({
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' },
    blog: { type: Schema.Types.ObjectId, ref: 'Blog' },
    curso: { type: Schema.Types.ObjectId, ref: 'Curso' },
    createdAt: { type: Date, default: Date.now, required: true },
    updatedAt: { type: Date, default: Date.now, required: true }
}, { collection: 'favoritos' });


module.exports = mongoose.model('Favorito', favoritoSchema);