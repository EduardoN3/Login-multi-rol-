import React, { useState } from "react";
import EditarUsuario from "./components/EditarUsuario";
import Login from "./components/Login";
import Registro from "./components/Registro";
import "./App.css";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(true);
  const [usuario, setUsuario] = useState(null);
  const [editing, setEditing] = useState(false);

  const handleLoginSuccess = (userData) => {
    setIsLoggedIn(true);
    setUsuario(userData);
  };

  const handleEditSave = async (updatedUser) => {
    try {
      const formData = new FormData();
      formData.append('nombre', updatedUser.nombre);
      formData.append('email', updatedUser.email);
      formData.append('password', updatedUser.password);
      formData.append('rol', updatedUser.rol);
      if (updatedUser.foto) {
        formData.append('foto', updatedUser.foto);
      }

      const response = await fetch(`http://localhost:5000/api/usuarios/${usuario.id_usuario}`, {
        method: "PUT",
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        setUsuario(data.user); 
        setEditing(false);
      } else {
        console.error("Error al editar:", data.message);
      }
    } catch (error) {
      console.error("Hubo un error al editar los datos:", error);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/usuarios/${usuario.id_usuario}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setIsLoggedIn(false);
        setUsuario(null);
        alert("Usuario eliminado exitosamente.");
      } else {
        const data = await response.json();
        console.error("Error al eliminar:", data.message);
      }
    } catch (error) {
      console.error("Hubo un error al eliminar el usuario:", error);
    }
  };

  return (
    <div className="App">
      {isLoggedIn ? (
        <div className="admin-panel">
          <h2>Bienvenido a EcoTech</h2>
          {usuario ? (
            <div className="user-card">
              <h3>Información del Usuario</h3>
              <p><strong>ID:</strong> {usuario.id_usuario}</p>
              <p><strong>Nombre:</strong> {usuario.nombre}</p>
              <p><strong>Email:</strong> {usuario.email}</p>
              <p><strong>Rol:</strong> {usuario.rol}</p>
              {usuario.foto && (
                <img
                  src={`http://localhost:5000${usuario.foto}`} 
                  alt="Foto de perfil"
                  className="user-photo"
                  onError={(e) => {
                    e.target.src = "https://stonegatesl.com/wp-content/uploads/2021/01/avatar-300x300.jpg"; // Imagen de respaldo si la foto no se carga
                  }}
                />
              )}

              {editing ? (
                <EditarUsuario
                  usuario={usuario}
                  onSave={handleEditSave}
                  onCancel={() => setEditing(false)}
                />
              ) : (
                <button className="button2" onClick={() => setEditing(true)}>
                  Editar Información
                </button>
              )}

              <button className="button2 logout" onClick={handleDelete}>
                Eliminar Usuario
              </button>
            </div>
          ) : (
            <p>Cargando datos...</p>
          )}
          <button className="button2 logout" onClick={() => setIsLoggedIn(false)}>
            Cerrar sesión
          </button>
        </div>
      ) : (
        <>
          {showLogin ? <Login handleLoginSuccess={handleLoginSuccess} /> : <Registro />}
          <button onClick={() => setShowLogin(!showLogin)} className="button2">
            {showLogin ? "¿No tienes cuenta? Regístrate" : "¿Ya tienes cuenta? Inicia sesión"}
          </button>
        </>
      )}
    </div>
  );
};

export default App;