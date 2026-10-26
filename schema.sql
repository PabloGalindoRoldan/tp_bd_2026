-- ============================================================
-- 3. RELACIONES Y TABLAS INTERMEDIAS
-- ============================================================

CREATE TABLE inscripcion (
    id_inscripcion INT AUTO_INCREMENT PRIMARY KEY,
    id_alumno INT NOT NULL,
    id_cursada INT NOT NULL,
    nota_cursada DECIMAL(2,2),
    CONSTRAINT fk_inscripcion_alumno FOREIGN KEY (id_alumno) REFERENCES alumno(id_alumno),
    CONSTRAINT fk_inscripcion_cursada FOREIGN KEY (id_cursada) REFERENCES cursada(id_cursada),
    CONSTRAINT uk_inscripcion_alumno_cursada UNIQUE (id_alumno, id_cursada)
);

CREATE TABLE inscripcion_final (
    id_alumno INT NOT NULL,
    id_final INT NOT NULL,
    nota_final DECIMAL(2,2),
    PRIMARY KEY (id_alumno, id_final),
    CONSTRAINT fk_inscripcion_final_alumno FOREIGN KEY (id_alumno) REFERENCES alumno(id_alumno),
    CONSTRAINT fk_inscripcion_final_final FOREIGN KEY (id_final) REFERENCES final(id_final)
);

CREATE TABLE profesor_titulo (
    id_titulo INT NOT NULL,
    id_profesor INT NOT NULL,
    año YEAR,
    PRIMARY KEY (id_titulo, id_profesor),
    CONSTRAINT fk_proftit_titulo FOREIGN KEY (id_titulo) REFERENCES titulo(id_titulo),
    CONSTRAINT fk_proftit_profesor FOREIGN KEY (id_profesor) REFERENCES profesor(id_profesor)
);

CREATE TABLE profesor_final (
    id_profesor INT NOT NULL,
    id_final INT NOT NULL,
    cargo VARCHAR(20),
    PRIMARY KEY (id_profesor, id_final),
    CONSTRAINT fk_proffinal_profesor FOREIGN KEY (id_profesor) REFERENCES profesor(id_profesor),
    CONSTRAINT fk_proffinal_final FOREIGN KEY (id_final) REFERENCES final(id_final)
);

CREATE TABLE profesor_cursada (
    id_profesor INT NOT NULL,
    id_cursada INT NOT NULL,
    cargo VARCHAR(20),
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
    nota DECIMAL(2,2),
    PRIMARY KEY (id_inscripcion, id_requisito),
    CONSTRAINT fk_notareq_inscripcion FOREIGN KEY (id_inscripcion) REFERENCES inscripcion(id_inscripcion),
    CONSTRAINT fk_notareq_requisito FOREIGN KEY (id_requisito) REFERENCES requisito(id_requisito)
);
