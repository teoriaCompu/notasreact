package com.example.notasreact.modelo;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

@Getter @Setter
@Table("notas")
public class Nota {
    @Id
    private Long id;

    @Column("estudiante_id")  // nombre de la columna
    private Long estudianteId;

    @Column("materia_id")     // nombre de la columna
    private Long materiaId;
    private String observacion;
    private Double valor;
    private Double porcentaje;
}
