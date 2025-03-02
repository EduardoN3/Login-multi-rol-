import React, { useState } from 'react';
import axios from 'axios';
import '../App.css'; 

const CargarUsuariosExcel = () => {
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!file) {
            setMessage('Por favor, selecciona un archivo Excel');
            return;
        }

        const formData = new FormData();
        formData.append('archivo', file);

        try {
            const response = await axios.post('http://localhost:5000/api/usuarios/cargar-excel', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            setMessage(response.data.message);
        } catch (error) {
            console.error('Error al cargar el archivo:', error);
            setMessage('Error al cargar el archivo');
        }
    };

    return (
        <div className="admin-panel">
            <h2>Cargar Usuarios desde Excel</h2>
            <form onSubmit={handleSubmit} className="form">
                <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} className="input-field" />
                <button type="submit" className="button">Cargar</button>
            </form>
            {message && <p className={message.includes('Error') ? 'error-message' : 'success-message'}>{message}</p>}
        </div>
    );
};

export default CargarUsuariosExcel;
