const bcrypt = require('bcrypt');
const Usuario = require('../models/usuario.model');

//Obtiene todos los usuarios
exports.get_lista_usuarios = async (req, res) => {

    try {
    const usuarios = await Usuario.getAllusers();
    res.status(200).json(usuarios);
    }
    catch (error){
        console.log("Error al obtener usuarios", error);
        res.status(500).json({ ok: false, mensaje: "Error con la DB"})
    }
}

//Se encarga de la eliminacion de los ussuarios
exports.delete_usuario = async (req, res) => {

    try {
      const id_usuario = req.params.id_usuario 
      const UsuarioData = await Usuario.getByid(id_usuario)
      const delete_usuario = await Usuario.deleateByid(id_usuario)
      res.json({
        ok:true,
        mensaje:"Usuario eliminado"
      })
    } 
    catch (error) { 
        console.log("Error", error)  
        res.json({
        ok:false,
        mensaje:"Error usuario no eliminado"
      })

    }

}

/*
 * get_usuario 
 * Obtener el usuario actual
 * TODO: obtener usuario de la base de datos
 */

exports.get_usuario = (req, res) => {
    res.status(200).json({ msg: "Autorizado" });
};