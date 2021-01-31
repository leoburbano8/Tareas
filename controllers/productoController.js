const Producto = require('../models/Producto');
const { validationResult } = require('express-validator');

exports.crearProducto  = async (req, res) => {

    //Revisar si hay errores 
    const errores = validationResult(req);
    if( !errores.isEmpty()){
        return res.status(400).json({errores: errores.array()})
    }

    try {
        //Crear un nuevo producto
        const producto = new Producto(req.body);

        //Guardar el creador via JWT
        producto.creador = req.usuario.id;

        //Guardamos el producto
        producto.save();
        res.json(producto);

        
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

//Obtiene todos los productos del usuario actual
exports.obtenerProductos = async (req, res) => {

    try {
        const productos = await Producto.find({creador: req.usuario.id}).sort({creado: -1});
        res.json({productos});
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');  
    }
}

//Actualiza un producto
exports.actualizarProducto = async (req, res) => {
    
    //Revisar si hay errores 
    const errores = validationResult(req);
    if( !errores.isEmpty()){
        return res.status(400).json({errores: errores.array()})
    }

    //Extraer la informacion del producto
    const { nombre } = req.body;
    const nuevoProducto = {};

    if(nombre){
        nuevoProducto.nombre = nombre;
    }

    try {
        //Revisar el ID
        let producto = await Producto.findById(req.params.id);

        //Revisar si el producto existe
        if(!producto){
            return res.status(404).json({msg: 'Producto no encontrado'})
        }
        //Verificar el creador del producto
        if(producto.creador.toString() !== req.usuario.id){
            return res.status(401).json({msg: 'No autorizado'});
        }

        //Actualizar
        producto = await Producto.findByIdAndUpdate({ _id: req.params.id }, { $set: nuevoProducto }, { new: true });

        res.json({producto});

    } catch (error) {
        console.log(error);
        res.status(500).send('Error en el servidor');  
    }

}

//Elimina un producto
exports.eliminarProducto = async (req, res) => {
    
    try {
    
        //Revisar el ID
        let producto = await Producto.findById(req.params.id);

        //Revisar si el producto existe
        if(!producto){
            return res.status(404).json({msg: 'Producto no encontrado'})
        }
        //Verificar el creador del producto
        if(producto.creador.toString() !== req.usuario.id){
            return res.status(401).json({msg: 'No autorizado'})
        }
        //Eliminar el producto
        await Producto.findOneAndRemove({_id : req.params.id});
        res.json({msg: 'Producto eliminado'})

    } catch (error) {
        console.log(error);
        res.status(500).send('Error en el servidor');  
    }
    
}