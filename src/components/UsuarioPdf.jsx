import React, { useEffect, useState } from "react";
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

// Estilos para el PDF
const styles = StyleSheet.create({
    page: {
        flexDirection: "column",
        backgroundColor: "#FFFFFF",
        padding: 40,
        fontFamily: "Helvetica",
    },
    header: {
        fontSize: 24,
        marginBottom: 20,
        textAlign: "center",
        color: "#2C3E50",
        fontWeight: "bold",
    },
    table: {
        display: "table",
        width: "100%",
        borderStyle: "solid",
        borderWidth: 1,
        borderColor: "#DDDDDD",
        borderCollapse: "collapse",
        marginTop: 20,
    },
    tableRow: {
        flexDirection: "row",
        borderBottomWidth: 1,
        borderBottomColor: "#DDDDDD",
        borderBottomStyle: "solid",
    },
    tableColHeader: {
        width: "25%",
        backgroundColor: "#2C3E50",
        color: "#FFFFFF",
        fontSize: 12,
        fontWeight: "bold",
        padding: 8,
        textAlign: "center",
        borderRightWidth: 1,
        borderRightColor: "#FFFFFF",
        borderRightStyle: "solid",
    },
    tableCol: {
        width: "25%",
        fontSize: 10,
        padding: 8,
        textAlign: "center",
        borderRightWidth: 1,
        borderRightColor: "#DDDDDD",
        borderRightStyle: "solid",
    },
    footer: {
        position: "absolute",
        bottom: 30,
        left: 0,
        right: 0,
        textAlign: "center",
        fontSize: 10,
        color: "#666666",
    },
});

// Componente para el PDF
const MyDocument = ({ usuarios }) => (
    <Document>
        <Page size="A4" style={styles.page}>
            <View>
                <Text style={styles.header}>Lista de Usuarios</Text>
                <View style={styles.table}>
                    {/* Encabezado de la tabla */}
                    <View style={styles.tableRow}>
                        <View style={styles.tableColHeader}>
                            <Text>ID</Text>
                        </View>
                        <View style={styles.tableColHeader}>
                            <Text>Nombre</Text>
                        </View>
                        <View style={styles.tableColHeader}>
                            <Text>Email</Text>
                        </View>
                        <View style={styles.tableColHeader}>
                            <Text>Rol</Text>
                        </View>
                    </View>
                    {usuarios.map((usuario) => (
                        <View style={styles.tableRow} key={usuario.id_usuario}>
                            <View style={styles.tableCol}>
                                <Text>{usuario.id_usuario}</Text>
                            </View>
                            <View style={styles.tableCol}>
                                <Text>{usuario.nombre}</Text>
                            </View>
                            <View style={styles.tableCol}>
                                <Text>{usuario.email}</Text>
                            </View>
                            <View style={styles.tableCol}>
                                <Text>{usuario.rol}</Text>
                            </View>
                        </View>
                    ))}
                </View>
            </View>
            {/* Pie de página */}
            <Text style={styles.footer}>
                Generado el {new Date().toLocaleDateString()} por EcoTech
            </Text>
        </Page>
    </Document>
);

const UsuarioPdf = () => {
    const [usuarios, setUsuarios] = useState([]);

    // Función para obtener los usuarios desde la API
    const fetchUsuarios = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/usuarios");
            if (!response.ok) {
                throw new Error("Error al obtener los usuarios");
            }
            const data = await response.json();
            setUsuarios(data);
        } catch (error) {
            console.error("Error al obtener los usuarios:", error);
        }
    };

    // Llama a la función para obtener los usuarios 
    useEffect(() => {
        fetchUsuarios();
    }, []);

    return (
        <div className="pdf-export-container">
            <h1>Exportar Usuarios a PDF</h1>
            <div className="download-link">
                {usuarios.length > 0 ? (
                    <PDFDownloadLink
                        document={<MyDocument usuarios={usuarios} />}
                        fileName="usuarios.pdf"
                        className="button"
                    >
                        {({ blob, url, loading, error }) =>
                            loading ? "Generando PDF..." : "Descargar PDF"
                        }
                    </PDFDownloadLink>
                ) : (
                    <p>Cargando usuarios...</p>
                )}
            </div>
        </div>
    );
};

export default UsuarioPdf;