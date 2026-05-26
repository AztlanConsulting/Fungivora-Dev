import React, { useState } from 'react';
import { Titulo, Text } from '../../shared/components/ui';
import { colores } from '../../shared/components/ui/basics/Colores';
import { Base } from '../../shared/components/layout';
import Button from '../../shared/components/ui/buttons/Botones';
import useUsuarios from '../../features/usuarios/hooks/useUsuarios';
import { HugeiconsIcon } from "@hugeicons/react";
import { CancelCircleIcon } from '@hugeicons/core-free-icons';
import FormCrearUsuario from '../../features/usuarios/components/FormCrearUsuario';

const colorBordeHeader = "#F2F2FC";
const gridLayoutUsuarios = "grid grid-cols-[2fr_2.5fr_1.5fr_1fr]"; 

const estadoInicialUsuario = {
    nombre_usuario: "",
    correo_usuario: "",
    contrasena_usuario: "",
    estatus_usuario: 1, 
    is_user_admin: 0    
};

const UsuariosView = () => {
    const { usuarios, cargando, error, addUsuario, refresh } = useUsuarios();
    const [filaSeleccionada, setFilaSeleccionada] = useState(null);
    
    const [vistaActual, setVistaActual] = useState("lista");
    const [nuevoUsuario, setNuevoUsuario] = useState(estadoInicialUsuario);
    const [errorFormulario, setErrorFormulario] = useState(null);
    const [guardando, setGuardando] = useState(false);

    const handleEliminar = async (e, id) => {
        e.stopPropagation(); 
        if (confirm("¿Seguro que deseas eliminar este usuario del sistema?")) {
            try {
                alert(`Solicitud para eliminar usuario ID: ${id} (Implementar endpoint en backend)`);
            } catch (err) {
                console.error("Error al eliminar usuario:", err);
            }
        }
    };

    const handleRegistrarUsuario = async () => {
        setGuardando(true);
        setErrorFormulario(null);

        const { nombre_usuario, correo_usuario } = nuevoUsuario;
        const usuarioExiste = usuarios.some(
            user => user.nombre_usuario?.toLowerCase().trim() === nombre_usuario?.toLowerCase().trim()
        );
        const correoExiste = usuarios.some(
            user => (user.correo_usuario || user.email)?.toLowerCase().trim() === correo_usuario?.toLowerCase().trim()
        );

        if (usuarioExiste) {
            setErrorFormulario("El nombre de usuario ya se encuentra registrado.");
            setGuardando(false);
            return;
        }

        if (correoExiste) {
            setErrorFormulario("El correo electrónico ya se encuentra registrado.");
            setGuardando(false);
            return;
        }
        
        const resultado = await addUsuario(nuevoUsuario);
        
        if (resultado?.success) {
            setNuevoUsuario(estadoInicialUsuario);
            setErrorFormulario(null);
            setVistaActual("lista");
            if (refresh) refresh(); 
        } else {
            const msgError = typeof resultado?.message === 'string' 
                ? resultado.message 
                : (resultado?.message?.error || "No se pudo registrar al usuario.");

            if (msgError.includes("Duplicate") || resultado?.code === "ER_DUP_ENTRY") {
                if (msgError.toLowerCase().includes("correo") || msgError.toLowerCase().includes("email")) {
                    setErrorFormulario("El correo electrónico ya se encuentra registrado.");
                } else {
                    setErrorFormulario("El nombre de usuario o el correo ya existen.");
                }
            } else {
                setErrorFormulario(msgError);
            }
        }
        setGuardando(false);
    };

    const handleCancelarRegistro = () => {
        setNuevoUsuario(estadoInicialUsuario);
        setErrorFormulario(null);
        setVistaActual("lista");
    };

    return (
        <Base margen_arriba="mt-24 md:mt-20">
            <div className="flex flex-col gap-6">
                
                {/* Cabecera Principal */}
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b border-gray-100 pb-4">
                    <div>
                        <Titulo>Usuarios</Titulo>
                    </div>
                    
                    {vistaActual === "lista" ? (
                        <Button
                            variant="cancelar" 
                            isOutline={true}
                            onClick={() => {
                                setErrorFormulario(null);
                                setVistaActual("crear");
                            }} 
                        >
                            Crear Usuario
                        </Button>
                    ) : (
                        <Button
                            variant="cancelar" 
                            isOutline={true}
                            onClick={handleCancelarRegistro} 
                        >
                            Ver Usuarios
                        </Button>
                    )}
                </div>
                {vistaActual === "crear" ? (
                <div className="w-full max-w-lg mx-auto bg-white rounded-[32px] shadow-sm border p-8">    
                    <div className="flex flex-col gap-4">
                            <FormCrearUsuario 
                                nuevoUsuario={nuevoUsuario}
                                setNuevoUsuario={setNuevoUsuario}
                                onGuardar={handleRegistrarUsuario}
                                onCancelar={handleCancelarRegistro}
                                cargando={guardando}
                                error={errorFormulario} 
                                setError={setErrorFormulario}
                            />
                        </div>
                  </div>
                ) : (
                    <>
                        {error && (
                            <div className="p-4 text-red-700 text-sm flex justify-between items-center">
                                <span>{error}</span>
                                <button onClick={refresh} className="underline font-semibold hover:text-red-800">Reintentar</button>
                            </div>
                        )}

                        <div className="flex flex-col md:border md:rounded-2xl overflow-hidden" style={{ borderColor: colorBordeHeader }}>
                            
                            {/* Header Desktop */}
                            <div className={`hidden md:grid ${gridLayoutUsuarios} items-center min-h-[60px]`} style={{ backgroundColor: colorBordeHeader }}>
                                <div className="px-6 flex items-center">
                                    <Text variante="medium" style={{ color: colores.azul, fontWeight: "600", fontSize: "16px" }}>Usuario</Text>
                                </div>
                                <div className="px-6 flex items-center">
                                    <Text variante="medium" style={{ color: colores.azul, fontWeight: "600", fontSize: "16px" }}>Correo Electrónico</Text>
                                </div>
                                <div className="px-6 flex items-center">
                                    <Text variante="medium" style={{ color: colores.azul, fontWeight: "600", fontSize: "16px" }}>Rol</Text>
                                </div>
                                <div className="px-6 py-4"></div>
                            </div>

                            {/* Cuerpo de Datos */}
                            <div className="max-h-[605px] md:max-h-[550px] overflow-y-auto flex flex-col gap-3 md:gap-0">
                                {cargando ? (
                                    <div className="flex justify-center items-center h-[200px] w-full">
                                        <div className="flex flex-col items-center gap-2 justify-center">
                                            <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                                            <Text variante="medium">Cargando personal de la base de datos...</Text>
                                        </div>
                                    </div>
                                ) : usuarios.length === 0 ? (
                                    <div className="text-center py-10 w-full">
                                        <Text variante="medium" style={{ color: colores.gris }}>No se encontraron usuarios en el sistema.</Text>
                                    </div>
                                ) : (
                                    usuarios.map((user) => {
                                        const esSeleccionado = filaSeleccionada === user.id_usuario;
                                        const emailFallback = user.correo_usuario || user.email || `${user.nombre_usuario.toLowerCase().replace(/\s+/g, '')}@devora.com`;

                                        return (
                                            <div key={user.id_usuario} className="w-full">
                                                
                                                {/* Vista de Desktop */}
                                                <div 
                                                    onClick={() => setFilaSeleccionada(user.id_usuario)}
                                                    className={`hidden md:grid ${gridLayoutUsuarios} cursor-pointer transition-all border-b hover:bg-slate-50`}
                                                    style={{ borderColor: colorBordeHeader, backgroundColor: 'white' }}
                                                >
                                                    <div className="px-6 py-5 flex items-center">
                                                        <Text variante="option" style={{ color: "black", fontWeight: "600", fontSize: "15px" }}>
                                                            {user.nombre_usuario}
                                                        </Text>
                                                    </div>
                                                    <div className="px-6 py-5 flex items-center truncate">
                                                        <Text variante="option" style={{ color: colores.black, fontWeight: "400", fontSize: "15px" }}>
                                                            {emailFallback}
                                                        </Text>
                                                    </div>
                                                    <div className="px-6 py-5 flex items-center">
                                                        {user.is_user_admin === 1 ? (
                                                            <div className="px-4 py-1 rounded-lg text-sm font-semibold bg-yellow-50 text-yellow-700 border border-yellow-100">
                                                                Administrador
                                                            </div>
                                                        ) : (
                                                            <div className="px-4 py-1 rounded-lg text-sm font-semibold bg-blue-50 text-blue-700 border border-blue-100">
                                                                Granjero
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="py-4 flex justify-center items-center">
                                                        <button 
                                                            onClick={(e) => handleEliminar(e, user.id_usuario)}
                                                            className="hover:scale-110 transition-transform p-2"
                                                            title="Eliminar del sistema"
                                                        >
                                                            <HugeiconsIcon icon={CancelCircleIcon} size={24} color={colores.azul} />
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Vista de Móvil */}
                                                <div 
                                                    onClick={() => setFilaSeleccionada(user.id_usuario)}
                                                    className="md:hidden p-5 rounded-2xl border bg-white shadow-sm flex flex-col gap-4 cursor-pointer mb-4 mx-2"
                                                    style={{ 
                                                        borderColor: esSeleccionado ? colores.azul : colorBordeHeader,
                                                        boxShadow: esSeleccionado ? '0 0 0 2px #F2F2FC' : '' 
                                                    }}
                                                >
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <Text variante="option" style={{ color: "black", fontWeight: '500', fontSize: '18px' }}>
                                                                {user.nombre_usuario}
                                                            </Text>
                                                            <span className="text-sm text-gray-400 block mt-0.5">{emailFallback}</span>
                                                        </div>
                                                        <button onClick={(e) => handleEliminar(e, user.id_usuario)}>
                                                            <HugeiconsIcon icon={CancelCircleIcon} size={24} color={colores.azul} />
                                                        </button>
                                                    </div>
                                                    
                                                    <div className="flex border-t pt-4" style={{ borderColor: colorBordeHeader }}>
                                                        {user.is_user_admin === 1 ? (
                                                            <span className="px-2 py-0.5 rounded-md text-[12px] font-semibold bg-yellow-50 text-yellow-700 border border-yellow-100">
                                                                Administrador
                                                            </span>
                                                        ) : (
                                                            <span className="px-2 py-0.5 rounded-md text-[12px] font-semibold bg-blue-50 text-blue-700 border border-blue-100">
                                                                Granjero
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>
                    </>
                )}

            </div>
        </Base>
    );
};

export default UsuariosView;