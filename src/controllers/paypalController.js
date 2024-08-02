const request = require('request');


const CLIENT = 'AQhKPBY5mgg0JustLJCcf6ncmd9RghCiNhXT_b6rNUakyQtnEn8MzCn_dkHAyt5n7_P0Omo5M05to5j0';
const SECRET = 'EFFuT6X5iP76O94nCeLrILzQCtCpqDc1EbBUMDKlj34B_55Pk_f4reWcvmFArH4oQklbeHZdsunITll0';
const PAYPAL_API = 'https://api-m.sandbox.paypal.com';

const auth = { user: CLIENT, pass: SECRET };

// primero
//para crear el plan primero hay que generar el producto, 
//el cual da como resultado :data : {id: PROD-4A346540KG295494N}


const createProduct = async(req, res) => {
    const product = { name, description, type, category, image_url } = req.body;
    
    // const product = {
    //     name: 'Subscripcion Daniel project Agosto3',
    //     description: "Subscripcion a un canal de Youtube se cobra mensualmente",
    //     type: 'SERVICE',
    //     category: 'SOFTWARE',
    //     image_url: 'https://avatars.githubusercontent.com/u/15802366?s=460&u=ac6cc646599f2ed6c4699a74b15192a29177f85a&v=4'
    // };

    //https://developer.paypal.com/docs/api/catalog-products/v1/#products_create
    request.post(`${PAYPAL_API}/v1/catalogs/products`, {
        auth,
        body: product,
        json: true
    }, (err, response) => {
        res.json({ productPaypal: response.body })
        // console.log(res);
    })



}

// segundo

// este incluirlo en el request como product_id
// resultado id: P-69F139449T308873YMSOX7LY

const createPlan = (req, res) => {
    const { body } = req
    //product_id

    const plan = {
        name: body.name,
        product_id: body.product_id,
        status: body.status,
        billing_cycles: [{
            frequency: {
                interval_unit: body.interval_unit,
                interval_count: 1
            },
            tenure_type: "REGULAR",
            sequence: 1,
            total_cycles: body.total_cycles,
            pricing_scheme: {
                fixed_price: {
                    value: body.fixed_price, //"3", // PRECIO MENSUAL QUE COBRAS 3.30USD
                    currency_code: "USD"
                }
            }
        }],
        payment_preferences: {
            auto_bill_outstanding: true,
            setup_fee: {
                value: body.setup_fee,
                currency_code: "USD"
            },
            setup_fee_failure_action: "CONTINUE",
            payment_failure_threshold: 3
        },
        taxes: {
            percentage: body.percentage,  //"10", // 10USD + 10% = 11 USD
            inclusive: false
        }
    }

    request.post(`${PAYPAL_API}/v1/billing/plans`, {
        auth,
        body: plan,
        json: true
    }, (err, response) => {
        res.json({ planPaypal: response.body })
    })
}
// hay que pasar el plan_id P-69F139449T308873YMSOX7LY para generar la subcripcion

const generateSubscription = (req, res) => {
    const { body } = req

    const subscription = {
        plan_id: body.plan_id, //P-69178834AV994513TMR67XZA
        start_time: body.start_time,
        quantity: 1,
        subscriber: {
            name: {
                given_name: body.name,
                surname: body.surname
            },
            email_address: body.email_address,
        },
        return_url: 'http://localhost/gracias',
        cancel_url: 'http://localhost/fallo'

    }
    request.post(`${PAYPAL_API}/v1/billing/subscriptions`, {
        auth,
        body: subscription,
        json: true
    }, (err, response) => {
        res.json({ generateSubcription: response.body })
    })
}

// opcionales


