package com.example.notasreact.repositorio;

import com.example.notasreact.modelo.Nota;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import reactor.core.publisher.Flux;


public interface NotaRepositorio extends R2dbcRepository<Nota, Long> {

    Flux<Nota> findByEstudianteId(Long estudianteId);
    Flux<Nota> findByMateriaId(Long materiaId);
}
