package com.example.notasreact.repositorio;

import com.example.notasreact.modelo.Estudiante;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import reactor.core.publisher.Mono;

public interface EstudianteRepositorio extends ReactiveCrudRepository<Estudiante, Long> {


}
