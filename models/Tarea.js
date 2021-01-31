const mongoose = require('mongoose');

const TareaSchema = mongoose.Schema({
    nombre:{
        type: String,
        required: true,
        trim: true
    },
    estado:{
        type: Boolean,
        default: false
    },
    creado:{
        type: Date,
        default: Date.now()
    },
    producto:{
         type: mongoose.Schema.Types.ObjectId,
         ref: 'Producto'
    }
});

module.exports = mongoose.model('Tarea', TareaSchema);