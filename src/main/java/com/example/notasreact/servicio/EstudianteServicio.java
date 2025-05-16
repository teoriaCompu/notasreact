package com.example.notasreact.servicio;

import com.example.notasreact.modelo.Estudiante;
import com.example.notasreact.repositorio.EstudianteRepositorio;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
@RequiredArgsConstructor
public class EstudianteServicio {

    private final EstudianteRepositorio estudianteRepository;

    public Flux<Estudiante> listarTodos() {
        return estudianteRepository.findAll();
    }

    public Mono<Estudiante> crear(Estudiante estudiante) {
        return estudianteRepository.save(estudiante);
    }

    public Mono<Estudiante> actualizar(Long id, Estudiante nuevoEstudiante) {
        return estudianteRepository.findById(id)
                .flatMap(e -> {
                    e.setNombre(nuevoEstudiante.getNombre());
                    e.setApellido(nuevoEstudiante.getApellido());
                    e.setCorreo(nuevoEstudiante.getCorreo());
                    return estudianteRepository.save(e);
                });
    }

    public Mono<Void> eliminar(Long id) {
        return estudianteRepository.deleteById(id);
    }


}