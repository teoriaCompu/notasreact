import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function EstudiantesPage() {
    const { materiaId } = useParams();
    const [estudiantes, setEstudiantes] = useState([]);
    const [form, setForm] = useState({ id: null, nombre: '', apellido: '', correo: '' });
    const [editando, setEditando] = useState(false);
    const navigate = useNavigate();

    const cargarEstudiantes = async () => {
        try {
            const res = await fetch(`http://localhost:8080/materias/${materiaId}/estudiantes`);
            if (!res.ok) throw new Error(`Error: ${res.status}`);
            const data = await res.json();
            setEstudiantes(data);
        } catch (error) {
            console.error("Error fetching estudiantes:", error);
        }
    };

    useEffect(() => {
        cargarEstudiantes();
    }, [materiaId]);

    const manejarSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = editando
                ? `http://localhost:8080/estudiantes/actualizar/${form.id}`
                : `http://localhost:8080/estudiantes/materias/${materiaId}/estudiantes`;
            const method = editando ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(form)
            });

            const result = await response.text();
            if (!response.ok) throw new Error(result || 'Error al guardar estudiante');

            //alert(result);
            setForm({ id: null, nombre: '', apellido: '', correo: '' });
            setEditando(false);
            await cargarEstudiantes();
        } catch (error) {
            console.error("Error:", error);
            alert(error.message);
        }
    };

    const manejarEditar = (est) => {
        setForm(est);
        setEditando(true);
    };

    const manejarCancelar = () => {
        setForm({ id: null, nombre: '', apellido: '', correo: '' });
        setEditando(false);
    };

    const manejarEliminar = async (id) => {
        const confirmar = window.confirm("¿Seguro que deseas eliminar este estudiante de la materia?");
        if (!confirmar) return;

        try {
            const response = await fetch(`http://localhost:8080/estudiantes/eliminar/${id}`, {
                method: 'DELETE'
            });

            const result = await response.text();
            if (!response.ok) throw new Error(result || 'Error al eliminar estudiante');

            //alert(result);
            await cargarEstudiantes();
        } catch (error) {
            console.error("Error eliminando estudiante:", error);
            alert(error.message);
        }
    };

    return (
        <div style={{ padding: 20 }}>
            <h2>Materia: {materiaId} - {editando ? 'Editar' : 'Crear'} Estudiante</h2>
            <form onSubmit={manejarSubmit}>
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
                <button type="submit">{editando ? 'Actualizar' : 'Agregar'} Estudiante</button>
                {editando && (
                    <button type="button" onClick={manejarCancelar} style={{ marginLeft: '10px' }}>
                        Cancelar
                    </button>
                )}
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
                            <button onClick={() => manejarEditar(e)} style={{ marginLeft: '5px' }}>Editar</button>
                            <button onClick={() => manejarEliminar(e.id)} style={{ marginLeft: '5px' }}>Eliminar</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default EstudiantesPage;
