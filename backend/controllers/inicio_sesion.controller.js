const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Usuario = require('../models/usuario.model');

exports.get_login = (req, res) => {
    res.render('login');
};

/*
* post_login
Hacer un login basico para tener permisos
TODO: limitar movimento de url por el acceso
Metodo que toma la información del usuario y su rol para poder acceder
@param id_usuario, nombre_usuario, nombre_rol
*/
exports.post_login = async (req, res) => {
    try {
        const { nombre_usuario, contrasena } = req.body;

        const user = await Usuario.fetchOne(nombre_usuario);

        if (!user) {
            return res.status(404).json({ msg: "Usuario no encontrado" });
        }

        if (user.contrasena_usuario !== contrasena) {
            return res.status(401).json({ msg: "Contraseña incorrecta" });
        }

        const token = jwt.sign(
            {
                id: user.id_usuario,
                rol: user.nombre_rol
            },
            "secreto_super_seguro",
            { expiresIn: "1h" }
        );

        res.json({
            token
        });

    } catch (error) {
        console.error(error); //! Alerta de error en la consola
        res.status(500).json({ msg: "Error en login" });
    }
};

/*
* get_usuario 
Obtener el usuario
TODO: obtener usuario de la base de datos
@param 
*/
exports.get_usuario = (req, res) => {
    res.json({ msg: "Acceso autorizado" });
};

/*
* post_hash
Hashear la contraseña
Metodo que toma la contraseña guardada por el cuadro de texto
@param contrasena, contrasena_hasheada
*/
let contrasena_hasheada = null; 
exports.post_hash = async (request, response, next) => {
    try {
        const { contrasena } = request.body;

        const hash = await bcrypt.hash(contrasena, 10);

        contrasena_hasheada = hash; 
        console.log("Contraseña guardada:", contrasena);
        console.log("Hash guardado:", contrasena_hasheada);

    } catch (error) {
        console.error(error);
        response.status(500).json({ error: "Error al hashear" });
    }
};

/*
* post_comparacion
Compara la contraseña hasheada
Metodo que toma la contraseña guardada y la 
compara con la que esta en el cuadro de texto
@param contrasena, contrasena_hasheada
*/
exports.post_comparacion = async (request, response, next) => {
    try {
        const { contrasena } = request.body;
        console.log("Contraseña en el cuadro de texto:", contrasena);
        console.log("Hash de esa contraseña:", contrasena_hasheada);

        if (!contrasena_hasheada) {
            return response.status(400).json({ error: "No hay contraseña guardada" });
        }

        const result = await bcrypt.compare(contrasena, contrasena_hasheada);
        console.log("Si es la contraseña?:", result);

    } catch (error) {
        console.error(error);
        response.status(500).json({ error: "Error al comparar" });
    }
};