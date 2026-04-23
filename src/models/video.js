'use strict'
const { Schema, model } = require('mongoose');

var videoSchema = Schema({
    name: { type: String, required: true, unique: true },
    tipo: { type: String, required: true },
    youtubeUrl: { type: String, required: false },
    fileVideo: { type: String, required: false },
    vimeoUrl: { type: String, required: false },
    status: { type: String, required: false, default: 'Desactivado' },
    curso: { type: Schema.Types.ObjectId, ref: 'Curso' },
    createdAt: { type: Date, default: Date.now, required: true },
    updatedAt: { type: Date, default: Date.now, required: true }
}, { collection: 'videos' });

module.exports = model('Video', videoSchema);