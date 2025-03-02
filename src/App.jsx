import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from "react-router-dom";
import EditarUsuario from "./components/EditarUsuario";
import UsuarioList from "./components/UsuarioList";
import Login from "./components/Login";
import Registro from "./components/Registro";
import CargarUsuariosExcel from "./components/CargarUsuariosExcel";
import UsuarioPdf from "./components/UsuarioPdf";
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
      formData.append("nombre", updatedUser.nombre);
      formData.append("email", updatedUser.email);
      formData.append("password", updatedUser.password);
      formData.append("rol", updatedUser.rol);
      if (updatedUser.foto) {
        formData.append("foto", updatedUser.foto);
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
    const confirmarEliminacion = window.confirm("¿Estás seguro de que deseas eliminar este usuario?");

    if (!confirmarEliminacion) {
      return;
    }

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
    <Router>
      <div className="App">
        {isLoggedIn ? (
          <>
            <header>
              <nav>
                <ul>
                  <li>
                    <Link to="/">Inicio</Link>
                  </li>
                  <li>
                    <Link to="/usuarios">Administrar Usuarios</Link>
                  </li>
                  <li>
                    <Link to="/cargar-usuarios-excel">Cargar Usuarios desde Excel</Link>
                  </li>
                  <li>
                  <Link to="/usuariopdf">PDF Usuarios</Link>
                  </li>
                </ul>
              </nav>
            </header>

            <Routes>
              <Route
                path="/"
                element={
                  <div className="admin-panel">
                    <h2>Bienvenido a EcoTech</h2>
                    {usuario ? (
                      <div className="user-card">
                        <h3>Información del Usuario</h3>
                        <p>
                          <strong>ID:</strong> {usuario.id_usuario}
                        </p>
                        <p>
                          <strong>Nombre:</strong> {usuario.nombre}
                        </p>
                        <p>
                          <strong>Email:</strong> {usuario.email}
                        </p>
                        <p>
                          <strong>Rol:</strong> {usuario.rol}
                        </p>
                        {usuario.foto && (
                          <img
                            src={`http://localhost:5000${usuario.foto}`}
                            alt="Foto de perfil"
                            className="user-photo"
                            onError={(e) => {
                              e.target.src =
                                "https://stonegatesl.com/wp-content/uploads/2021/01/avatar-300x300.jpg"; 
                            }}
                          />
                        )}

                        <div className="user-actions">
                          {editing ? (
                            <EditarUsuario usuario={usuario} onSave={handleEditSave} onCancel={() => setEditing(false)} />
                          ) : (
                            <button className="button2" onClick={() => setEditing(true)}>
                              Editar Información
                            </button>
                          )}
                          <button className="button2 logout" onClick={handleDelete}>
                            Eliminar Usuario
                          </button>
                          <button className="button2 logout" onClick={() => setIsLoggedIn(false)}>
                            Cerrar sesión
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p>Cargando datos...</p>
                    )}
                  </div>
                }
              />
              <Route path="/usuarios" element={<UsuarioList />} />
              <Route path="/cargar-usuarios-excel" element={<CargarUsuariosExcel />} />
              <Route path="/usuariopdf" element={<UsuarioPdf />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </>
        ) : (
          <>
            {showLogin ? <Login handleLoginSuccess={handleLoginSuccess} /> : <Registro />}
            <button onClick={() => setShowLogin(!showLogin)} className="button2">
              {showLogin ? "¿No tienes cuenta? Regístrate" : "¿Ya tienes cuenta? Inicia sesión"}
            </button>
          </>
        )}
      </div>
    </Router>
  );
};

export default App;