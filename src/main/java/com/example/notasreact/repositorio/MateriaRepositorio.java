package com.example.notasreact.repositorio;

import com.example.notasreact.modelo.Materia;
import org.springframework.data.r2dbc.repository.R2dbcRepository;

public interface MateriaRepositorio extends R2dbcRepository<Materia, Long> {
}
