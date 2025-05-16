package com.example.notasreact.modelo;


import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

@Getter @Setter
@Table("materias")
public class Materia {
    @Id
    private Long id;
    private String nombre;
    private Integer creditos;

}
