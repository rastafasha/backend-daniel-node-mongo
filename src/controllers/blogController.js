const { response } = require('express');
const Blog = require('../models/blog');
const Categoria = require('../models/categoria');


const getBlogs = async(req, res) => {

    const blogs = await Blog.find({})
    .populate('usuario')
    .populate('pago')
    .populate('binancepay')
    .populate('categoria');

    res.json({
        ok: true,
        blogs
    });
};

const getBlog = async(req, res) => {

    const id = req.params.id;
    const uid = req.uid;

    Blog.findById(id, {})
    .populate('usuario')
    .populate('pago')
    .populate('binancepay')
    .populate('categoria')
        .exec((err, blog) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar blog',
                    errors: err
                });
            }
            if (!blog) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El blog con el id ' + id + 'no existe',
                    errors: { message: 'No existe un blog con ese ID' }
                });

            }
            res.status(200).json({
                ok: true,
                blog: blog
            });
        });

};

const crearBlog = async(req, res) => {

    const uid = req.uid;
    const blog = new Blog({
        usuario: uid,
        ...req.body
    });

    try {

        const blogDB = await blog.save();

        res.json({
            ok: true,
            blog: blogDB
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el admin'
        });
    }


};

const actualizarBlog = async(req, res) => {

    const id = req.params.id;
    const uid = req.uid;

    try {

        const blog = await Blog.findById(id);
        if (!blog) {
            return res.status(500).json({
                ok: false,
                msg: 'blog no encontrado por el id'
            });
        }

        const cambiosBlog = {
            ...req.body,
            usuario: uid
        }

        const blogActualizado = await Blog.findByIdAndUpdate(id, cambiosBlog, { new: true });

        res.json({
            ok: true,
            blogActualizado
        });

    } catch (error) {

        res.status(500).json({
            ok: false,
            msg: 'Error hable con el admin'
        });
    }


};

const borrarBlog = async(req, res) => {

    const id = req.params.id;

    try {

        const blog = await Blog.findById(id);
        if (!blog) {
            return res.status(500).json({
                ok: false,
                msg: 'blog no encontrado por el id'
            });
        }

        await Blog.findByIdAndDelete(id);

        res.json({
            ok: true,
            msg: 'blog eliminado'
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

    Blog.findByIdAndUpdate({ _id: id }, { status: 'Desactivado' }, (err, blog_data) => {
        if (err) {
            res.status(500).send({ message: err });
        } else {
            if (blog_data) {
                res.status(200).send({ blog: blog_data });
            } else {
                res.status(403).send({ message: 'No se actualizó el blog, vuelva a intentar nuevamente.' });
            }
        }
    })
}

function activar(req, res) {
    var id = req.params['id'];
    // console.log(id);
    Blog.findByIdAndUpdate({ _id: id }, { status: 'Activo' }, (err, blog_data) => {
        if (err) {
            res.status(500).send({ message: err });
        } else {
            if (blog_data) {
                res.status(200).send({ blog: blog_data });
            } else {
                res.status(403).send({ message: 'No se actualizó el blog, vuelva a intentar nuevamente.' });
            }
        }
    })
}

function destacados(req, res) {

    Blog.find({  isFeatured: ['true'] }).populate('categoria').exec((err, blog_data) => {
        if (err) {
            res.status(500).send({ message: 'Ocurrió un error en el servidor.' });
        } else {
            if (blog_data) {
                res.status(200).send({ blogs: blog_data });
            } else {
                res.status(500).send({ message: 'No se encontró ningun dato en esta sección.' });
            }
        }
    });
}

function activos(req, res) {

    Blog.find({  status: ['Activo'] }).populate('categoria').exec((err, blog_data) => {
        if (err) {
            res.status(500).send({ message: 'Ocurrió un error en el servidor.' });
        } else {
            if (blog_data) {
                res.status(200).send({ blogs: blog_data });
            } else {
                res.status(500).send({ message: 'No se encontró ningun dato en esta sección.' });
            }
        }
    });
}



function listar_newest(req, res) {
    Blog.find({  status: ['Activo'] }).populate('usuario').populate('categoria').populate('binancepay').sort({ createdAt: -1 }).limit(4).exec((err, data) => {
        if (data) {
            res.status(200).send({ blogs: data });
        }
    });
}



function find_by_slug(req, res) {
    var slug = req.params['slug'];

    Blog.findOne({ slug: slug })
    .populate('usuario')
    .populate('categoria')
    .populate('binancepay')
    .populate('pago')
    .exec((err, blog_data) => {
        if (err) {
            res.status(500).send({ message: 'Ocurrió un error en el servidor.' });
        } else {
            if (blog_data) {
                res.status(200).send({ blog: blog_data });
            } else {
                res.status(500).send({ message: 'No se encontró ningun dato en esta sección.' });
            }
        }
    });
}

const listarBlogPorUsuario = (req, res) => {
    var id = req.params['id'];
    Blog.find({ usuario: id }, (err, blog_data) => {
        if (!err) {
            if (blog_data) {
                res.status(200).send({ blogs: blog_data });
            } else {
                res.status(500).send({ error: err });
            }
        } else {
            res.status(500).send({ error: err });
        }
    }).populate('usuario');
}
const listarBlogPorCategoria = (req, res) => {
    var nombre = req.params['nombre'];
    Blog.find({ categoria: nombre }, (err, blog_data) => {
        if (!err) {
            if (blog_data) {
                res.status(200).send({ blogs: blog_data });
            } else {
                res.status(500).send({ error: err });
            }
        } else {
            res.status(500).send({ error: err });
        }
    });
}


const listar_best_sellers = (req, res) => {
    Blog.find().sort({ ventas: -1 }).limit(8).exec((err, blog) => {
        if (blog) {
            res.status(200).send({ blog: blog });
        }
    });
}

const cat_by_name = async(req, res) => {


    await Blog.find({}, 'categoria').filter('categoria', 'nombre').populate('name').exec((err, blog_data) => {
        if (err) {
            res.status(500).send({ message: 'Ocurrió un error en el servidor.' });
        } else {
            if (blog_data) {
                res.status(200).send({ blogs: blog_data });
            } else {
                res.status(500).send({ message: 'No se encontró ningun dato en esta sección.' });
            }
        }
    });
}

const aumentar_venta = (req, res) => {
    var id = req.params['id'];

    Blog.findById({ _id: id }, (err, blog) => {

        if (blog) {
            Blog.findByIdAndUpdate({ _id: id }, { ventas: parseInt(blog.ventas) + 1 }, (err, data) => {
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
    getBlogs,
    crearBlog,
    getBlog,
    actualizarBlog,
    borrarBlog,
    desactivar,
    activar,
    destacados,
    find_by_slug,
    listar_newest,
    listarBlogPorUsuario,
    listarBlogPorCategoria,
    listar_best_sellers,
    cat_by_name,
    aumentar_venta,
    activos


};