import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function NotasPage() {
    const { materiaId, estudianteId } = useParams();
    const [notas, setNotas] = useState([]);
    const [materia, setMateria] = useState(null);
    const [estudiante, setEstudiante] = useState(null);
    const [form, setForm] = useState({ id: null, valor: 0, porcentaje: 0, observacion: '' });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState({
        notas: false,
        datos: false,
        operacion: false
    });

    const fetchDatos = async () => {
        setLoading(prev => ({ ...prev, datos: true }));
        try {
            const resMateria = await fetch(`http://localhost:8080/materias/${materiaId}`);
            if (!resMateria.ok) throw new Error('Error al obtener datos de la materia');
            const dataMateria = await resMateria.json();
            setMateria(dataMateria);

            const resEstudiante = await fetch(`http://localhost:8080/estudiantes/${estudianteId}`);
            if (!resEstudiante.ok) throw new Error('Error al obtener datos del estudiante');
            const dataEstudiante = await resEstudiante.json();
            setEstudiante(dataEstudiante);
        } catch (err) {
            console.error("Error al obtener datos:", err);
            setError(err.message);
        } finally {
            setLoading(prev => ({ ...prev, datos: false }));
        }
    };

    const fetchNotas = async () => {
        setLoading(prev => ({ ...prev, notas: true }));
        try {
            const response = await fetch(`http://localhost:8080/notas?materiaId=${materiaId}&estudianteId=${estudianteId}`);
            if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);
            const data = await response.json();
            setNotas(data);
            setError(null);
        } catch (err) {
            console.error("Error al obtener notas:", err);
            setError("No se pudieron cargar las notas. Intente nuevamente.");
        } finally {
            setLoading(prev => ({ ...prev, notas: false }));
        }
    };

    useEffect(() => {
        fetchDatos();
        fetchNotas();
    }, [materiaId, estudianteId]);

    const calcularPorcentajeTotal = (notasActuales, notaEditada = null) => {
        return notasActuales.reduce((total, nota) => {

            if (notaEditada && nota.id === notaEditada.id) return total;
            return total + nota.porcentaje;
        }, 0);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(prev => ({ ...prev, operacion: true }));

        if (form.valor < 0 || form.valor > 5) {
            setError("La nota debe estar entre 0 y 5");
            setLoading(prev => ({ ...prev, operacion: false }));
            return;
        }

        if (form.porcentaje < 0 || form.porcentaje > 101) {
            setError("El porcentaje debe estar entre 0 y 100");
            setLoading(prev => ({ ...prev, operacion: false }));
            return;
        }

        const porcentajeActual = calcularPorcentajeTotal(notas, form.id ? { id: form.id } : null);
        const porcentajeTotal = porcentajeActual + form.porcentaje;

        if (porcentajeTotal > 100) {
            setError(`El porcentaje total no puede superar el 100% (actual: ${porcentajeActual}%)`);
            setLoading(prev => ({ ...prev, operacion: false }));
            return;
        }


        const url = `http://localhost:8080/notas?materiaId=${materiaId}&estudianteId=${estudianteId}`;

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    ...form,
                    materiaId: Number(materiaId),
                    estudianteId: Number(estudianteId)
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Error al guardar nota');
            }

            setForm({ id: null, valor: 0, porcentaje: 0, observacion: '' });
            await fetchNotas();
        } catch (err) {
            console.error("Error al guardar nota:", err);
            setError(err.message);
        } finally {
            setLoading(prev => ({ ...prev, operacion: false }));
        }
    };


    const handleDelete = async (id) => {
        setLoading(prev => ({ ...prev, operacion: true }));
        try {
            const response = await fetch(`http://localhost:8080/notas/${id}?materiaId=${materiaId}&estudianteId=${estudianteId}`, {
                method: 'DELETE'
            });

            if (!response.ok) throw new Error('Error al eliminar nota');

            await fetchNotas();
        } catch (err) {
            console.error("Error al eliminar nota:", err);
            setError(err.message);
        } finally {
            setLoading(prev => ({ ...prev, operacion: false }));
        }
    };

    const promedioFinal = Math.min(
        notas.reduce((acc, n) => acc + (n.valor * (n.porcentaje / 100)), 0),
        5
    ).toFixed(2);

    // Calcula el porcentaje total acumulado
    const porcentajeTotal = notas.reduce((acc, n) => acc + n.porcentaje, 0);

    const isLoading = loading.notas || loading.datos || loading.operacion;

    return (
        <div style={{ padding: 20 }}>
            <h2>Materia: {materia?.nombre || materiaId} - Alumno: {estudiante?.nombre || estudianteId}</h2>

            {error && <div style={{ color: 'red', margin: '10px 0' }}>{error}</div>}

            <form onSubmit={handleSubmit}>
                <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    placeholder="Valor nota (0-5)"
                    value={form.valor}
                    onChange={e => setForm({ ...form, valor: parseFloat(e.target.value) || 0 })}
                    required
                    disabled={isLoading}
                />
                <input
                    type="number"
                    min="0"
                    max="100"
                    placeholder="Porcentaje (0-100)"
                    value={form.porcentaje}
                    onChange={e => setForm({ ...form, porcentaje: parseFloat(e.target.value) || 0 })}
                    required
                    disabled={isLoading}
                />
                <input
                    type="text"
                    placeholder="Observación"
                    value={form.observacion}
                    onChange={e => setForm({ ...form, observacion: e.target.value })}
                    disabled={isLoading}
                />
                <button type="submit" disabled={isLoading}>
                    {loading.operacion ? 'Procesando...' : form.id !== null ? 'Actualizar Nota' : 'Agregar Nota'}
                </button>
                {form.id !== null && (
                    <button
                        type="button"
                        onClick={() => setForm({ id: null, valor: 0, porcentaje: 0, observacion: '' })}
                        disabled={isLoading}
                        style={{ marginLeft: '10px' }}
                    >
                        Cancelar Edición
                    </button>
                )}
            </form>

            <h3>Lista de Notas</h3>
            {loading.notas ? (
                <p>Cargando notas...</p>
            ) : notas.length === 0 ? (
                <p>No hay notas registradas</p>
            ) : (
                <table border="1" width="100%">
                    <thead>
                    <tr>
                        <th>Valor</th>
                        <th>Porcentaje</th>
                        <th>Observación</th>
                        <th>Acciones</th>
                    </tr>
                    </thead>
                    <tbody>
                    {notas.map(n => (
                        <tr key={n.id}>
                            <td>{n.valor.toFixed(1)}</td>
                            <td>{n.porcentaje.toFixed(1)}%</td>
                            <td>{n.observacion || '-'}</td>
                            <td>
                                <button
                                    onClick={() => setForm({
                                        id: n.id,
                                        valor: n.valor,
                                        porcentaje: n.porcentaje,
                                        observacion: n.observacion || ''
                                    })}
                                    disabled={isLoading}
                                >
                                    Editar
                                </button>
                                <button
                                    onClick={() => handleDelete(n.id)}
                                    disabled={isLoading}
                                    style={{ marginLeft: '5px' }}
                                >
                                    Eliminar
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}

            <h3>Promedio Final: {promedioFinal}</h3>
        </div>
    );
}

export default NotasPage;



