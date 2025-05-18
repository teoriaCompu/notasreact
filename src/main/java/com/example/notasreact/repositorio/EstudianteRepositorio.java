package com.example.notasreact.repositorio;

import com.example.notasreact.modelo.Estudiante;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import reactor.core.publisher.Flux;

public interface EstudianteRepositorio extends ReactiveCrudRepository<Estudiante, Long> {
  Mono<Estudiante> findByCorreo(String correo);

}
