import React, { useState, useEffect } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Titulo, Text } from '../../shared/components/ui';
import { colores } from '../../shared/components/ui/basics/Colores';
import { Base } from '../../shared/components/layout';
import Button from '../../shared/components/ui/buttons/Botones';

const MOCK_USUARIOS = [
    { id_usuario: 1, nombre_usuario: 'Emilia C.', email: 'emilia@devora.com', is_user_admin: 1, activo: true },
    { id_usuario: 2, nombre_usuario: 'Juan M.', email: 'juan.cultivos@devora.com', is_user_admin: 0, activo: true },
    { id_usuario: 3, nombre_usuario: 'Sofía R.', email: 'sofia.lab@devora.com', is_user_admin: 0, activo: false },
];

const UsuariosView = () => {
    const [usuarios, setUsuarios] = useState(MOCK_USUARIOS);
    const [busqueda, setBusqueda] = useState('');

    const usuariosFiltrados = usuarios.filter(u => 
        u.nombre_usuario.toLowerCase().includes(busqueda.toLowerCase()) ||
        u.email.toLowerCase().includes(busqueda.toLowerCase())
    );

    const handleEliminar = (id) => {
        if(confirm("¿Seguro que deseas eliminar este usuario del sistema?")) {
            setUsuarios(prev => prev.filter(u => u.id_usuario !== id));
        }
    };

    return (
        <Base margen_arriba="mt-24 md:mt-20">
            <div className="flex flex-col gap-6">
                  <div>
                        <Titulo>Usuarios</Titulo>
                    </div>
                    
                    <Button
                        variant="cancelar" isOutline = {true}
                        onClick={() => alert("Modal / Vista para registrar nuevo usuario")} >
                        Registrar Usuario
                    </Button>

                <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50/70 border-b border-gray-100">
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Usuario</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Correo Electrónico</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Rol asignado</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Estado</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 text-center">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {usuariosFiltrados.map((user) => (
                                    <tr key={user.id_usuario} className="hover:bg-gray-50/40 transition-colors">
                                        
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                <span className="text-sm font-semibold text-gray-800">{user.nombre_usuario}</span>
                                            </div>
                                        </td>

                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            {user.email}
                                        </td>

                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {user.is_user_admin === 1 ? (
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-purple-50 text-purple-700 border border-purple-100">
                                       
                                                    Administrador
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                                                    Operador
                                                </span>
                                            )}
                                        </td>

                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                user.activo 
                                                    ? 'bg-green-50 text-green-700 border border-green-100' 
                                                    : 'bg-gray-100 text-gray-600'
                                            }`}>
                                                {user.activo ? 'Activo' : 'Inactivo'}
                                            </span>
                                        </td>

                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <button 
                                                    onClick={() => alert(`Editar usuario ${user.id_usuario}`)}
                                                    className="p-1.5 text-gray-400 hover:text-indigo-600 rounded-lg hover:bg-gray-100 transition-all"
                                                    title="Editar datos"
                                                >
                                                </button>
                                                <button 
                                                    onClick={() => handleEliminar(user.id_usuario)}
                                                    className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-all"
                                                    title="Eliminar del sistema"
                                                >
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}

                                {usuariosFiltrados.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-10 text-center text-sm text-gray-400">
                                            No se encontraron usuarios que coincidan con la búsqueda.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </Base>
    );
};

export default UsuariosView;