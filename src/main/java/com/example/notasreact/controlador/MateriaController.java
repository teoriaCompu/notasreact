package com.example.notasreact.controlador;

import com.example.notasreact.modelo.Materia;
import com.example.notasreact.servicio.MateriaServicio;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/materias")
public class MateriaController {

private final MateriaServicio servicio;

public MateriaController(MateriaServicio servicio) {
    this.servicio = servicio;
}

@GetMapping
public Flux<Materia> listarMaterias() {
    return servicio.ListarMaterias();
}

@PostMapping
    public Mono<Materia> crear(@RequestBody Materia materia) {
    return servicio.crear(materia);
}

@PutMapping("actualizar/{id}")
public Mono<Materia> actualizar(@PathVariable Long id, @RequestBody Materia materia) {
    return servicio.actualizar(id, materia);
}

@DeleteMapping("eliminar/{id}")
public Mono<Void> eliminar(@PathVariable Long id) {
    return servicio.eliminar(id);
}
}
