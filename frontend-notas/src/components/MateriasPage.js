import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function MateriasPage() {
    const [materias, setMaterias] = useState([]);
    const [form, setForm] = useState({ nombre: '', creditos: 1 });
    const navigate = useNavigate();

    useEffect(() => {
        fetch('http://localhost:8080/materias')
            .then(res => res.json())
            .then(data => setMaterias(data));
    }, []);

    const agregarMateria = (e) => {
        e.preventDefault();
        fetch('http://localhost:8080/materias', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form),
        }).then(() => {
            setForm({ nombre: '', creditos: 1 });
            // refrescar lista
            fetch('http://localhost:8080/materias')
                .then(res => res.json())
                .then(data => setMaterias(data));
        });
    };

    return (
        <div style={{ padding: 20 }}>
            <h2>Crear Materia</h2>
            <form onSubmit={agregarMateria}>
                <input
                    type="text"
                    placeholder="Nombre de la materia"
                    value={form.nombre}
                    onChange={e => setForm({ ...form, nombre: e.target.value })}
                    required
                />
                <select
                    value={form.creditos}
                    onChange={e => setForm({ ...form, creditos: Number(e.target.value) })}
                >
                    {[1, 2, 3, 4, 5].map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <button type="submit">Agregar Materia</button>
            </form>

            <h3>Lista de Materias</h3>
            <table border="1" width="100%">
                <thead>
                <tr>
                    <th>Nombre</th>
                    <th>Créditos</th>
                    <th>Acciones</th>
                </tr>
                </thead>
                <tbody>
                {materias.map(m => (
                    <tr key={m.id}>
                        <td>{m.nombre}</td>
                        <td>{m.creditos}</td>
                        <td>
                            <button onClick={() => navigate(`/materias/${m.id}/estudiantes`)}>Ver Estudiantes</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default MateriasPage;



