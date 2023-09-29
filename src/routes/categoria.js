/*
 Ruta: /api/categorias
 */

const { Router } = require('express');
const router = Router();
const {
    getCategorias,
    crearCategoria,
    actualizarCategoria,
    borrarCategoria,
    getCategoria,
    find_by_name,
    getCategoriasList
} = require('../controllers/categoriaController');

const { validarJWT } = require('../middlewares/validar-jwt');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');

router.get('/', getCategorias);
router.get('/lista', getCategoriasList);
router.get('/:id', getCategoria);

router.post('/crear', [
    validarJWT,
    check('nombre', 'El nombre del categoria es necesario').not().isEmpty(),
    validarCampos
], crearCategoria);

router.put('/editar/:id', [
    validarJWT,
    check('nombre', 'El nombre del categoria es necesario').not().isEmpty(),
    validarCampos
], actualizarCategoria);

router.delete('/borrar/:id', validarJWT, borrarCategoria);




router.get('/category_by_nombre/:nombre', find_by_name);


module.exports = router;