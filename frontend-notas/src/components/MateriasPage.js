import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function MateriasPage() {
    const [materias, setMaterias] = useState([]);
    const [form, setForm] = useState({ id: null, nombre: '', creditos: 1 });
    const [error, setError] = useState('');
    const [editando, setEditando] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        cargarMaterias();
    }, []);

    const cargarMaterias = () => {
        fetch('http://localhost:8080/materias')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setMaterias(data);
                } else {
                    setError('Error: la respuesta no es un arreglo');
                    setMaterias([]);
                }
            })
            .catch(error => {
                console.error('Error al cargar materias:', error);
                setError('No se pudo cargar la lista de materias');
            });
    };

    const manejarSubmit = (e) => {
        e.preventDefault();
        setError("");

        const url = editando
            ? `http://localhost:8080/materias/actualizar/${form.id}`
            : 'http://localhost:8080/materias';

        const method = editando ? 'PUT' : 'POST';

        fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form),
        })
            .then(async res => {
                if (!res.ok) {
                    const mensaje = await res.text();
                    throw new Error(mensaje);
                }
                setForm({ id: null, nombre: '', creditos: 1 });
                setEditando(false);
                cargarMaterias();
            })
            .catch(error => {
                console.error('Error al guardar materia:', error);
                setError(error.message || 'No se pudo guardar la materia');
            });
    };

    const editarMateria = (materia) => {
        setForm({
            id: materia.id,
            nombre: materia.nombre,
            creditos: materia.creditos
        });
        setEditando(true);
    };

    const cancelarEdicion = () => {
        setForm({ id: null, nombre: '', creditos: 1 });
        setEditando(false);
    };

    const eliminarMateria = (id) => {
        if (!window.confirm("¿Estás segura/o de que quieres eliminar esta materia?")) return;

        fetch(`http://localhost:8080/materias/eliminar/${id}`, {
            method: 'DELETE',
        })
            .then(() => {
                cargarMaterias();
            })
            .catch(error => {
                console.error('Error al eliminar materia:', error);
                setError('No se pudo eliminar la materia');
            });
    };

    return (
        <div style={{ padding: 20 }}>
            <h2>{editando ? 'Editar' : 'Crear'} Materia</h2>
            <form onSubmit={manejarSubmit}>
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
                <button type="submit">
                    {editando ? 'Actualizar' : 'Agregar'} Materia
                </button>
                {editando && (
                    <button
                        type="button"
                        onClick={cancelarEdicion}
                        style={{ marginLeft: '10px' }}
                    >
                        Cancelar
                    </button>
                )}
            </form>

            {error && <p style={{ color: 'red' }}>{error}</p>}

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
                {Array.isArray(materias) && materias.length > 0 ? (
                    materias.map(m => (
                        <tr key={m.id}>
                            <td>{m.nombre}</td>
                            <td>{m.creditos}</td>
                            <td>
                                <button onClick={() => navigate(`/materias/${m.id}/estudiantes`)}>
                                    Ver Estudiantes
                                </button>
                                <button
                                    onClick={() => editarMateria(m)}
                                    style={{ marginLeft: '10px' }}
                                >
                                    Editar
                                </button>
                                <button
                                    onClick={() => eliminarMateria(m.id)}
                                    style={{ marginLeft: '10px', color: 'red' }}
                                >
                                    Eliminar
                                </button>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="3">No hay materias registradas.</td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>
    );
}

export default MateriasPage;