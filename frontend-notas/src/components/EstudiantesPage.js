import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function EstudiantesPage() {
    const { materiaId } = useParams();
    const [estudiantes, setEstudiantes] = useState([]);
    const [form, setForm] = useState({ nombre: '', apellido: '', correo: '' });
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`http://localhost:8080/materias/${materiaId}/estudiantes`)
            .then(res => {
                if (!res.ok) throw new Error(`Error: ${res.status}`);
                return res.json();
            })
            .then(data => setEstudiantes(data))
            .catch(error => {
                console.error("Error fetching estudiantes:", error);
                // Opcional: mostrar mensaje al usuario
            });
    }, [materiaId]);

    const agregarEstudiante = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:8080/estudiantes/materias/${materiaId}/estudiantes`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(form)
            });

            const result = await response.text(); // Cambiado a text() para manejar diferentes respuestas

            if (!response.ok) {
                throw new Error(result || 'Error al agregar estudiante');
            }

            alert(result); // Muestra mensaje de éxito
            setForm({ nombre: '', apellido: '', correo: '' });

            // Actualizar lista
            const res = await fetch(`http://localhost:8080/materias/${materiaId}/estudiantes`);
            setEstudiantes(await res.json());

        } catch (error) {
            console.error("Error:", error);
            alert(error.message);
        }
    };

    return (
        <div style={{ padding: 20 }}>
            <h2>Materia: {materiaId} - Crear Estudiante</h2>
            <form onSubmit={agregarEstudiante}>
                <input
                    type="text"
                    placeholder="Nombre"
                    value={form.nombre}
                    onChange={e => setForm({ ...form, nombre: e.target.value })}
                    required
                />
                <input
                    type="text"
                    placeholder="Apellido"
                    value={form.apellido}
                    onChange={e => setForm({ ...form, apellido: e.target.value })}
                    required
                />
                <input
                    type="email"
                    placeholder="Correo"
                    value={form.correo}
                    onChange={e => setForm({ ...form, correo: e.target.value })}
                    required
                />
                <button type="submit">Agregar Estudiante</button>
            </form>

            <h3>Lista de Estudiantes</h3>
            <table border="1" width="100%">
                <thead>
                <tr>
                    <th>Nombre</th><th>Apellido</th><th>Correo</th><th>Acciones</th>
                </tr>
                </thead>
                <tbody>
                {estudiantes.map(e => (
                    <tr key={e.id}>
                        <td>{e.nombre}</td>
                        <td>{e.apellido}</td>
                        <td>{e.correo}</td>
                        <td>
                            <button onClick={() => navigate(`/materias/${materiaId}/estudiantes/${e.id}/notas`)}>Calificar</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default EstudiantesPage;

