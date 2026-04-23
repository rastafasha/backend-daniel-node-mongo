/*
 Ruta: /api/plans
 */

const { Router } = require('express');
const router = Router();
const {
    getPlans,
    crearPlan,
    getPlan,
    actualizarPlan,
    borrarPlan,
    desactivar,
    activar

} = require('../controllers/planController');
const { validarJWT } = require('../middlewares/validar-jwt');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');

router.get('/', getPlans);

router.post('/crear', [
    validarJWT,
    check('name', 'El nombre es necesario').not().isEmpty(),
    validarCampos
], crearPlan);

router.put('/editar/:id', [
    validarJWT,
    check('name', 'El nombre es necesario').not().isEmpty(),
    validarCampos
], actualizarPlan);

router.delete('/borrar/:id', validarJWT, borrarPlan);

router.get('/:id', getPlan);

router.get('/desactivar/:id', validarJWT, desactivar);
router.get('/activar/:id', validarJWT, activar);

module.exports = router;