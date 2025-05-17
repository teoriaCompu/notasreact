package com.example.notasreact.repositorio;

import com.example.notasreact.modelo.Nota;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import reactor.core.publisher.Flux;


public interface NotaRepositorio extends ReactiveCrudRepository<Nota, Long> {

    Flux<Nota> findByEstudianteId(Long estudianteId);
    Flux<Nota> findByMateriaId(Long materiaId);
    Flux<Nota> findByMateriaIdAndEstudianteId(Long materiaId, Long estudianteId);
}
