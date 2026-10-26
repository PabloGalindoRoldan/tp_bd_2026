-- Personas (1 a 4: Profesores, 5 a 10: Alumnos)
INSERT INTO persona (id_persona, dni, nacimiento, nombre, apellido, genero) VALUES
(1, '28456789', '1981-03-15', 'Carlos', 'Gómez', 'Masculino'),
(2, '30123456', '1983-07-22', 'Laura', 'Fernández', 'Femenino'),
(3, '25987654', '1976-11-05', 'Roberto', 'Sánchez', 'Masculino'),
(4, '32111222', '1986-01-30', 'Mariana', 'López', 'Femenino'),
(5, '42100200', '2000-05-12', 'Lucas', 'Martínez', 'Masculino'),
(6, '43200300', '2001-08-19', 'Sofía', 'Díaz', 'Femenino'),
(7, '41500400', '1999-12-01', 'Mateo', 'Álvarez', 'Masculino'),
(8, '44100500', '2002-02-14', 'Valentina', 'Romero', 'Femenino'),
(9, '42900600', '2000-10-08', 'Joaquín', 'Benítez', 'Masculino'),
(10, '43500700', '2001-04-25', 'Camila', 'Torres', 'Femenino');

-- Profesores
INSERT INTO profesor (id_profesor, ingreso_carrera) VALUES
(1, 2010),
(2, 2012),
(3, 2005),
(4, 2018);

-- Alumnos
INSERT INTO alumno (id_alumno, nro_legajo) VALUES
(5, 'LEG-2020-001'),
(6, 'LEG-2021-042'),
(7, 'LEG-2019-108'),
(8, 'LEG-2022-015'),
(9, 'LEG-2020-089'),
(10, 'LEG-2021-102');

-- Títulos
INSERT INTO titulo (id_titulo, nombre) VALUES
(1, 'Licenciado en Ciencias de la Computación'),
(2, 'Ingeniero en Sistemas de Información'),
(3, 'Doctor en Ciencias Informáticas'),
(4, 'Profesor Universitario en Computación');

-- Profesor Títulos
INSERT INTO profesor_titulo (id_titulo, id_profesor, anio) VALUES
(1, 1, 2005),
(3, 1, 2011),
(2, 2, 2007),
(2, 3, 1999),
(4, 4, 2015);

-- Materias
INSERT INTO materia (id_materia, nombre, carga_horaria) VALUES
(1, 'Algoritmos y Estructuras de Datos', 96),
(2, 'Bases de Datos I', 64),
(3, 'Redes y Comunicaciones', 64),
(4, 'Orientación a Objetos', 96);

-- Programas
INSERT INTO programa (id_programa, id_materia, descripcion) VALUES
(1, 1, 'Programa 2024 de Algoritmos enfocado en C++ y estructuras lineales/no lineales.'),
(2, 2, 'Programa 2024 de Bases de Datos enfocado en Modelo Relacional y SQL ANSI.'),
(3, 3, 'Programa 2024 de Redes cubriendo modelo OSI, TCP/IP y VLANs.');

-- Unidades
INSERT INTO unidad (id_unidad, id_programa, descripcion, bibliografia, titulo) VALUES
(1, 1, 'Punteros, memoria dinámica y listas enlazadas', 'Cormen - Introduction to Algorithms', 'Estructuras Lineales'),
(2, 1, 'Árboles binarios, AVL y Grafos', 'Weiss - Data Structures and Algorithm Analysis', 'Estructuras No Lineales'),
(3, 2, 'Álgebra Relacional y Normalización (1FN a 3FN)', 'Date - An Introduction to Database Systems', 'Diseño Relacional'),
(4, 2, 'Lenguaje DDL, DML y Lenguaje SQL avanzado', 'Silberschatz - Database System Concepts', 'SQL y Transacciones');

-- Cuatrimestres
INSERT INTO cuatrimestre (id_cuatrimestre, anio, cuatrimestre) VALUES
(1, 2024, 1),
(2, 2024, 2),
(3, 2025, 1);

