package com.example.notasreact.controlador;

import com.example.notasreact.modelo.Nota;
import com.example.notasreact.servicio.NotaServicio;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/notas")
public class NotaController {

    private final NotaServicio notaService;

    public NotaController(NotaServicio notaService) {
        this.notaService = notaService;
    }

    // Listar notas filtrando por materia y estudiante
    @GetMapping
    public Flux<Nota> listarNotas(@RequestParam Long materiaId, @RequestParam Long estudianteId) {
        return notaService.listarNotasPorMateriaYEstudiante(materiaId, estudianteId);
    }

    // Crear o actualizar nota (si id existe, actualizar)
    @PostMapping
    public Mono<Nota> guardarNota(@RequestBody Nota nota) {
        return notaService.guardarNota(nota);
    }

    // Eliminar nota por id
    @DeleteMapping("/{id}")
    public Mono<Void> eliminarNota(@PathVariable Long id) {
        return notaService.eliminarNota(id);
    }

    // Obtener promedio final reactivo para materia y estudiante
    @GetMapping("/promedio")
    public Mono<Double> obtenerPromedio(@RequestParam Long materiaId, @RequestParam Long estudianteId) {
        return notaService.calcularPromedioFinal(materiaId, estudianteId);
    }
}