const createPayment = (req, res) => {

    const { body } = req

    const pago = {
        intent: 'CAPTURE',
        purchase_units: [{
            amount: {
                currency_code: 'USD',
                value: body.value
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
        body:pago,
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
    // const token = req.query.token;
    // console.log(`${PAYPAL_API}/v2/checkout/orders/${token}/capture`);
    const { body } = req;
    request.get(`${PAYPAL_API}/v1/billing/plans`, {
        auth,
        body: body,
        json: true
    },
     (err, response) => {
        res.json({ planPaypals: response.body });
    });
};

const getPlanbyId = (req, res) => {
    const { body } = req;
    const id = req.params.id;
    request.get(`${PAYPAL_API}/v1/billing/plans/${id}`, {
        auth,
        body: {},
        json: true
    }, (err, response) => {
        res.json({ planPaypal: response.body });
    });
};

const updatePlan = (req, res) => {
    const { body } = req;
    const id = req.params.id;
    request.patch(`${PAYPAL_API}/v1/billing/plans/${id}`, {
        auth,
        body: {},
        json: true
    }, (err, response) => {
        res.json({ planPaypal: response.body });
    });
};

const planpage = (req, res) => {
    const { body } = req;
    paginaPost = 0;
    const paginaPost = req.params.id;
    request.get(`${PAYPAL_API}/v1/billing/plans?page_size=10&page=${paginaPost}`, {
        auth,
        body: {},
        json: true
    }, (err, response) => {
        res.json({ planPaypal: response.body });
    });
};


const planpage2 = (req, res) => {
    const { body } = req;
    request.get(`${PAYPAL_API}/v1/billing/plans?page_size=10&page=2`, {
        auth,
        body: {},
        json: true
    }, (err, response) => {
        res.json({ planPaypal: response.body });
    });
};



const activatePlan = (req, res) => {
    const id = req.params.id;
    request.post(`${PAYPAL_API}/v1/billing/plans/${id}/activate`, {
        auth,
        body: {},
        json: true
    }, (err, response) => {
        res.json({ planPaypal: response.body });
    });
};

const desactivatePlan = (req, res) => {
    const id = req.params.id;
    request.post(`${PAYPAL_API}/v1/billing/plans/${id}/deactivate`, {
        auth,
        body: {},
        json: true
    }, (err, response) => {
        res.json({ planPaypal: response.body });
    });
};

//products

const getProducts = (req, res) => {
    const { body } = req;
    request.get(`${PAYPAL_API}/v1/catalogs/products`, {
        auth,
        body: {},
        json: true
    },
     (err, response) => {
        res.json({ productPaypals: response.body });
    });
};

const getProductsbyId = (req, res) => {
    const { body } = req;
    const id = req.params.id;
    request.get(`${PAYPAL_API}/v1/catalogs/products/${id}`, {
        auth,
        body: {},
        json: true
    }, (err, response) => {
        res.json({ productPaypal: response.body });
    });
};
const updatePproduct = (req, res) => {
    const { body } = req;
    const id = req.params.id;
    request.patch(`${PAYPAL_API}/v1/catalogs/products/${id}`, {
        auth,
        body: {},
        json: true
    }, (err, response) => {
        res.json({ productPaypal: response.body });
    });
};



const page2 = (req, res) => {
    const { body } = req;
    request.get(`${PAYPAL_API}/v1/catalogs/products?page_size=10&page=2`, {
        auth,
        body: {},
        json: true
    }, (err, response) => {
        res.json({ productPaypal: response.body });
    });
};

const page4 = (req, res) => {
    const { body } = req;
    request.get(`${PAYPAL_API}/v1/catalogs/products?page_size=10&page=4`, {
        auth,
        body: {},
        json: true
    }, (err, response) => {
        res.json({ productPaypal: response.body });
    });
};
const page3 = (req, res) => {
    const { body } = req;
    request.get(`${PAYPAL_API}/v1/catalogs/products?page_size=10&page=3`, {
        auth,
        body: {},
        json: true
    }, (err, response) => {
        res.json({ productPaypal: response.body });
    });
};

//subcriptions
const getSubcriptions = (req, res) => {
    // const token = req.query.token;
    // console.log(`${PAYPAL_API}/v2/checkout/orders/${token}/capture`);
    const { body } = req;
    request.get(`${PAYPAL_API}/v1/billing/subscriptions`, {
        auth,
        body: body,
        json: true
    },
     (err, response) => {
        res.json({ data: response.body });
    });
};

const getSubcriptionbyId = (req, res) => {
    const { body } = req;
    const id = req.params.id;
    request.get(`${PAYPAL_API}/v1/billing/subscriptions/${id}`, {
        auth,
        body: {},
        json: true
    }, (err, response) => {
        res.json({ subcription: response.body });
    });
};



module.exports = {
    createPayment,
    executePayment,
    createProduct,
    createPlan,
    generateSubscription,
    getPlans,
    getPlanbyId,
    getProducts,
    getProductsbyId,
    updatePproduct,
    updatePlan,
    activatePlan,
    desactivatePlan,
    planpage,
    planpage2,
    page2,
    page3,
    page4,
    getSubcriptions,
    getSubcriptionbyId
};