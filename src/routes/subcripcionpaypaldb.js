/*
 Ruta: /api/subcriptionpaypal
 */

 const { Router } = require('express');
 const router = Router();
 const {
    getSubcriptionPlanPaypals,
    getSubcriptionPlanPaypal,
    crearSubcriptionPlanPaypal,
    actualizarSubcriptionPlanPaypal,
    desactivar,
    activar,
    listar_newest,
    listarPorUsuario
 
 } = require('../controllers/crudSubcripcionPaypaldb');
 const { validarJWT } = require('../middlewares/validar-jwt');
 const { check } = require('express-validator');
 const { validarCampos } = require('../middlewares/validar-campos');
 
 router.get('/', getSubcriptionPlanPaypals);
 router.get('/:id', getSubcriptionPlanPaypal);
 router.get('/recientes', listar_newest);
 router.get('/user_profile/:id', listarPorUsuario);
 
 router.post('/crear', crearSubcriptionPlanPaypal);
 
 router.put('/editar/:id', [
     validarJWT,
 ], actualizarSubcriptionPlanPaypal);
 
 router.get('/desactivar/:id', validarJWT, desactivar);
 router.get('/activar/:id', validarJWT, activar);
 
 module.exports = router;