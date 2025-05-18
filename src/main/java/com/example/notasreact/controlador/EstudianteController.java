package com.example.notasreact.controlador;

import com.example.notasreact.modelo.Estudiante;
import com.example.notasreact.modelo.Nota;
import com.example.notasreact.servicio.EstudianteServicio;
import com.example.notasreact.servicio.NotaServicio;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/estudiantes")
public class EstudianteController {

    private final EstudianteServicio estudianteServicio;
    private final NotaServicio notaServicio;

    public EstudianteController(EstudianteServicio estudianteServicio, NotaServicio notaServicio) {
        this.estudianteServicio = estudianteServicio;
        this.notaServicio = notaServicio;
    }

    @GetMapping
    public Flux<Estudiante> listarEstudiantes() {
        return estudianteServicio.listarTodos();
    }

    @PostMapping
    public Mono<Estudiante> crear(@RequestBody Estudiante estudiante) {
        return estudianteServicio.crear(estudiante);
    }

    @PutMapping("/actualizar/{id}")
    public Mono<ResponseEntity<Estudiante>> actualizar(@PathVariable Long id, @RequestBody Estudiante estudiante) {
        return estudianteServicio.actualizar(id, estudiante)
                .map(ResponseEntity::ok)
                .defaultIfEmpty(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/eliminar/{id}")
    public Mono<Void> eliminar(@PathVariable Long id) {
        return estudianteServicio.eliminar(id);
    }

    @PostMapping("/materias/{materiaId}/estudiantes")
    public Mono<ResponseEntity<String>> agregarEstudianteAMateria(
            @PathVariable Long materiaId,
            @RequestBody Estudiante estudiante) {

        // Validación básica
        if (estudiante.getNombre() == null || estudiante.getNombre().trim().isEmpty()) {
            return Mono.just(ResponseEntity.badRequest().body("Nombre es requerido"));
        }

        return estudianteServicio.crear(estudiante)
                .flatMap(est -> {
                    Nota nota = new Nota();
                    nota.setMateriaId(materiaId);
                    nota.setEstudianteId(est.getId());
                    nota.setValor(0.0);
                    nota.setPorcentaje(0.0);
                    nota.setObservacion("Registro inicial");

                    return notaServicio.guardarNota(nota)
                            .thenReturn(ResponseEntity.ok("Estudiante agregado correctamente"));
                })
                .onErrorResume(e -> Mono.just(
                        ResponseEntity.status(500).body("Error: " + e.getMessage())
                ));
    }
    }