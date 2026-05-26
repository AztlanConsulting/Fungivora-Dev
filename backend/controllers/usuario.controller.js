const Usuario = require('../models/usuario.model');
const bcrypt = require('bcrypt');

exports.post_crear_usuario = async (req, res, next) => {
    const { nombre_usuario, correo_usuario, contrasena_usuario, estatus_usuario, is_user_admin } = req.body;

    try {
        const usuarioExistente = await Usuario.fetch_one(nombre_usuario);
        const correoExistente = await Usuario.fetch_one(correo_usuario);
        
        if (usuarioExistente || correoExistente) {
            return res.status(400).json({
                success: false,
                message: 'El nombre de usuario o el correo ya están registrados.'
            });
        }

        const contrasenaHasheada = await bcrypt.hash(contrasena_usuario, 10);

        await Usuario.crear({
            nombre_usuario,
            correo_usuario,
            contrasena_usuario: contrasenaHasheada, 
            estatus_usuario,
            is_user_admin
        });

        res.status(201).json({ 
            success: true, 
            message: 'Usuario registrado exitosamente.' 
        });

    } catch (error) {
        console.error("Error al crear usuario:", error);
        res.status(500).json({ 
            success: false, 
            message: 'Error al registrar el usuario en la base de datos.' 
        });
    }
};

exports.get_usuarios = async (req, res, next) => {
    try {
        const usuarios = await Usuario.fetch_all();
        
        res.status(200).json({
            success: true,
            data: usuarios
        });
    } catch (error) {
        console.error("Error al obtener usuarios:", error);
        res.status(500).json({ 
            success: false, 
            message: 'Error al obtener la lista de usuarios.' 
        });
    }
};