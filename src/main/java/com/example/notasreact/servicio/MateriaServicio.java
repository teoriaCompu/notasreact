package com.example.notasreact.servicio;

import com.example.notasreact.modelo.Materia;
import com.example.notasreact.repositorio.MateriaRepositorio;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
@RequiredArgsConstructor
public class MateriaServicio {
    private final MateriaRepositorio materiaRepository;

    public Flux<Materia> ListarMaterias() {
        return materiaRepository.findAll();
    }

    public Mono<Materia> crear(Materia materia) {
        return materiaRepository.save(materia);
    }

    public Mono<Materia> actualizar(Long id, Materia nuevaMateria) {
        return materiaRepository.findById(id)
                .flatMap(e->{
                    e.setNombre(nuevaMateria.getNombre());
                    e.setCreditos(nuevaMateria.getCreditos());
                    return materiaRepository.save(e);
                        });
    }

    public Mono<Void> eliminar(Long id) {
        return materiaRepository.deleteById(id);
    }

}
