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

DELIMITER //

CREATE PROCEDURE SPDeasignaProfesor (
    IN in_id_profesor INT,
    IN in_id_cursada INT
)
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM profesor_cursada 
        WHERE id_profesor = in_id_profesor 
        AND id_cursada = in_id_cursada
    ) THEN
        DELETE FROM profesor_cursada 
        WHERE id_profesor = in_id_profesor 
        AND id_cursada = in_id_cursada;
    END IF;
END //

DELIMITER ;