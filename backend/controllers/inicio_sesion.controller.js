const bcrypt = require('bcrypt');

exports.get_login = (request, response, next) => {
    response.render('login');
};

exports.get_user = (request, response, next) => {
    response.render('login');
};

exports.post_hash = async (request, response, next) => {
    try {
        if (!request.body || !request.body.password) {
            return response.status(400).json({ error: "No se recibió la contraseña" });
        }

        const { password } = request.body;

        const hash = await bcrypt.hash(password, 10);

        console.log("Contraseña:", password);
        console.log("Hash:", hash);

        response.json({ hash });
    } catch (error) {
        console.error(error);
        response.status(500).json({ error: "Error al hashear" });
    }
};