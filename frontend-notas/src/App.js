import React, { useEffect, useState } from 'react';

function App() {
    const [estudiantes, setEstudiantes] = useState([]);
    const [form, setForm] = useState({ nombre: '', apellido: '', correo: '' });
    const [editandoId, setEditandoId] = useState(null);

    useEffect(() => {
        obtenerEstudiantes();
    }, []);

    const obtenerEstudiantes = () => {
        fetch('http://localhost:8080/estudiantes')
            .then(res => res.json())
            .then(data => setEstudiantes(data));
    };

    const manejarSubmit = (e) => {
        e.preventDefault();

        if (editandoId !== null) {
            // Actualizar
            fetch(`http://localhost:8080/estudiantes/actualizar/${editandoId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form)
            }).then(() => {
                setEditandoId(null);
                setForm({ nombre: '', apellido: '', correo: '' });
                obtenerEstudiantes();
            });
        } else {
            // Crear
            fetch('http://localhost:8080/estudiantes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form)
            }).then(() => {
                setForm({ nombre: '', apellido: '', correo: '' });
                obtenerEstudiantes();
            });
        }
    };

    const eliminarEstudiante = (id) => {
        fetch(`http://localhost:8080/estudiantes/eliminar/${id}`, {
            method: 'DELETE'
        }).then(() => obtenerEstudiantes());
    };

    const cargarEstudiante = (est) => {
        setEditandoId(est.id);
        setForm({
            nombre: est.nombre,
            apellido: est.apellido,
            correo: est.correo
        });
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>Gestión de Estudiantes</h2>

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
                <button type="submit">{editandoId !== null ? 'Actualizar' : 'Crear'}</button>
            </form>

            <table border="1" style={{ marginTop: '20px', width: '100%' }}>
                <thead>
                <tr>
                    <th>Nombre</th>
                    <th>Apellido</th>
                    <th>Correo</th>
                    <th>Acciones</th>
                </tr>
                </thead>
                <tbody>
                {estudiantes.map(est => (
                    <tr key={est.id}>
                        <td>{est.nombre}</td>
                        <td>{est.apellido}</td>
                        <td>{est.correo}</td>
                        <td>
                            <button onClick={() => cargarEstudiante(est)}>Editar</button>
                            <button onClick={() => eliminarEstudiante(est.id)}>Eliminar</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default App;


