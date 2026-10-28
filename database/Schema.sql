CREATE TABLE persona (
    id_persona INT AUTO_INCREMENT PRIMARY KEY,
    dni VARCHAR(20) NOT NULL UNIQUE,
    nacimiento DATE,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    genero VARCHAR(20)
);

CREATE TABLE titulo (
    id_titulo INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL UNIQUE
);

CREATE TABLE materia (
    id_materia INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    carga_horaria INT
);

CREATE TABLE cuatrimestre (
    id_cuatrimestre INT AUTO_INCREMENT PRIMARY KEY,
    anio YEAR NOT NULL,
    cuatrimestre INT NOT NULL,
    CONSTRAINT uk_cuatrimestre_anio UNIQUE (anio, cuatrimestre)
);

CREATE TABLE pregunta (
    id_pregunta INT AUTO_INCREMENT PRIMARY KEY,
    descripcion TEXT NOT NULL UNIQUE
);

CREATE TABLE alumno (
    id_alumno INT PRIMARY KEY,
    nro_legajo VARCHAR(50) NOT NULL UNIQUE,
    CONSTRAINT fk_alumno_persona FOREIGN KEY (id_alumno) REFERENCES persona(id_persona) ON DELETE CASCADE
);

CREATE TABLE profesor (
    id_profesor INT PRIMARY KEY,
    ingreso_carrera YEAR,
    CONSTRAINT fk_profesor_persona FOREIGN KEY (id_profesor) REFERENCES persona(id_persona) ON DELETE CASCADE
);

CREATE TABLE programa (
    id_programa INT AUTO_INCREMENT PRIMARY KEY,
    id_materia INT NOT NULL,
    descripcion TEXT,
    CONSTRAINT fk_programa_materia FOREIGN KEY (id_materia) REFERENCES materia(id_materia) ON DELETE CASCADE
);

CREATE TABLE unidad (
    id_unidad INT AUTO_INCREMENT PRIMARY KEY,
    id_programa INT NOT NULL,
    descripcion TEXT,
    bibliografia TEXT,
    titulo VARCHAR(150),
    CONSTRAINT fk_unidad_programa FOREIGN KEY (id_programa) REFERENCES programa(id_programa) ON DELETE CASCADE
);

CREATE TABLE cursada (
    id_cursada INT AUTO_INCREMENT PRIMARY KEY,
    id_materia INT NOT NULL,
    id_cuatrimestre INT NOT NULL,
    aula VARCHAR(50),
    dias VARCHAR(50),
    horarios VARCHAR(50),
    CONSTRAINT fk_cursada_materia FOREIGN KEY (id_materia) REFERENCES materia(id_materia),
    CONSTRAINT fk_cursada_cuatrimestre FOREIGN KEY (id_cuatrimestre) REFERENCES cuatrimestre(id_cuatrimestre)
);

CREATE TABLE final (
    id_final INT AUTO_INCREMENT PRIMARY KEY,
    dia DATE NOT NULL,
    horario TIME NOT NULL,
    id_materia INT NOT NULL,
    aula VARCHAR(50),
    CONSTRAINT fk_final_materia FOREIGN KEY (id_materia) REFERENCES materia(id_materia),
    CONSTRAINT uk_final_fecha_materia UNIQUE (dia, horario, id_materia)
);

CREATE TABLE requisito (
    id_requisito INT AUTO_INCREMENT PRIMARY KEY,
    id_cursada INT NOT NULL,
    nombre VARCHAR(50) NOT NULL,
    instancia_aprobacion INT,
    fecha_vencimiento DATE,
    descripcion TEXT,
    CONSTRAINT fk_requisito_cursada FOREIGN KEY (id_cursada) REFERENCES cursada(id_cursada) ON DELETE CASCADE
);

