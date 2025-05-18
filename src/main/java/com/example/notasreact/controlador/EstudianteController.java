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
    public Mono<ResponseEntity<Estudiante>> crear(@RequestBody Estudiante estudiante) {
        if (estudiante.getCorreo() == null || estudiante.getCorreo().trim().isEmpty()){
            return Mono.just(ResponseEntity.badRequest().build());
        }
        return estudianteServicio.existePorCorreo(estudiante.getCorreo()).flatMap(existe -> {
            if (existe){
                return Mono.just(ResponseEntity.status(HttpStatus.CONFLICT)).build());
            }
            return estudianteServicio.crear(estudiante).map(ResponseEntity::ok);        
        })
            .defaultIfempty(ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build());
    } //Cambio Por Angy :)

    @PutMapping("/actualizar/{id}")
    public Mono<ResponseEntity<Estudiante>> actualizar(@PathVariable Long id, @RequestBody Estudiante nuevoEstudiante) {
        if (nuevoEstudiante.getCorreo() == null || nuevoEstudiante.getCorreo().trim().isEmpty()) {
            return Mono.just(ResponseEntity.badRequest().build());
        }

        return estudianteServicio.existePorCorreo(nuevoEstudiante.getCorreo())
                .flatMap(existe -> {
                    if (existe) {
                        return estudianteServicio.findById(id)  //  Verificar si el correo ya existe para otro estudiante
                                .flatMap(estudianteExistente -> {
                                    if (estudianteExistente.getCorreo().equals(nuevoEstudiante.getCorreo())) {
                                        return estudianteServicio.actualizar(id, nuevoEstudiante)
                                                .map(ResponseEntity::ok); //  Mismo correo, se actualiza
                                    } else {
                                        return Mono.just(ResponseEntity.status(HttpStatus.CONFLICT).build()); //  Correo duplicado
                                    }
                                })
                                .switchIfEmpty(Mono.just(ResponseEntity.notFound().build()));  //  Estudiante no encontrado
                    } else {
                        return estudianteServicio.actualizar(id, nuevoEstudiante)
                                .map(ResponseEntity::ok); //  Correo único, se actualiza
                    }
                })
                .defaultIfEmpty(ResponseEntity.notFound().build());
    } //Cambio por Angy :)


    @DeleteMapping("/eliminar/{id}")
    public Mono<Void> eliminar(@PathVariable Long id) {
        return estudianteServicio.eliminar(id);
    } 

    @PostMapping("/materias/{materiaId}/estudiantes")
    public Mono<ResponseEntity<String>> agregarEstudianteAMateria(
            @PathVariable Long materiaId,
            @RequestBody Estudiante estudiante) {

        // Validación básica
        if(estudiante.getNombre() == null || estudiante.getNombre().trim().isEmpty()) {
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
