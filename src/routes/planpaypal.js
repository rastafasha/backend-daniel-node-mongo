/*
 Ruta: /api/planpaypal
 */

 const { Router } = require('express');
 const router = Router();
 const {
    getPlanPaypals,
    getPlanPaypal,
    crearPlanPaypal,
    actualizarPlanPaypal,
    desactivar,
    activar,
 
 } = require('../controllers/crudPaypalController');
 const { validarJWT } = require('../middlewares/validar-jwt');
 const { validarCampos } = require('../middlewares/validar-campos');
 
 router.get('/', getPlanPaypals);
 router.get('/:id', getPlanPaypal);
 
 
 router.post('/crear', crearPlanPaypal);
 
 router.put('/editar/:id', [
     validarJWT,
     validarCampos
 ], actualizarPlanPaypal);
 
 
 router.get('/desactivar/:id', validarJWT, desactivar);
 router.get('/activar/:id', validarJWT, activar);
 
 
 module.exports = router;