CREATE TABLE inscripcion (
    id_inscripcion INT AUTO_INCREMENT PRIMARY KEY,
    id_alumno INT NOT NULL,
    id_cursada INT NOT NULL,
    nota_cursada DECIMAL(4,2),
    CONSTRAINT fk_inscripcion_alumno FOREIGN KEY (id_alumno) REFERENCES alumno(id_alumno),
    CONSTRAINT fk_inscripcion_cursada FOREIGN KEY (id_cursada) REFERENCES cursada(id_cursada),
    CONSTRAINT uk_inscripcion_alumno_cursada UNIQUE (id_alumno, id_cursada)
);

CREATE TABLE inscripcion_final (
    id_alumno INT NOT NULL,
    id_final INT NOT NULL,
    nota_final DECIMAL(4,2),
    PRIMARY KEY (id_alumno, id_final),
    CONSTRAINT fk_inscripcion_final_alumno FOREIGN KEY (id_alumno) REFERENCES alumno(id_alumno),
    CONSTRAINT fk_inscripcion_final_final FOREIGN KEY (id_final) REFERENCES final(id_final)
);

CREATE TABLE profesor_titulo (
    id_titulo INT NOT NULL,
    id_profesor INT NOT NULL,
    anio YEAR,
    PRIMARY KEY (id_titulo, id_profesor),
    CONSTRAINT fk_proftit_titulo FOREIGN KEY (id_titulo) REFERENCES titulo(id_titulo),
    CONSTRAINT fk_proftit_profesor FOREIGN KEY (id_profesor) REFERENCES profesor(id_profesor)
);

CREATE TABLE profesor_final (
    id_profesor INT NOT NULL,
    id_final INT NOT NULL,
    cargo VARCHAR(50),
    PRIMARY KEY (id_profesor, id_final),
    CONSTRAINT fk_proffinal_profesor FOREIGN KEY (id_profesor) REFERENCES profesor(id_profesor),
    CONSTRAINT fk_proffinal_final FOREIGN KEY (id_final) REFERENCES final(id_final)
);

CREATE TABLE profesor_cursada (
    id_profesor INT NOT NULL,
    id_cursada INT NOT NULL,
    cargo VARCHAR(50),
    PRIMARY KEY (id_profesor, id_cursada),
    CONSTRAINT fk_profcursada_profesor FOREIGN KEY (id_profesor) REFERENCES profesor(id_profesor),
    CONSTRAINT fk_profcursada_cursada FOREIGN KEY (id_cursada) REFERENCES cursada(id_cursada)
);

CREATE TABLE pregunta_final (
    id_pregunta INT NOT NULL,
    id_final INT NOT NULL,
    fecha DATE,
    PRIMARY KEY (id_pregunta, id_final),
    CONSTRAINT fk_pregfinal_pregunta FOREIGN KEY (id_pregunta) REFERENCES pregunta(id_pregunta),
    CONSTRAINT fk_pregfinal_final FOREIGN KEY (id_final) REFERENCES final(id_final)
);

CREATE TABLE pregunta_requisito (
    id_pregunta INT NOT NULL,
    id_requisito INT NOT NULL,
    fecha DATE,
    PRIMARY KEY (id_pregunta, id_requisito),
    CONSTRAINT fk_pregreq_pregunta FOREIGN KEY (id_pregunta) REFERENCES pregunta(id_pregunta),
    CONSTRAINT fk_pregreq_requisito FOREIGN KEY (id_requisito) REFERENCES requisito(id_requisito)
);

CREATE TABLE nota_requisito (
    id_inscripcion INT NOT NULL,
    id_requisito INT NOT NULL,
    nota DECIMAL(4,2),
    PRIMARY KEY (id_inscripcion, id_requisito),
    CONSTRAINT fk_notareq_inscripcion FOREIGN KEY (id_inscripcion) REFERENCES inscripcion(id_inscripcion),
    CONSTRAINT fk_notareq_requisito FOREIGN KEY (id_requisito) REFERENCES requisito(id_requisito)
);
