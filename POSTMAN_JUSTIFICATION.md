# Justificación de Casos de Prueba en Postman

## Enfoque de pruebas

He seleccionado los siguientes casos de prueba para verificar el correcto funcionamiento de la API, enfocándome en validar tanto los flujos exitosos como las restricciones de negocio.

## Estudiantes

### Casos positivos:
1. **Crear estudiante válido**: Verifica que un estudiante con promedio > 3.2 y semestre ≥ 4 se guarde correctamente.
   - **Justificación**: Es el caso de uso principal y debe funcionar correctamente para permitir la creación de estudiantes que cumplen los requisitos.

2. **Eliminar estudiante sin proyectos**: Verifica que un estudiante sin proyectos activos pueda ser eliminado.
   - **Justificación**: Valida la funcionalidad básica de eliminación cuando no hay restricciones.

### Casos negativos:
1. **Crear estudiante con promedio bajo**: Verifica que se rechace un estudiante con promedio ≤ 3.2.
   - **Justificación**: Valida la regla de negocio que exige un promedio mínimo.

2. **Crear estudiante en semestre temprano**: Verifica que se rechace un estudiante con semestre < 4.
   - **Justificación**: Valida la regla de negocio que exige un semestre mínimo.

3. **Eliminar estudiante con proyectos activos**: Verifica que se rechace la eliminación.
   - **Justificación**: Valida la integridad referencial y evita eliminar datos que afectarían proyectos activos.

## Profesores

### Casos positivos:
1. **Crear profesor con extensión válida**: Verifica que un profesor con extensión de 5 dígitos se guarde correctamente.
   - **Justificación**: Valida el formato requerido para la extensión.

2. **Asignar profesor como evaluador**: Verifica que un profesor con menos de 3 evaluaciones pueda ser asignado.
   - **Justificación**: Valida la funcionalidad principal de asignación de evaluadores.

### Casos negativos:
1. **Crear profesor con extensión inválida**: Verifica que se rechace un profesor con extensión que no tenga 5 dígitos.
   - **Justificación**: Valida la regla de formato para la extensión telefónica.

2. **Asignar profesor con 3+ evaluaciones**: Verifica que se rechace asignar más evaluaciones.
   - **Justificación**: Valida la restricción de carga máxima de evaluaciones por profesor.

## Proyectos

### Casos positivos:
1. **Crear proyecto válido**: Verifica que un proyecto con título > 15 caracteres y presupuesto > 0 se guarde correctamente.
   - **Justificación**: Valida las restricciones básicas de creación de proyectos.

2. **Avanzar estado de proyecto**: Verifica que el estado se incremente correctamente.
   - **Justificación**: Valida el ciclo de vida de los proyectos y su progresión de estados.

3. **Obtener estudiantes de proyecto**: Verifica que se retorne el listado de estudiantes relacionados.
   - **Justificación**: Valida la relación entre proyectos y estudiantes.

### Casos negativos:
1. **Crear proyecto con título corto**: Verifica que se rechace un proyecto con título ≤ 15 caracteres.
   - **Justificación**: Valida la regla de longitud mínima para títulos de proyectos.

2. **Crear proyecto con presupuesto no válido**: Verifica que se rechace un proyecto con presupuesto ≤ 0.
   - **Justificación**: Valida la regla de negocio que exige un presupuesto positivo.

3. **Avanzar proyecto en estado máximo**: Verifica que se rechace avanzar un proyecto ya en estado 4.
   - **Justificación**: Valida el límite máximo de estados de un proyecto.

## Evaluaciones

### Casos positivos:
1. **Crear evaluación válida**: Verifica que una evaluación con evaluador ≠ mentor y calificación entre 0-5 se guarde correctamente.
   - **Justificación**: Valida las restricciones básicas para crear evaluaciones.

### Casos negativos:
1. **Evaluador igual a mentor**: Verifica que se rechace una evaluación donde el evaluador es el mismo profesor que el mentor.
   - **Justificación**: Valida la separación de responsabilidades y evita conflictos de interés.

2. **Calificación fuera de rango**: Verifica que se rechace una evaluación con calificación < 0 o > 5.
   - **Justificación**: Valida el rango permitido para calificaciones.

## Estrategia de pruebas

Estas pruebas están diseñadas para validar:

1. Las **reglas de negocio** específicas mencionadas en el enunciado.
2. La **integridad referencial** entre entidades relacionadas.
3. El **manejo de errores** ante datos inválidos.
4. La **funcionalidad completa** de cada endpoint de la API.

Al ejecutar estas pruebas, podemos tener confianza en que la API implementa correctamente todos los requisitos y restricciones especificados en el enunciado del parcial.