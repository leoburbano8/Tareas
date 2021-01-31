const express = require('express');
const router = express.Router();
const tareaController = require('../controllers/tareaController');
const auth = require('../middleware/auth');
const {check} = require('express-validator');

//Crear una tarea
//api/tareas
router.post('/',
    auth,
    [
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('producto', 'El producto es obligatorio').not().isEmpty()
    ],
    tareaController.crearTarea
);

//Obtener las tareas por producto
router.get('/',
    auth,
    tareaController.obtenerTareas
);

//Actualizar tarea
router.put('/:id',
    auth,
    [
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('producto', 'El producto es obligatorio').not().isEmpty()
    ],
    tareaController.actualizarTarea
);

//Eliminar una tarea
router.delete('/:id', 
    auth,
    tareaController.eliminarTarea
);


module.exports = router;