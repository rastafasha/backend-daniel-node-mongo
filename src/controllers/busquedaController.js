const { response } = require('express');
const Pago = require('../models/pago');
const Categoria = require('../models/categoria');
const Blog = require('../models/blog');
const Usuario = require('../models/usuario');

const getTodo = async(req, res = response) => {

    const busqueda = req.params.busqueda;
    const regex = new RegExp(busqueda, 'i');


    const [usuarios, blogs, categorias, pagos] = await Promise.all([
        Usuario.find({ username: regex}),
        Blog.find({ name: regex }),
        Categoria.find({ nombre: regex }),
        Pago.find({ referencia: regex })
    ]);

    res.json({
        ok: true,
        usuarios,
        blogs,
        categorias,
        pagos,

    })
}

const getDocumentosColeccion = async(req, res = response) => {

    const tabla = req.params.tabla;
    const busqueda = req.params.busqueda;
    const regex = new RegExp(busqueda, 'i');

    let data = [];

    switch (tabla) {
        case 'usuarios':
            data = await Usuario.find({ username: regex });
            break;
        case 'blogs':
            data = await Blog.find({ name: regex })
                .populate('name', 'price img');
            break;
        case 'categorias':
            data = await Categoria.find({ nombre: regex });
            break;
        case 'pagos':
            data = await Pago.find({ referencia: regex })
                .populate('referencia', 'monto img');
            break;
        default:
            return res.status(400).json({
                ok: false,
                msg: 'la tabla debe ser usuarios/blogs/categorias/pagos'
            });
    }

    res.json({
        ok: true,
        resultados: data
    });

    const [usuarios, blogs, categorias, pagos] = await Promise.all([
        Usuario.find({ username: regex }),
        Blog.find({ name: regex }),
        Categoria.find({ nombre: regex }),
        Pago.find({ referencia: regex })
    ]);

    res.json({
        ok: true,
        usuarios,
        blogs,
        categorias,
        pagos

    })
}

module.exports = {
    getTodo,
    getDocumentosColeccion
}