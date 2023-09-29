/*
 Ruta: /api/videos
 */

 const { Router } = require('express');
 const router = Router();
 const {
    getVideos,
    getVideo,
    crearVideo,
    actualizarVideo,
    borrarVideo,
    desactivar,
    activar,
    listarVideoPorCurso,
 
 } = require('../controllers/videoController');
 const { validarJWT } = require('../middlewares/validar-jwt');
 const { check } = require('express-validator');
 const { validarCampos } = require('../middlewares/validar-campos');
 
 router.get('/', getVideos);
 router.get('/:id', getVideo);
 router.get('/video_curso/:id', listarVideoPorCurso);
 
 
 router.post('/crear', [
     validarJWT,
     check('name', 'El nombre es necesario').not().isEmpty(),
     // check('categoria', 'El categoria id debe de ser valido').isMongoId(),
     validarCampos
 ], crearVideo);
 
 router.put('/editar/:id', [
     validarJWT,
     check('name', 'El nombre es necesario').not().isEmpty(),
     validarCampos
 ], actualizarVideo);
 
 router.delete('/borrar/:id', validarJWT, borrarVideo);

 router.get('/desactivar/:id', validarJWT, desactivar);
 router.get('/activar/:id', validarJWT, activar);
 
 
 module.exports = router;