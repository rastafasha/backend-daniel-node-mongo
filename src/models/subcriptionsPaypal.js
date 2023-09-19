'use strict'
const { Schema, model } = require('mongoose');

var SubcriptionPaypalSchema = Schema({

    subscriptionID: { type: String, required: true },
    orderID: { type: String, required: true },
    payerID: { type: String, required: true },
    plan_id: { type: String, required: true },
    status: { type: String, required: false },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' },
    create_time: { type: Date, required: false },
}, { collection: 'Subcriptionpaypal' });



module.exports = model('Subcriptionpaypal', SubcriptionPaypalSchema);