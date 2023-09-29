/*
 Ruta: /api/cursos
 */

 const { Router } = require('express');
 const router = Router();
 const {
    getCursos,
    getCurso,
    crearCurso,
    actualizarCurso,
    borrarCurso,
    desactivar,
    activar,
    destacado,
    find_by_slug,
    listar_newest,
    listarCursoPorUsuario,
    listarCursoPorCategoria,
    listar_best_sellers,
    cat_by_name,
    aumentar_venta
 
 } = require('../controllers/cursoController');
 const { validarJWT } = require('../middlewares/validar-jwt');
 const { check } = require('express-validator');
 const { validarCampos } = require('../middlewares/validar-campos');
 
 router.get('/', getCursos);
 router.get('/:id', getCurso);
 router.get('/destacados', destacado);
 router.get('/find_by_slug/:slug', find_by_slug);
 router.get('/recientes', listar_newest);
 router.get('/user_curso/:id', listarCursoPorUsuario);
 router.get('/curso_categoria/:nombre', listarCursoPorCategoria);
 
 
 router.post('/crear', [
     validarJWT,
     check('name', 'El nombre es necesario').not().isEmpty(),
     // check('categoria', 'El categoria id debe de ser valido').isMongoId(),
     validarCampos
 ], crearCurso);
 
 router.put('/editar/:id', [
     validarJWT,
     check('name', 'El nombre es necesario').not().isEmpty(),
     validarCampos
 ], actualizarCurso);
 
 router.delete('/borrar/:id', validarJWT, borrarCurso);
 
 
 
 router.get('/desactivar/:id', validarJWT, desactivar);
 router.get('/activar/:id', validarJWT, activar);
 
 router.get('/cursos_ventas/best_sellers', validarJWT, listar_best_sellers);
 router.get('/curso_by_categorynombre/:nombre', cat_by_name);
 router.get('/cursos_ventas/aumentar/:id', validarJWT, aumentar_venta);
 
 module.exports = router;