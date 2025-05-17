package com.example.notasreact.modelo;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

@Getter
@Setter
@Table("estudiantes")
public class Estudiante {

@Id
private long id;
private String nombre;
private  String apellido;
private String correo;
}
