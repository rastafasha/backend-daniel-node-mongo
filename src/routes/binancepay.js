/*
 Ruta: /api/binancepay
 */

 const { Router } = require('express');
 const router = Router();
 const {
    getBinancepays,
    getBinancepay,
    crearBinancepay,
    actualizarBinancepay,
    borrarBinancepay,
    desactivar,
    activar,
    destacado,
    listar_newest,
 
 } = require('../controllers/binancepayController');
 const { validarJWT } = require('../middlewares/validar-jwt');
 const { check } = require('express-validator');
 const { validarCampos } = require('../middlewares/validar-campos');
 
 router.get('/', getBinancepays);
 router.get('/:id', getBinancepay);
 router.get('/destacados', destacado);
router.get('/recientes', listar_newest);
 router.get('/desactivar/:id', validarJWT, desactivar);
 router.get('/activar/:id', validarJWT, activar);
 
 router.delete('/borrar/:id', validarJWT, borrarBinancepay);
 
 router.post('/crear', [
     validarJWT,
     check('titulo', 'El titulo es necesario').not().isEmpty(),
     validarCampos
 ], crearBinancepay);
 
 router.put('/editar/:id', [
     validarJWT,
     check('titulo', 'El titulo es necesario').not().isEmpty(),
     validarCampos
 ], actualizarBinancepay);
 
 
 
 module.exports = router;