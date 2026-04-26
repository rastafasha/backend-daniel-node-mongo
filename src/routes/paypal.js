
/*
 Ruta: /api/paypal
 */

 const { Router } = require('express');
 const router = Router();
 const {
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
    getProductsByPage,
    getPlanesPorPagina,
    getSubcriptions,
    getSubcriptionbyId
 } = require('../controllers/paypalController');
 const { validarJWT } = require('../middlewares/validar-jwt');
 
 router.get('/plans', getPlans);
 router.get('/plan/:id', getPlanbyId);
 router.get('/subcriptions', getSubcriptions);
 router.get('/subcription/:id', getSubcriptionbyId);
 router.get('/product/:id', getProductsbyId);
 router.get('/products', getProducts);
 router.get('/planes-paypal', getPlanesPorPagina);
router.get('/products-paypal', getProductsByPage);

 router.post('/create-payment', createPayment);

 router.post('/create-product', createProduct);

 router.post('/create-plan', createPlan);
 router.post('/generate-subscription', generateSubscription);
 
 router.patch('/editar-product/:id', updatePproduct);
 router.patch('/editar-plan/:id', updatePlan);
 router.patch('/activar-plan/:id', activatePlan);
 router.patch('/desactivar-plan/:id', desactivatePlan);

 router.get('/execute-payment', executePayment);
 

 
 module.exports = router;