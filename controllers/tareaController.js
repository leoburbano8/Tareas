const Tarea = require('../models/Tarea');
const Proyecto = require('../models/Producto');
const { validationResult } = require('express-validator');
const Producto = require('../models/Producto');

//Crea una nueva tarea
exports.crearTarea = async (req, res) => {

    //Revisar si hay errores 
    const errores = validationResult(req);
    if( !errores.isEmpty()){
        return res.status(400).json({errores: errores.array()})
    }

    
    
    try {
        //Extraer el proyecto y comprobar si existe
        const {producto} = req.body;
        const existeProducto = await Producto.findById(producto);
        if(!existeProducto){
            return res.status(404).json({msg: 'Producto no encontrado'})
        }

        //Revisar si el producto actual pertenece al usuario autenticado
        if(existeProducto.creador.toString() !== req.usuario.id){
            return res.status(401).json({msg: 'No autorizado'});
        }

        //Creamos la tarea
        const tarea = new Tarea(req.body);
        await tarea.save();
        res.json({tarea});

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

//Obtener tareas por producto
exports.obtenerTareas = async (req, res) => {
    
    try {
        //Extraer el proyecto y comprobar si existe
        const {producto} = req.query;
        const existeProducto = await Producto.findById(producto);
        if(!existeProducto){
            return res.status(404).json({msg: 'Producto no encontrado'})
        }

        //Revisar si el producto actual pertenece al usuario autenticado
        if(existeProducto.creador.toString() !== req.usuario.id){
            return res.status(401).json({msg: 'No autorizado'});
        }

        //Obtener las tareas por producto 
        const tareas = await Tarea.find({producto}).sort({creado: -1});
        res.json({tareas});

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

//Actualizar tarea
exports.actualizarTarea = async (req, res) => {
    
    try {
         //Extraer el producto y comprobar si existe
         const {producto, nombre, estado} = req.body;

        //Revisar si la tarea existe o no
        let tarea = await Tarea.findById(req.params.id); 
        
        if(!tarea){
            return res.status(404).json({msg: ' No existe esa tarea'});
        }

         //Extraer producto
         const existeProducto = await Producto.findById(producto);
          
         //Revisar si el producto actual pertenece al usuario autenticado
         if(existeProducto.creador.toString() !== req.usuario.id){
             return res.status(401).json({msg: 'No autorizado'});
         }

          //Crear un objeto con la nueva informacion
          const nuevaTarea = {};
                nuevaTarea.nombre = nombre;
                nuevaTarea.estado = estado;

         //Guardar la tarea
         tarea = await Tarea.findOneAndUpdate({_id: req.params.id}, nuevaTarea, {new: true} );
         res.json({tarea})

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }

}

//Eliminar tarea
exports.eliminarTarea = async (req, res) => {
    try {
        //Extraer el producto y comprobar si existe
        const {producto} = req.query;

       //Revisar si la tarea existe o no
       let tarea = await Tarea.findById(req.params.id); 
       
       if(!tarea){
           return res.status(404).json({msg: ' No existe esa tarea'});
       }

        //Extraer producto
        const existeProducto = await Producto.findById(producto);
         
        //Revisar si el producto actual pertenece al usuario autenticado
        if(existeProducto.creador.toString() !== req.usuario.id){
            return res.status(401).json({msg: 'No autorizado'});
        }

        //Eliminar tarea
        await Tarea.findOneAndRemove({_id: req.params.id});
        res.json({msg: 'Tarea eliminada'});

   } catch (error) {
       console.log(error);
       res.status(500).send('Hubo un error');
   }
}