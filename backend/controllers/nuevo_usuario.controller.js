const bcrypt = require('bcrypt');
const Usuario = require('../models/usuario.model');

/*
* post_registro
Hacer el registro basico del usuario
Toma los datos del registro, los , verifica duplicados y hashea la contraseña
Tambien se encarga de los Insert
@param req.body { nombre_usuario, correo_usuario, contrasena_usuario }
*/
exports.post_registro = async (req, res, next) => {
 try{
    //Obtiene los datos del usuario
    const { 
        nombre_usuario, 
        correo_usuario, 
        contrasena }
        = req.body;

    //verifica errores

    //Que los campos esten completos
    if(!nombre_usuario || !correo_usuario || !contrasena) {
        return res.status(400).json({ msg: "Llena todos los campos." });
    }

    //Que los datos no se sobrepasen del limite de la Db y del asignado
    if (nombre_usuario.length > 100){
        return res.status(400).json({ msg: "El nombre no puede exceder 100 caracteres"});
    }

    if (contrasena.length > 20) {
        return res.status(400).json({ msg: "La contraseña debe ser menor a 21 caracteres." });
    }

    //Que el correo sea valido
    //Asistencia de la IA con el regex y su precisa implementacion
    const regexCorreo =  /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!regexCorreo.test(correo_usuario)) {
        return res.status(400).json({ msg: "Ingrese un correo valido"});
    }

    //toma el usuario y correo a que sean minusculas y sin espacios para comparativas 
    const nombreCorreccion = nombre_usuario.trim();
    const correoCorreccion = correo_usuario.trim().toLowerCase();

    //varifica duplicados de correos
    const dobleCorreo =await Usuario.fetch_one(correoCorreccion);
    if (dobleCorreo) {
        return res.status(409).json({msg: "Hay un usuario registrado con ese correo, agregue otro correo"});
    }
    //verifica duplicados de usuarios
    const dobleUsuario =await Usuario.fetch_one(nombreCorreccion);
    if (dobleUsuario) {
        return res.status(409).json({msg: "Hay un usuario registrado con ese Nombre, agregue otro nombre"});
    }

    //Hasheo de contraseñas usando bcrypt, se normaliza primero para adaptar la ñ
    const contrasenaNormalizada = contrasena.normalize("NFC");
    const contrasenaHash = await bcrypt.hash(contrasenaNormalizada, 10);

    //Creaccion del Registro
    const registro = await Usuario.anadir({
        nombre_usuario: nombreCorreccion,
        correo_usuario: correoCorreccion,
        contrasena_usuario: contrasenaHash,
    });

    return res.status(201).json({
        msg: "Usuario creado",
        id: registro.insertId,
    });

 }
    catch (error){
        console.error("Error en Registro vuelva a intentarlo más tarde",error);
        res.status(500).json({ msg: "Error al registrar usuario"});
 }
};


/*
* get_usuario 
Obtener el usuario
TODO: obtener usuario de la base de datos
@param 
*/
exports.get_registrar_usuario = (req, res) => {
    res.status(200).json({ msg: "Autorizado" });
};