const request = require('request');
const PaypalPlan = require('../models/paypalPlan');

const CLIENT = process.env.CLIENT;
const SECRET = process.env.SECRET;
const PAYPAL_API = process.env.PAYPAL_API;

const auth = { user: CLIENT, pass: SECRET };

// primero
//para crear el plan primero hay que generar el producto, 
//el cual da como resultado :data : {id: PROD-4A346540KG295494N}


const axios = require('axios'); // Recomendado sobre 'request' (que está deprecado)

const createProduct = async (req, res) => {
    try {
        // 1. Extraer datos del body correctamente
        const { name, description, type, category, image_url, home_url } = req.body;

        const productPayload = {
            name,
            description,
            type: type || 'SERVICE', // SERVICE o PHYSICAL
            category: category || 'SOFTWARE',
            image_url,
            home_url
        };

        // 2. Petición a PayPal usando Axios (más robusto)
        const response = await axios.post(
            `${PAYPAL_API}/v1/catalogs/products`,
            productPayload,
            {
                auth: {
                    username: CLIENT,
                    password: SECRET
                },
                headers: {
                    'Content-Type': 'application/json',
                    'PayPal-Request-Id': `product-${Date.now()}` // Evita duplicados por reintentos
                }
            }
        );

        // 3. Retornar solo lo necesario
        res.status(201).json({
            ok: true,
            productId: response.data.id,
            details: response.data
        });

    } catch (error) {
        console.error('Error PayPal Product:', error.response?.data || error.message);
        res.status(error.response?.status || 500).json({
            ok: false,
            message: 'Error al crear el producto en PayPal',
            error: error.response?.data
        });
    }
};


// segundo

// este incluirlo en el request como product_id
// resultado id: P-69F139449T308873YMSOX7LY

const createPlan = async (req, res) => {
    try {
        const { 
            name, 
            product_id, 
            interval_unit, 
            fixed_price, 
            setup_fee, 
            percentage, 
            total_cycles 
        } = req.body;

        const planPayload = {
            product_id: product_id,
            name: name,
            description: `Plan de suscripción: ${name}`,
            status: "ACTIVE", // Es mejor crearlos activos directamente
            billing_cycles: [{
                frequency: {
                    interval_unit: interval_unit, // MONTH, YEAR, WEEK
                    interval_count: 1
                },
                tenure_type: "REGULAR",
                sequence: 1,
                total_cycles: total_cycles || 0, // 0 significa infinito (hasta que se cancele)
                pricing_scheme: {
                    fixed_price: {
                        value: String(fixed_price), // "3.00"
                        currency_code: "USD"
                    }
                }
            }],
            payment_preferences: {
                auto_bill_outstanding: true,
                setup_fee: {
                    value: String(setup_fee || "0"),
                    currency_code: "USD"
                },
                setup_fee_failure_action: "CONTINUE",
                payment_failure_threshold: 3
            },
            taxes: {
                percentage: String(percentage || "0"),
                inclusive: false
            }
        };

        const response = await axios.post(
            `${PAYPAL_API}/v1/billing/plans`,
            planPayload,
            {
                auth,
                headers: { 'PayPal-Request-Id': `plan-${Date.now()}` }
            }
        );

        res.status(201).json({
            ok: true,
            planId: response.data.id, // Este es el P-XXXX que guardarás en tu DB
            details: response.data
        });

    } catch (error) {
        console.error('Error PayPal Plan:', error.response?.data || error.message);
        res.status(400).json({
            ok: false,
            error: error.response?.data
        });
    }
};

// hay que pasar el plan_id P-69F139449T308873YMSOX7LY para generar la subcripcion

const generateSubscription = async (req, res) => {
    try {
        const { plan_id, name, surname, email_address } = req.body;

        const subscriptionPayload = {
            plan_id: plan_id,
            // start_time debe ser en formato ISO (ej: 2026-05-04T12:00:00Z)
            // Si quieres que empiece YA, es mejor no enviarlo y PayPal usa el tiempo actual
            quantity: "1", 
            subscriber: {
                name: {
                    given_name: name,
                    surname: surname
                },
                email_address: email_address,
            },
            application_context: { // IMPORTANTE: PayPal usa esto para las URLs
                brand_name: process.env.BRAND_NAME,
                locale: "es-ES",
                shipping_preference: "NO_SHIPPING", // Ideal para servicios digitales
                user_action: "SUBSCRIBE_NOW",
                return_url: process.env.GRACIAS_URL,
                cancel_url: process.env.FALLO_URL
            }
        };

        const response = await axios.post(
            `${PAYPAL_API}/v1/billing/subscriptions`,
            subscriptionPayload,
            {
                auth,
                headers: { 'PayPal-Request-Id': `sub-${Date.now()}` }
            }
        );

        // El 'id' que devuelve aquí es el ID de la suscripción (I-XXXXX)
        // También devuelve una lista de 'links', el de 'approve' es el que el usuario debe visitar
        res.status(201).json({
            ok: true,
            subscriptionId: response.data.id,
            approvalUrl: response.data.links.find(link => link.rel === 'approve').href,
            details: response.data
        });

    } catch (error) {
        console.error('Error PayPal Subscription:', error.response?.data || error.message);
        res.status(400).json({ ok: false, error: error.response?.data });
    }
};


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
            brand_name: process.env.BRAND_NAME, //nombre de la empresa
            landing_page: 'NO_PREFERENCE', //default, para mas informacion https://developer.paypal.com/doc/api
            user_action: 'PAY_NOW', //accion para que en paypal muestre el monto del pago
            return_url: process.env.RETURN_URL, //url despues de realizar el pago
            cancel_url: process.env.CANCEL_URL, //url despues de ralizar el pago

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

