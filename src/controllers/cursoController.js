const { response } = require('express');
const Curso = require('../models/curso');


const getCursos = async(req, res) => {

    const cursos = await Curso.find({})
    .populate('videos')
    .populate('categoria')

    res.json({
        ok: true,
        cursos
    });
};

const getCurso = async(req, res) => {

    const id = req.params.id;
    const uid = req.uid;

    Curso.findById(id, {})
    .populate('videos')
    .populate('categoria')
        .exec((err, curso) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar curso',
                    errors: err
                });
            }
            if (!curso) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El curso con el id ' + id + 'no existe',
                    errors: { message: 'No existe un curso con ese ID' }
                });

            }
            res.status(200).json({
                ok: true,
                curso: curso
            });
        });

};

const crearCurso = async(req, res) => {

    const uid = req.uid;
    const curso = new Curso({
        usuario: uid,
        ...req.body
    });

    try {

        const cursoDB = await curso.save();

        res.json({
            ok: true,
            curso: cursoDB
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el admin'
        });
    }


};

const actualizarCurso = async(req, res) => {

    const id = req.params.id;
    const uid = req.uid;

    try {

        const curso = await Curso.findById(id);
        if (!curso) {
            return res.status(500).json({
                ok: false,
                msg: 'curso no encontrado por el id'
            });
        }

        const cambiosCurso = {
            ...req.body,
            usuario: uid
        }

        const cursoActualizado = await Curso.findByIdAndUpdate(id, cambiosCurso, { new: true });

        res.json({
            ok: true,
            cursoActualizado
        });

    } catch (error) {

        res.status(500).json({
            ok: false,
            msg: 'Error hable con el admin'
        });
    }


};

const borrarCurso = async(req, res) => {

    const id = req.params.id;

    try {

        const curso = await Curso.findById(id);
        if (!curso) {
            return res.status(500).json({
                ok: false,
                msg: 'curso no encontrado por el id'
            });
        }

        await Curso.findByIdAndDelete(id);

        res.json({
            ok: true,
            msg: 'curso eliminado'
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error hable con el admin'
        });
    }
};


function desactivar(req, res) {
    var id = req.params['id'];

    Curso.findByIdAndUpdate({ _id: id }, { status: 'Desactivado' }, (err, curso_data) => {
        if (err) {
            res.status(500).send({ message: err });
        } else {
            if (curso_data) {
                res.status(200).send({ curso: curso_data });
            } else {
                res.status(403).send({ message: 'No se actualizó el curso, vuelva a intentar nuevamente.' });
            }
        }
    })
}

function activar(req, res) {
    var id = req.params['id'];
    // console.log(id);
    Curso.findByIdAndUpdate({ _id: id }, { status: 'Activo' }, (err, curso_data) => {
        if (err) {
            res.status(500).send({ message: err });
        } else {
            if (curso_data) {
                res.status(200).send({ curso: curso_data });
            } else {
                res.status(403).send({ message: 'No se actualizó el curso, vuelva a intentar nuevamente.' });
            }
        }
    })
}

const destacado = async(req, res, next) => {

    
    Curso.find({
                where: {
                    isFeatured: true
                }
            }, (err, curso_data) => {
        if (!err) {
            if (curso_data) {
                res.status(200).send({ cursos: curso_data });
            } else {
                res.status(500).send({ error: err });
            }
        } else {
            res.status(500).send({ error: err });
        }
    });

};

function find_by_slug(req, res) {
    var slug = req.params['slug'];

    Curso.findOne({ slug: slug })
    .populate('videos')
    .populate('categoria')
    .exec((err, curso_data) => {
        if (err) {
            res.status(500).send({ message: 'Ocurrió un error en el servidor.' });
        } else {
            if (curso_data) {
                res.status(200).send({ curso: curso_data });
            } else {
                res.status(500).send({ message: 'No se encontró ningun dato en esta sección.' });
            }
        }
    });
}

function listar_newest(req, res) {
    Curso.find({}).populate('videos').populate('categoria').sort({ createdAt: -1 }).limit(4).exec((err, data) => {
        if (data) {
            res.status(200).send({ cursos: data });
        }
    });
}

const listarCursoPorUsuario = (req, res) => {
    var id = req.params['id'];
    Curso.find({ usuario: id }, (err, curso_data) => {
        if (!err) {
            if (curso_data) {
                res.status(200).send({ cursos: curso_data });
            } else {
                res.status(500).send({ error: err });
            }
        } else {
            res.status(500).send({ error: err });
        }
    }).populate('usuario');
}
const listarCursoPorCategoria = (req, res) => {
    var nombre = req.params['nombre'];
    Curso.find({ categoria: nombre }, (err, curso_data) => {
        if (!err) {
            if (curso_data) {
                res.status(200).send({ cursos: curso_data });
            } else {
                res.status(500).send({ error: err });
            }
        } else {
            res.status(500).send({ error: err });
        }
    });
}


const listar_best_sellers = (req, res) => {
    Curso.find().sort({ ventas: -1 }).limit(8).exec((err, curso) => {
        if (curso) {
            res.status(200).send({ curso: curso });
        }
    });
}

const cat_by_name = async(req, res) => {


    await Curso.find({}, 'categoria').filter('categoria', 'nombre').populate('name').exec((err, curso_data) => {
        if (err) {
            res.status(500).send({ message: 'Ocurrió un error en el servidor.' });
        } else {
            if (curso_data) {
                res.status(200).send({ cursos: curso_data });
            } else {
                res.status(500).send({ message: 'No se encontró ningun dato en esta sección.' });
            }
        }
    });
}

const aumentar_venta = (req, res) => {
    var id = req.params['id'];

    Curso.findById({ _id: id }, (err, curso) => {

        if (curso) {
            Curso.findByIdAndUpdate({ _id: id }, { ventas: parseInt(curso.ventas) + 1 }, (err, data) => {
                if (data) {
                    // console.log(data);
                    res.status(200).send({ data: data });
                } else {
                    // console.log(err);
                    res.status(500).send({ message: 'No se encontró ningun dato en esta sección.' });
                }
            })
        }
    })
}



module.exports = {
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


};