package com.example.notasreact.repositorio;

import com.example.notasreact.modelo.Estudiante;
import org.springframework.data.r2dbc.repository.R2dbcRepository;

public interface EstudianteRepositorio extends R2dbcRepository<Estudiante, Long> {
}
