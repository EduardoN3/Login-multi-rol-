import React, { useState, useEffect } from 'react';

const EditarUsuario = ({ usuario, onSave, onCancel }) => {
const [editUser, setEditUser] = useState({
    nombre: usuario.nombre || '',
    email: usuario.email || '',
    password: '',
    rol: usuario.rol || '',
    foto: null,
});

useEffect(() => {
    setEditUser({
    nombre: usuario.nombre || '',
    email: usuario.email || '',
    password: '',
    rol: usuario.rol || '',
    foto: null,
    });
}, [usuario]);

const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditUser((prevState) => ({
    ...prevState,
    [name]: value,
    }));
};

const handleFileChange = (e) => {
    setEditUser((prevState) => ({
    ...prevState,
    foto: e.target.files[0],
    }));
};

const handleEditSubmit = (e) => {
    e.preventDefault();
    onSave(editUser);
};

return (
    <div className="EditarUsuario-container">
    <h3>Editar Información del Usuario</h3>
    <form onSubmit={handleEditSubmit} className="EditarUsuario-form" encType="multipart/form-data">
        <div className="form-group">
        <label htmlFor="nombre">Nombre</label>
        <input
            type="text"
            id="nombre"
            name="nombre"
            value={editUser.nombre}
            onChange={handleEditChange}
            required
        />
        </div>

        <div className="form-group">
        <label htmlFor="email">Email</label>
        <input
            type="email"
            id="email"
            name="email"
            value={editUser.email}
            onChange={handleEditChange}
            required
        />
        </div>

        <div className="form-group">
        <label htmlFor="password">Contraseña</label>
        <input
            type="password"
            id="password"
            name="password"
            value={editUser.password}
            onChange={handleEditChange}
            required
        />
        </div>

        <div className="form-group">
        <label htmlFor="rol">Rol</label>
        <input
            type="text"
            id="rol"
            name="rol"
            value={editUser.rol}
            onChange={handleEditChange}
            required
        />
        </div>

        <div className="form-group">
        <label htmlFor="foto">Foto de perfil</label>
        <input
            type="file"
            id="foto"
            name="foto"
            onChange={handleFileChange}
        />
        </div>

        <div className="form-actions">
        <button type="submit" className="button">
            Guardar cambios
        </button>
        <button type="button" className="button2" onClick={onCancel}>
            Cancelar
        </button>
        </div>
    </form>
    </div>
);
};

export default EditarUsuario;