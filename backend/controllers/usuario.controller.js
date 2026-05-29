const Usuario = require('../models/usuario.model');
const bcrypt = require('bcrypt');

exports.post_crear_usuario = async (req, res) => {
    const { nombre_usuario, correo_usuario, contrasena_usuario, estatus_usuario } = req.body;

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
            is_user_admin: 0 
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

exports.get_usuarios = async (req, res) => {
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

exports.post_eliminar_usuario = async (req, res) => {
    const { id_usuario } = req.body;

    try {
        const [resultado] = await Usuario.eliminar(id_usuario);

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado.'
            });
        }

        res.status(200).json({ 
            success: true, 
            message: 'Usuario eliminado exitosamente.' 
        });

    } catch (error) {
        console.error("Error al eliminar usuario:", error);
        res.status(500).json({ 
            success: false, 
            message: 'Error al eliminar el usuario de la base de datos.' 
        });
    }
};