import axios from "axios";
const API_URL = 'http://localhost:5000';

// Función para registrar un usuario
export const registerUser = async (user) => {
  try {
    const response = await fetch("http://localhost:5000/api/registro", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user), // Enviar los datos como JSON
    });

    const data = await response.json();

    if (response.ok) {
      return { success: true, message: data.message }; // Éxito en el registro
    } else {
      return { success: false, message: data.error || data.message }; // Error en el backend
    }
  } catch (error) {
    console.error("Error al registrar:", error);
    return { success: false, message: "Hubo un problema al registrar el usuario." }; // Error en la conexión
  }
};

export const loginUser = async (user) => {
  try {
    const response = await fetch("http://localhost:5000/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });

    const data = await response.json();

    if (response.ok) {
      return { success: true, message: data.message, user: data.user };
    } else {
      return { success: false, message: data.error || data.message };
    }
  } catch (error) {
    console.error("Error al hacer login:", error);
    return { success: false, message: "Hubo un problema al iniciar sesión." };
  }
};

