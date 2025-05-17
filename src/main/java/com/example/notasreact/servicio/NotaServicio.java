package com.example.notasreact.servicio;

import com.example.notasreact.modelo.Estudiante;
import com.example.notasreact.modelo.Nota;
import com.example.notasreact.repositorio.EstudianteRepositorio;
import com.example.notasreact.repositorio.NotaRepositorio;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
@RequiredArgsConstructor
public class NotaServicio {
    private final NotaRepositorio notaRepo;
    private final EstudianteRepositorio estudianteRepo;

    // Listar todas las notas de un estudiante en una materia
    public Flux<Nota> listarNotasPorMateriaYEstudiante(Long materiaId, Long estudianteId) {
        return notaRepo.findByMateriaIdAndEstudianteId(materiaId, estudianteId);
    }

    // Crear o actualizar nota
    public Mono<Nota> guardarNota(Nota nota) {
        return notaRepo.save(nota);
    }

    // Eliminar nota por id
    public Mono<Void> eliminarNota(Long id) {
        return notaRepo.deleteById(id);
    }

    // calcular promedio reactivo de notas por materia y estudiante
    public Mono<Double> calcularPromedioFinal(Long materiaId, Long estudianteId) {
        return listarNotasPorMateriaYEstudiante(materiaId, estudianteId)
                .map(n -> n.getValor() * (n.getPorcentaje() / 100.0))
                .reduce(Double::sum)
                .defaultIfEmpty(0.0);
    }

    public Flux<Estudiante> listarEstudiantesPorMateria(Long materiaId) {
        return notaRepo.findByMateriaId(materiaId)
                .flatMap(nota -> estudianteRepo.findById(nota.getEstudianteId()))
                .distinct();
    }
}