const getPlanesPorPagina = (req, res) => {
    // Obtenemos la página de los parámetros de la URL (ej: /planes?page=2)
    // Si no envían página, por defecto será la 1
    const pagina = req.query.page || 1;
    const tamanoPagina = 20;

    request.get(`${PAYPAL_API}/v1/billing/plans?page_size=${tamanoPagina}&page=${pagina}`, {
        auth,
        json: true
    }, (err, response) => {
        if (err) {
            return res.status(500).json({ error: "Error al conectar con PayPal" });
        }
        res.json({ 
            planPaypal: response.body 
        });
    });
};


const activatePlan = (req, res) => {
    const id = req.params.id; // El ID del plan (P-XXXXX)

    request.post(`${PAYPAL_API}/v1/billing/plans/${id}/activate`, { 
        auth, 
        json: true 
    }, (err, response) => {
        
        // PayPal devuelve 204 si todo salió bien
        if (response.statusCode === 204) {
            return res.status(200).json({
                ok: true,
                msg: `Plan ${id} activado correctamente`
            });
        }

        // Si hay un error (ej: el plan ya está activo o no existe)
        res.status(response.statusCode).json({
            ok: false,
            msg: 'No se pudo activar el plan',
            error: response.body
        });
    });
};


const desactivatePlan = (req, res) => {
    const id = req.params.id; // Recibe el P-XXXXXXXX

    request.post(`${PAYPAL_API}/v1/billing/plans/${id}/deactivate`, { 
        auth, 
        json: true 
    }, (err, response) => {
        
        // Verificamos si hubo un error de red
        if (err) {
            return res.status(500).json({ ok: false, msg: 'Error de conexión con PayPal' });
        }

        // PayPal responde 204 No Content si se desactivó correctamente
        if (response.statusCode === 204) {
            return res.status(200).json({
                ok: true,
                msg: `El plan ${id} ha sido desactivado con éxito.`
            });
        }

        // Si el plan ya estaba desactivado o no existe, PayPal devuelve el error en el body
        res.status(response.statusCode).json({
            ok: false,
            msg: 'No se pudo desactivar el plan',
            details: response.body
        });
    });
};


//products

const getProducts = (req, res) => {
    // Definimos cuántos queremos ver y en qué página empezar
    const pageSize = 50; // Máximo permitido por página en esta API
    const page = 1;
    
    // Agregamos los parámetros a la URL
    const url = `${PAYPAL_API}/v1/catalogs/products?page_size=${pageSize}&page=${page}&total_required=true`;

    request.get(url, { 
        auth, 
        json: true 
    }, (err, response) => {
        if (err) {
            return res.status(500).json({ ok: false, error: err });
        }
        
        // Los productos suelen venir en response.body.products
        res.json({ 
            ok: true,
            productPaypals: response.body.products || [] 
        });
    });
};


const getProductsbyId = (req, res) => {
    const { id } = req.params; // Pasa PROD-84P82764JY185074Y
    request.get(`${PAYPAL_API}/v1/catalogs/products/${id}`, { 
        auth, 
        json: true 
    }, (err, response) => {
        res.json(response.body);
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


const getProductsByPage = (req, res) => {
    // Leemos la página desde la URL: /productos?page=2
    // Si no viene ninguna, usamos la 1 por defecto
    const page = req.query.page || 1;
    const pageSize = 10;

    request.get(`${PAYPAL_API}/v1/catalogs/products?page_size=${pageSize}&page=${page}&total_required=true`, {
        auth,
        json: true
    }, (err, response) => {
        if (err) {
            return res.status(500).json({ ok: false, error: err });
        }
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

const borrarProduct = async (req, res) => {

   const id = req.params.id;
    const data = [
        {
            op: "replace",
            path: "/name",
            value: "OBSOLETO - " + req.body.name // Le cambias el nombre para identificarlo
        }
    ];

    request.patch(`${PAYPAL_API}/v1/catalogs/products/${id}`, { 
        auth, 
        body: data, 
        json: true 
    }, (err, response) => {
        res.json({ ok: true, msg: "Producto marcado como obsoleto" });
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
    getPlanesPorPagina,
    getProductsByPage,
    getSubcriptions,
    getSubcriptionbyId,
    borrarProduct
};