const bcrypt = require('bcrypt');

exports.get_login = (request, response, next) => {
    response.render('login');
};

exports.get_first = (request, response, next) => {
    response.render('first_page');
};

/*
* get_usuario 
Obtener el usuario
TODO: obtener usuario de la base de datos
@param 
*/
exports.get_usuario = (request, response, next) => {
    response.render('usuario');
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