-- Cursadas
INSERT INTO cursada (id_cursada, id_materia, id_cuatrimestre, aula, dias, horarios) VALUES
(1, 1, 1, 'Aula 101', 'Lunes y Miércoles', '18:00 a 21:00'),
(2, 2, 1, 'Lab 2', 'Martes y Jueves', '14:00 a 17:00'),
(3, 2, 2, 'Lab 1', 'Martes y Jueves', '18:00 a 21:00'),
(4, 3, 2, 'Aula 204', 'Viernes', '16:00 a 22:00');

-- Profesor Cursada
INSERT INTO profesor_cursada (id_profesor, id_cursada, cargo) VALUES
(1, 1, Profesor),
(2, 2, 'Profesor'),
(4, 2, 'JTP'),
(2, 3, 'Profesor'),
(3, 4, 'Profesor');
(1, 4, 'Ayudante');
-- Requisitos (Parciales / Trabajos Prácticos de la cursada)
INSERT INTO requisito (id_requisito, id_cursada, nombre, instancia_aprobacion, fecha_vencimiento, descripcion) VALUES
(1, 1, 'Parcial 1', 1, '2024-05-15', 'Punteros y Listas'),
(2, 1, 'Parcial 2', 1, '2024-06-20', 'Árboles y Grafos'),
(3, 2, 'TP Integrador SQL', 1, '2024-06-10', 'Diseño e implementación de BD en MySQL');

-- Preguntas
INSERT INTO pregunta (id_pregunta, descripcion) VALUES
(1, '¿Cuál es la diferencia entre un JOIN externo y uno interno?'),
(2, 'Explique la tercera forma normal (3FN) con un ejemplo.'),
(3, '¿Cómo funciona el protocolo ARP en una red local?'),
(4, 'Demuestre el tiempo de ejecución del algoritmo de Dijkstra.');

-- Pregunta Requisito
INSERT INTO pregunta_requisito (id_pregunta, id_requisito, fecha) VALUES
(1, 3, '2024-05-01'),
(2, 3, '2024-05-01');

-- Inscripciones a Cursadas
INSERT INTO inscripcion (id_inscripcion, id_alumno, id_cursada, nota_cursada) VALUES
(1, 5, 1, 8.50),
(2, 6, 1, 4.00),
(3, 7, 1, 9.00),
(4, 5, 2, 7.00),
(5, 8, 2, 10.00),
(6, 9, 3, 6.50),
(7, 10, 4, 8.00);

-- Nota Requisito
INSERT INTO nota_requisito (id_inscripcion, id_requisito, nota) VALUES
(1, 1, 8.00),
(1, 2, 9.00),
(2, 1, 4.00),
(2, 2, 4.00),
(3, 1, 9.50),
(3, 2, 8.50),
(4, 3, 7.00),
(5, 3, 10.00);

-- Exámenes Finales (Fechas de mesa de examen)
INSERT INTO final (id_final, dia, horario, id_materia, aula) VALUES
(1, '2024-07-10', '09:00:00', 1, 'Aula Magna'),
(2, '2024-07-15', '14:00:00', 2, 'Lab 2'),
(3, '2024-12-18', '09:00:00', 2, 'Lab 1');

-- Profesor Final (Tribunal de Examen)
INSERT INTO profesor_final (id_profesor, id_final, cargo) VALUES
(1, 1, 'Ayudante'),
(2, 1, 'Profesor'),
(2, 2, 'Profesor'),
(4, 2, 'JTP'),
(3, 3, 'Profesor');

-- Pregunta Final
INSERT INTO pregunta_final (id_pregunta, id_final, fecha) VALUES
(4, 1, '2024-07-10'),
(1, 2, '2024-07-15'),
(2, 2, '2024-07-15');

-- Inscripciones a Examen Final
INSERT INTO inscripcion_final (id_alumno, id_final, nota_final) VALUES
(5, 1, 8.00),
(7, 1, 10.00),
(5, 2, 7.50),
(8, 2, 9.00),
(9, 3, 2.00);
