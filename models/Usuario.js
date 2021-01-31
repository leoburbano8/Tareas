const mongoose = require('mongoose');

const UsuariosSchema = mongoose.Schema({
    nombre:{
        type: String,
        required: true,
        trim: true
    },
    apellido:{
        type: String,
        required: true,
        trim: true
    },
    email:{
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password:{
        type: String,
        required: true,
        trim: true
    },
    registro:{
        type: Date,
        default: Date.now()
    }
    //nombre, apellido, email, contraseña, contraseña2
});

module.exports = mongoose.model('Usuario', UsuariosSchema);