package com.example.notasreact.controlador;


import com.example.notasreact.modelo.Estudiante;
import com.example.notasreact.servicio.EstudianteServicio;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/estudiantes")
public class EstudianteController {

    private final EstudianteServicio servicio;

    public EstudianteController(EstudianteServicio servicio) {
        this.servicio = servicio;
    }

    @GetMapping
    public Flux<Estudiante> listarEstudiantes() {
        return servicio.listarTodos();
    }

    @PostMapping
    public Mono<Estudiante> crear(@RequestBody Estudiante estudiante) {
        return servicio.crear(estudiante);
    }

    @PutMapping("/{id}")
    public Mono<Estudiante> actualizar(@PathVariable Long id, @RequestBody Estudiante estudiante) {
        return servicio.actualizar(id, estudiante);
    }

    @DeleteMapping("/{id}")
    public Mono<Void> eliminar(@PathVariable Long id) {
        return servicio.eliminar(id);
    }



}
