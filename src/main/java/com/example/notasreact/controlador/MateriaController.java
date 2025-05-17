package com.example.notasreact.controlador;

import com.example.notasreact.modelo.Estudiante;
import com.example.notasreact.modelo.Materia;
import com.example.notasreact.servicio.MateriaServicio;
import com.example.notasreact.servicio.NotaServicio;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/materias")
public class MateriaController {

    private final MateriaServicio materiaServicio;
    private final NotaServicio notaServicio;

    public MateriaController(MateriaServicio materiaServicio, NotaServicio notaServicio) {
        this.materiaServicio = materiaServicio;
        this.notaServicio = notaServicio;
    }
@GetMapping
public Flux<Materia> listarMaterias() {
    return materiaServicio.ListarMaterias();
}

@PostMapping
    public Mono<Materia> crear(@RequestBody Materia materia) {
    return materiaServicio.crear(materia);
}

@PutMapping("actualizar/{id}")
public Mono<Materia> actualizar(@PathVariable Long id, @RequestBody Materia materia) {
    return materiaServicio.actualizar(id, materia);
}

@DeleteMapping("eliminar/{id}")
public Mono<Void> eliminar(@PathVariable Long id) {
    return materiaServicio.eliminar(id);
}

    @GetMapping("/{materiaId}/estudiantes")
    public Flux<Estudiante> listarEstudiantesPorMateria(@PathVariable Long materiaId) {
        return notaServicio.listarEstudiantesPorMateria(materiaId);
    }


}
