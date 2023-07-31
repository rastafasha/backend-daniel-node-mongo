const { response } = require('express');
const Pago = require('../models/pago');


const CLIENT = 'AQhKPBY5mgg0JustLJCcf6ncmd9RghCiNhXT_b6rNUakyQtnEn8MzCn_dkHAyt5n7_P0Omo5M05to5j0';
const SECRET = 'EFFuT6X5iP76O94nCeLrILzQCtCpqDc1EbBUMDKlj34B_55Pk_f4reWcvmFArH4oQklbeHZdsunITll0';
const PAYPAL_API = 'https://api-m.sandbox.paypal.com';

const auth = { user: CLIENT, pass: SECRET };

// primero
//para crear el plan primero hay que generar el producto, el cual da como resultado :data : {id: PROD-4A346540KG295494N}

const createProduct = (req, res) => {
    const product = {
        // name: 'Subcripcion Daniel Project',
        // description: "Subscripcion a proyecto de daniel se cobra mensualmente",
        // type: 'SERVICE',
        // category: 'SOFTWARE',
        // image_url: 'https://avatars.githubusercontent.com/u/15802366?s=460&u=ac6cc646599f2ed6c4699a74b15192a29177f85a&v=4'

        name: req.body.name,
        description: req.body.description,
        type: req.body.type,
        category: req.body.category,
        image_url: req.body.image_url
    };
    //se crea el producto en paypal
    //https://developer.paypal.com/docs/api/catalog-products/v1/#products_create
    request.post(`${PAYPAL_API}/v1/catalogs/products`, {
        auth,
        body: product,
        json: true
    }, (err, response) => {
        res.json({ data: response.body }) //resultado :data : {id: PROD-4A346540KG295494N}
    });

}

// segundo

// este incluirlo en el request como product_id
// resultado id: P-69F139449T308873YMSOX7LY

const createPlan = (req, res) => {
    const { body } = req
    //product_id

    const plan = {
        // name: 'PLAN mensual',
        name: req.body.name,
        product_id: body.product_id,
        status: "ACTIVE",
        billing_cycles: [{
            frequency: {
                interval_unit: "MONTH",
                interval_count: 1
            },
            tenure_type: "REGULAR",
            sequence: 1,
            total_cycles: 12,
            pricing_scheme: {
                fixed_price: {
                    value: "3", // PRECIO MENSUAL QUE COBRAS 3.30USD
                    currency_code: "USD"
                }
            }
        }],
        payment_preferences: {
            auto_bill_outstanding: true,
            setup_fee: {
                value: "10",
                currency_code: "USD"
            },
            setup_fee_failure_action: "CONTINUE",
            payment_failure_threshold: 3
        },
        taxes: {
            percentage: "10", // 10USD + 10% = 11 USD
            inclusive: false
        }
    }

    request.post(`${PAYPAL_API}/v1/billing/plans`, {
        auth,
        body: plan,
        json: true
    }, (err, response) => {
        res.json({ data: response.body })
    })
}

// hay que pasar el plan_id P-69F139449T308873YMSOX7LY para generar la subcripcion

const generateSubscription = (req, res) => {
    const { body } = req

    const subscription = {
        plan_id: body.plan_id, //P-69F139449T308873YMSOX7LY
        start_time: "2023-11-01T00:00:00Z",
        quantity: 1,
        subscriber: {
            name: {
                given_name: "John",
                surname: "Doe"
            },
            email_address: "customer@example.com",
        },
        return_url: 'http://localhost/gracias',
        cancel_url: 'http://localhost/fallo'

    }
    request.post(`${PAYPAL_API}/v1/billing/subscriptions`, {
        auth,
        body: subscription,
        json: true
    }, (err, response) => {
        res.json({ data: response.body })
    })
}

// opcionales
const createPayment = (req, res) => {
    const body = {
        intent: 'CAPTURE',
        purchase_units: [{
            amount: {
                currency_code: 'USD',
                value: '150'
            }
        }],
        application_context: {
            brand_name: 'tu-empresa.com',
            landing_page: 'NO_PREFERENCE', //default, para mas informacion https://developer.paypal.com/doc/api
            user_action: 'PAY_NOW', //accion para que en paypal muestre el monto del pago
            return_url: 'http://localhost:3000/execute-payment', //url despues de realizar el pago
            cancel_url: 'http://localhost:3000/cancel-payment', //url despues de ralizar el pago

        }
    };
    request.post(`${PAYPAL_API}/v2/checkout/orders`, {
        auth,
        body,
        json: true
    }, (err, response) => {
        res.json({ data: response.body });
    });
};
//captura el dinero
const executePayment = (req, res) => {
    const token = req.query.token;
    // console.log(`${PAYPAL_API}/v2/checkout/orders/${token}/capture`);

    request.post(`${PAYPAL_API}/v2/checkout/orders/${token}/capture`, {
        auth,
        body: {},
        json: true
    }, (err, response) => {
        res.json({ data: response.body });
    });
};


const getPlans = (req, res) => {
    const token = req.query.token;
    // console.log(`${PAYPAL_API}/v2/checkout/orders/${token}/capture`);

    request.post(`${PAYPAL_API}/v2/checkout/orders/${token}/capture`, {
        auth,
        body: {},
        json: true
    }, (err, response) => {
        res.json({ data: response.body });
    });
};
module.exports = {
    createPayment,
    executePayment,
    createProduct,
    createPlan,
    generateSubscription,
};