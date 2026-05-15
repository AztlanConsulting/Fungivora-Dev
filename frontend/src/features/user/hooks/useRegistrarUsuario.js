import { useState, useEffect, useCallback  } from "react";
import { useNavigate } from "react-router-dom";
import registrarUsuarioService from "../service/registrar_usuario.service";

const useRegistrarUsuario=() => {
    const navigate = useNavigate();

    //variables del usuario
    const [valusuario, setValusuario] = useState("");
    const [valcorreo, setValcorreo] = useState("");
    const [valcontrasena, setValcontrasena] = useState("");
    const [valverifica, setValverifica] = useState("");

    const [accionPendiente, setAccionPendiente] = useState(null);
    const [isModalOpen,setIsModalOpen] = useState(false);
    const [error, setError] = useState("");
    const [verificando, setVerificando] = useState(true);

    //estado de efectos, donde se hara la validacion y verificacion de los datos
    useEffect(() => {
        //verifica el usuario y si esta autorizado 
        const verifica = async () => {
            //toma el token de local storage y se encarga de la verificacion de que si hay token y que hacer en ese caso
            const token = localStorage.getItem("token");
            if (!token) {
                localStorage.removeItem("token");
                navigate("/login", { replace: true});
                return;
            }
            try {
                //lee el token y describe que hacer en caso de que si el usuario no es autorizado
                const data = await registrarUsuarioService.verificarAdmin();
                if (!data || data.msg !== "Autorizado"){
                    navigate("/first", { replace: true});
                    return;
                }
                setVerificando(false);
                }
            catch (err) {
                console.error("Error al verificar permisos", err);
                localStorage.removeItem("token");
                navigate("/login", {replace: true });
            }
        };
        verifica();
        }, [navigate]);
            //validacion de variables y errores
            const validarContenido = () => {
                // Validación: que no estén vacías
                if ((!valusuario || !valcorreo || !valcontrasena || !valverifica)) {
                    return"Llena todos los campos.";
                }

                    // Validación: de carecteres en correo
                if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(valcorreo)) {
                    return "Inserte un correo valido (ejemplo: ejemplo@mail.com).";
                    
                }

                // Validación: no se esta usando espacios en contrseñas
                if (/\s/.test(valcontrasena) || /\s/.test(valverifica)) {
                    return "La contraseña no puede contener espacios";
                }

                // Validación: no se esta usando espacios innecesarios y de caracteres en usuario
                if (!/^[\p{L}\p{N}]+([ ][\p{L}\p{N}]+)*$/u.test(valusuario)) {
                    return "El usuario solo puede contener letras o números, sin espacios al inicio o final"
                }

                //Validación: de carecteres en contrasenas
                if (!/^[a-zA-Z0-9ñÑ]+$/.test(valcontrasena)) {
                    return "La contraseña solo puede contener letras y números.";
                }

                // Validación: de limite de contraseñas
                if (valcontrasena.length > 20){
                    return "La contraseña no puede superar 20 caracteres.";
                }

                // Validación: De contraseñas iguales
                if (valcontrasena !== valverifica) {
                    return "Las contraseñas no coinciden, verifica que sean iguales.";
                }
                return null;
            };
                //handles de lso clicks
                const handleRegistrarClick = () => { 
                    const errorValidacion = validarContenido();
                    if (errorValidacion) {
                        setError(errorValidacion);
                        return;
                    }
                    setError("");
                    setAccionPendiente("registrar");
                    setIsModalOpen(true);
                };

                const handleCancelarClick = () => {
                    setAccionPendiente("cancelar");
                    setIsModalOpen(true);
                };

                const handleConfirm = useCallback(async () => {
                    setIsModalOpen(false);

                    if (accionPendiente === "cancelar"){
                        setAccionPendiente(null);
                        navigate("/usuario");
                        return;
                    }

        try {
            //maneja los datos del servicios
            const data = await registrarUsuarioService.registrarUsuario(
                valusuario,
                valcorreo,
                valcontrasena
            );

            if (data.msg === "Token inválido") {
                setAccionPendiente(null);
                localStorage.removeItem("token");
                navigate("/login");
                return
            }

            if (data.msg === "No autorizado"){
                setAccionPendiente(null);
                navigate("/first", { replace: true });
                return;
            }

            setAccionPendiente(null);
            navigate("/usuario");
            }
            catch (err){
            const mensaje = err.response?.data?.msg || "Hubo un error con la conexion, intenta otra vez";
            console.error("error de red", err);
            setError(mensaje);
            setAccionPendiente(null);
            }
        }, [accionPendiente, valusuario, valcorreo, valcontrasena, navigate]);

        const handleCancelarModal = () => setIsModalOpen(false);

        return{

            valusuario, setValusuario,
            valcorreo, setValcorreo,
            valcontrasena, setValcontrasena,
            valverifica, setValverifica,

            error, setError,
            isModalOpen,
            verificando,
        
            handleRegistrarClick,
            handleCancelarClick,
            handleConfirm,
            handleCancelarModal,
        };
    };

    export default useRegistrarUsuario;