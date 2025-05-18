package com.example.notasreact.repositorio;

import com.example.notasreact.modelo.Estudiante;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

public interface EstudianteRepositorio extends ReactiveCrudRepository<Estudiante, Long> {
  Mono<Estudiante> findByCorreo(String correo); //Cambio de Angy :) (Este es el metodo para la validacion)

}
