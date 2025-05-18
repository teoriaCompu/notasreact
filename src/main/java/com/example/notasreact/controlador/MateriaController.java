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
public Mono<ResponseEntity<Materia>> crear(@RequestBody Materia materia) {
        if (materia.getNombre() == null || materia.getNombre().trim().isEmpty()) {
            return Mono.just(ResponseEntity.badRequest().build());
        }

        return materiaServicio.existePorNombre(materia.getNombre())
                .flatMap(existe -> {
                    if (existe) {
                        return Mono.just(ResponseEntity.status(HttpStatus.CONFLICT).build());
                    }
                    return materiaServicio.crear(materia)
                            .map(ResponseEntity::ok);
                })
                .defaultIfEmpty(ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build());
    } //Cambio por Angy :)

@PutMapping("actualizar/{id}")
public Mono<ResponseEntity<Materia>> actualizar(@PathVariable Long id, @RequestBody Materia nuevaMateria) {
        if (nuevaMateria.getNombre() == null || nuevaMateria.getNombre().trim().isEmpty()) {
            return Mono.just(ResponseEntity.badRequest().build());
        }

        return materiaServicio.existePorNombre(nuevaMateria.getNombre())
                .flatMap(existe -> {
                    if (existe) {
                        return materiaServicio.findById(id)
                                .flatMap(materiaExistente -> {
                                    if (materiaExistente.getNombre().equals(nuevaMateria.getNombre())) {
                                        return materiaServicio.actualizar(id, nuevaMateria)
                                                .map(ResponseEntity::ok);
                                    } else {
                                        return Mono.just(ResponseEntity.status(HttpStatus.CONFLICT).build());
                                    }
                                })
                                .switchIfEmpty(Mono.just(ResponseEntity.notFound().build()));
                    } else {
                        return materiaServicio.actualizar(id, nuevaMateria)
                                .map(ResponseEntity::ok);
                    }
                })
                .defaultIfEmpty(ResponseEntity.notFound().build());
    } //Cambio por Angy :)
    
@DeleteMapping("eliminar/{id}")
public Mono<Void> eliminar(@PathVariable Long id) {
    return materiaServicio.eliminar(id);
}

    @GetMapping("/{materiaId}/estudiantes")
    public Flux<Estudiante> listarEstudiantesPorMateria(@PathVariable Long materiaId) {
        return notaServicio.listarEstudiantesPorMateria(materiaId);
    }


}
