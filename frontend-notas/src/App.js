import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MateriasPage from './components/MateriasPage';
import EstudiantesPage from './components/EstudiantesPage';
import NotasPage from './components/NotasPage';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<MateriasPage />} />
                <Route path="/materias/:materiaId/estudiantes" element={<EstudiantesPage />} />
                <Route path="/materias/:materiaId/estudiantes/:estudianteId/notas" element={<NotasPage />} />
            </Routes>
        </Router>
    );
}

export default App;




