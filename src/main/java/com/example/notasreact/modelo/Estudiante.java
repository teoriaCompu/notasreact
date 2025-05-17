package com.example.notasreact.modelo;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

import java.util.ArrayList;
import java.util.List;


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
