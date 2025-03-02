import { useState, useEffect } from "react";
import axios from "axios";
import '../App.css';

const UsuarioList = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [editingUser, setEditingUser] = useState(null);
    const [newUserData, setNewUserData] = useState({ nombre: "", email: "", rol: "" });

    const limit = 5;

    useEffect(() => {
        fetchUsuarios();
    }, [page, search]);

    const fetchUsuarios = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/usuarios-paginados", {
                params: { page, limit, search },
            });
            setUsuarios(response.data.usuarios);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error("Error al obtener usuarios", error);
        }
    };

    const handleSearch = (e) => {
        setSearch(e.target.value);
        setPage(1);
    };

    const handleDelete = async (id) => {
        if (window.confirm("¿Seguro que deseas eliminar este usuario?")) {
            try {
                await axios.delete(`http://localhost:5000/api/usuarios/${id}`);
                fetchUsuarios();
            } catch (error) {
                console.error("Error al eliminar usuario", error);
            }
        }
    };

    const handleEdit = (usuario) => {
        setEditingUser(usuario.id_usuario);
        setNewUserData({ nombre: usuario.nombre, email: usuario.email, rol: usuario.rol });
    };

    const handleUpdate = async () => {
        try {
            await axios.put(`http://localhost:5000/api/usuarios/${editingUser}`, newUserData);
            setEditingUser(null);
            fetchUsuarios();
        } catch (error) {
            console.error("Error al actualizar usuario", error);
        }
    };


    return (
        <div className="admin-panel">
            <h2>Lista de Usuarios</h2>
            <input
                type="text"
                placeholder="Buscar usuario..."
                value={search}
                onChange={handleSearch}
                className="input-field"
            />
            <table className="user-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Email</th>
                        <th>Rol</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {usuarios.map((usuario) => (
                        <tr key={usuario.id_usuario}>
                            <td>{usuario.id_usuario}</td>
                            <td>
                                {editingUser === usuario.id_usuario ? (
                                    <input
                                        type="text"
                                        value={newUserData.nombre}
                                        onChange={(e) =>
                                            setNewUserData({ ...newUserData, nombre: e.target.value })
                                        }
                                        className="input-field"
                                    />
                                ) : (
                                    usuario.nombre
                                )}
                            </td>
                            <td>
                                {editingUser === usuario.id_usuario ? (
                                    <input
                                        type="email"
                                        value={newUserData.email}
                                        onChange={(e) =>
                                            setNewUserData({ ...newUserData, email: e.target.value })
                                        }
                                        className="input-field"
                                    />
                                ) : (
                                    usuario.email
                                )}
                            </td>
                            <td>
                                {editingUser === usuario.id_usuario ? (
                                    <select
                                        value={newUserData.rol}
                                        onChange={(e) =>
                                            setNewUserData({ ...newUserData, rol: e.target.value })
                                        }
                                        className="input-field"
                                    >
                                        <option value="admin">Admin</option>
                                        <option value="usuario">Usuario</option>
                                    </select>
                                ) : (
                                    usuario.rol
                                )}
                            </td>
                            <td>
                                {editingUser === usuario.id_usuario ? (
                                    <button onClick={handleUpdate} className="button">Guardar</button>
                                ) : (
                                    <>
                                        <button onClick={() => handleEdit(usuario)} className="button">Editar</button>
                                        <button onClick={() => handleDelete(usuario.id_usuario)} className="button2">Eliminar</button>
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="pagination">
                <button disabled={page === 1} onClick={() => setPage(page - 1)} className="button">Anterior</button>
                <span>Página {page} de {totalPages}</span>
                <button disabled={page === totalPages} onClick={() => setPage(page + 1)} className="button">Siguiente</button>
            </div>
        </div>
    );
};

export default UsuarioList;
