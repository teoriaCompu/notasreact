package com.example.notasreact.repositorio;

import com.example.notasreact.modelo.Estudiante;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;

public interface EstudianteRepositorio extends ReactiveCrudRepository<Estudiante, Long> {
}
