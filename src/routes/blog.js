/*
 Ruta: /api/blogs
 */

const { Router } = require('express');
const router = Router();
const {
    getBlogs,
    getBlog,
    crearBlog,
    actualizarBlog,
    borrarBlog,
    desactivar,
    activar,
    destacado,
    find_by_slug,
    listar_newest,
    listarBlogPorUsuario,
    listarBlogPorCategoria,
    listar_best_sellers,
    cat_by_name,
    aumentar_venta

} = require('../controllers/blogController');
const { validarJWT } = require('../middlewares/validar-jwt');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');

router.get('/', getBlogs);
router.get('/destacados', destacado);
router.get('/find_by_slug/:slug', find_by_slug);
router.get('/recientes', listar_newest);
router.get('/user_blog/:id', listarBlogPorUsuario);
router.get('/blog_categoria/:nombre', listarBlogPorCategoria);


router.post('/crear', [
    validarJWT,
    check('name', 'El nombre es necesario').not().isEmpty(),
    // check('categoria', 'El categoria id debe de ser valido').isMongoId(),
    validarCampos
], crearBlog);

router.put('/editar/:id', [
    validarJWT,
    check('name', 'El nombre es necesario').not().isEmpty(),
    // check('categoria', 'El categoria id debe de ser valido').isMongoId(),
    validarCampos
], actualizarBlog);

router.delete('/borrar/:id', validarJWT, borrarBlog);

router.get('/:id', getBlog);

router.get('/desactivar/:id', validarJWT, desactivar);
router.get('/activar/:id', validarJWT, activar);

router.get('/blogs_ventas/best_sellers', validarJWT, listar_best_sellers);
router.get('/blog_by_categorynombre/:nombre', cat_by_name);
router.get('/blogs_ventas/aumentar/:id', validarJWT, aumentar_venta);

module.exports = router;