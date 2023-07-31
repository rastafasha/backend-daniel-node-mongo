
/*
 Ruta: /api/pagos
 */

 const { Router } = require('express');
 const router = Router();
 const {
    createPayment,
    executePayment,
    createProduct,
    createPlan,
    generateSubscription,
 
 } = require('../controllers/paypalController');
 const { validarJWT } = require('../middlewares/validar-jwt');
 
//  router.get('/', getPagos);
 router.post('/create-payment', createPayment);
 router.post('/create-product', createProduct);
 router.post('/create-plan', createPlan);
 router.post('/generate-subscription', generateSubscription);
 router.get('/execute-payment', executePayment);
 
//  router.put('/editar/:id', [
//      validarJWT,
//      // check('referencia', 'El referencia es necesario').not().isEmpty(),
//     //  validarCampos
//  ], actualizarPago);
 
 
 
 module.exports = router;