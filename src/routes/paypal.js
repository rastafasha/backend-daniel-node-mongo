
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
    page2,
    page3,
    page4,
    planpage2,
    planpage,
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
 router.get('/plans/page/:id', planpage);
 router.get('/plans/page2', planpage2);
 router.get('/products/page2', page2);
 router.get('/products/page3', page3);
 router.get('/products/page4', page4);

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