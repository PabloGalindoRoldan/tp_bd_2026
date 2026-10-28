--datos personales de los alumnos, las materias que rindio final, la fecha de examen y la nota.--

/*persona = (id_persona, dni(UK), nacimiento, nombre, apellido, genero)
alumno = (id_alumno (FK id_persona), nro_legajo)
inscripcion = (id_inscripcion, (id_alumno(FK), id_cursada(FK))UK, nota_cursada)
inscripcion_final=(id_alumno(FK), id_final(FK), nota_final)
profesor = (id_profesor(FK id_persona),  ingreso_carrera)
titulo = (id_titulo, nombre (UK))
profesor_titulo = (id_titulo (FK), id_profesor(FK), año)
profesor_final = (id_profesor(FK), id_final(FK), cargo)
profesor_cursada = (id_profesor(FK), id_cursada (FK), cargo)
pregunta = ( id_pregunta,  descripción(UK))
pregunta_final = (id_pregunta, id_final, fecha)
pregunta_requisito = (id_pregunta, id_requisito, fecha)
materia=(id_materia, nombre, carga_horaria)
programa=(id_programa, id_materia(FK), descripcion)
unidad=(id_unidad,  id_programa(FK), descripcion, bibliografia, titulo)
final=(id_final, (dia, horario, id_materia(FK))(UK), aula) 
cuatrimestre = (id_cuatrimestre, (año, cuatrimestre)UK)
cursada = (id_cursada, id_materia(FK), id_cuatrimestre(FK), aula, dias, horarios)
requisito = (id_requisito, id_cursada(FK), nombre, instancia_aprobacion, fecha_vencimiento, descripcion)
nota_requisito = (id_inscripcion(FK), id_requisito(FK), nota)*/


CREATE VIEW VhistoriaCursadas AS
SELECT
    p.id_persona AS id_persona,
    p.dni AS dni_persona,
    p.nacimiento AS nacimiento_persona,
    p.nombre AS nombre_persona,
    p.apellido AS apellido_persona,
    p.genero AS genero_persona,
    a.id_alumno AS id_alumno,
    a.nro_legajo AS nro_legajo,
    i.id_inscripcion AS id_inscripcion,
    i.id_cursada AS id_cursada,
    c.id_cuatrimestre AS id_cuatrimestre,
    c.aula AS aula_cursada,
    c.dias AS dias_cursada,
    c.horarios AS horarios_cursada,
    m.id_materia AS id_materia,
    m.nombre AS nombre_materia,
    i.notaCursada AS nota_cursada
FROM persona p
INNER JOIN alumno a ON p.id_persona = a.id_alumno
INNER JOIN inscripcion i ON a.id_alumno = i.id_alumno
INNER JOIN cursada c ON i.id_cursada = c.id_cursada
INNER JOIN materia m ON c.id_materia = m.id_materia;