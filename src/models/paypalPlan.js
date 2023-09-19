'use strict'
const { Schema, model } = require('mongoose');

var PaypalplanSchema = Schema({

    product_id: { type: String, required: true },
    name: { type: String, required: false },
    description: { type: String, required: false },
    total_cycles: { type: Number, required: false },
    fixed_price: { type: Number, required: false },
    setup_fee: { type: Number, required: false },
    percentage: { type: Number, required: false },
    billing_cycles: { type: Number, required: false },
    frequency: { type: String, required: false },
}, { collection: 'Paypalplans' });



module.exports = model('Paypalplan', PaypalplanSchema);