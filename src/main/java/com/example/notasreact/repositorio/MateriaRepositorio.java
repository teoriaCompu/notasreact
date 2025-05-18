package com.example.notasreact.repositorio;

import com.example.notasreact.modelo.Materia;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import reactor.core.publisher.Mono;

public interface MateriaRepositorio extends ReactiveCrudRepository<Materia, Long> {
  Mono<Materia> findByNombre(String nombre);
}
