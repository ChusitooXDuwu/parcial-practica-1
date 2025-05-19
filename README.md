# Sistema de Gestión de Iniciativas de Investigación

Este proyecto implementa una API RESTful para la gestión de iniciativas de investigación lideradas por estudiantes de pregrado, desarrollada con NestJS.

## Descripción

El sistema permite la interacción entre estudiantes, profesores y la decanatura de investigación, facilitando la gestión de:

- **Estudiantes**: con restricciones de promedio y semestre
- **Profesores**: con validación de extensión y asignación como evaluadores
- **Proyectos**: con estados, presupuesto y relaciones con líderes y mentores
- **Evaluaciones**: con validación de calificaciones y restricción de evaluador ≠ mentor

## Requisitos previos

- Node.js (v16 o superior)
- PostgreSQL
- npm o yarn

## Instalación

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/tu-usuario/parcial-practico-2.git
   cd parcial-practico-2
   ```

2. Instalar dependencias:
   ```bash
   npm install
   ```

3. Instalar dependencias específicas requeridas:
   ```bash
   npm install class-validator class-transformer
   ```

4. Configurar base de datos PostgreSQL:
   - Asegúrate de tener PostgreSQL ejecutándose
   - Revisa la configuración en `src/app.module.ts` y ajusta las credenciales según sea necesario

## Ejecución

1. Iniciar en modo desarrollo:
   ```bash
   npm run start:dev
   ```

2. La API estará disponible en `http://localhost:3000/api/v1/`

## Pruebas

### Ejecutar pruebas unitarias:
```bash
npm run test
```

### Pruebas con Postman:
Este proyecto incluye una colección de Postman completa para probar todos los endpoints.

1. Importar la colección desde `postman/Sistema de Gestión de Iniciativas.postman_collection.json`
2. Configurar el entorno en Postman con la variable `base_url` establecida en `http://localhost:3000/api/v1`
3. Ejecutar las pruebas en el siguiente orden recomendado:
   - Creación de entidades (Estudiantes, Profesores)
   - Creación de relaciones (Proyectos, Evaluaciones)
   - Operaciones de consulta y actualización
   - Casos de prueba negativos

## Estructura del proyecto

```
src/
├── student/              # Módulo de estudiantes
├── professor/            # Módulo de profesores
├── proyect/              # Módulo de proyectos
├── evaluation/           # Módulo de evaluaciones
└── main.ts               # Punto de entrada de la aplicación
```

## Reglas de negocio implementadas

### Estudiantes
- El promedio debe ser mayor a 3.2
- El semestre debe ser mayor o igual a 4
- No se puede eliminar un estudiante con proyectos activos

### Profesores
- La extensión debe tener exactamente 5 dígitos
- Un profesor solo puede tener hasta 3 evaluaciones activas

### Proyectos
- El título debe tener más de 15 caracteres
- El presupuesto debe ser mayor a 0
- Un proyecto puede tener un estado entre 0 y 4

### Evaluaciones
- El evaluador no puede ser el mentor del proyecto
- La calificación debe estar entre 0 y 5

## API Endpoints

### Estudiantes
- `GET /student` - Listar todos los estudiantes
- `GET /student/:id` - Obtener un estudiante por ID
- `POST /student` - Crear un estudiante
- `PATCH /student/:id` - Actualizar un estudiante
- `DELETE /student/:id` - Eliminar un estudiante

### Profesores
- `GET /professor` - Listar todos los profesores
- `GET /professor/:id` - Obtener un profesor por ID
- `POST /professor` - Crear un profesor
- `PATCH /professor/:id` - Actualizar un profesor
- `DELETE /professor/:id` - Eliminar un profesor
- `POST /professor/:id/asignar-evaluador` - Asignar profesor como evaluador

### Proyectos
- `GET /proyect` - Listar todos los proyectos
- `GET /proyect/:id` - Obtener un proyecto por ID
- `POST /proyect` - Crear un proyecto
- `PATCH /proyect/:id` - Actualizar un proyecto
- `DELETE /proyect/:id` - Eliminar un proyecto
- `POST /proyect/:id/avanzar` - Avanzar el estado del proyecto
- `GET /proyect/:id/estudiantes` - Listar estudiantes de un proyecto

### Evaluaciones
- `GET /evaluation` - Listar todas las evaluaciones
- `GET /evaluation/:id` - Obtener una evaluación por ID
- `POST /evaluation` - Crear una evaluación
- `PATCH /evaluation/:id` - Actualizar una evaluación
- `DELETE /evaluation/:id` - Eliminar una evaluación

## Documentación adicional

- **Justificación de pruebas**: Revise `postman/POSTMAN_JUSTIFICATION.md` para entender los casos de prueba implementados.

## Ejemplo de uso

1. Crea un estudiante con promedio válido:
   ```http
   POST http://localhost:3000/api/v1/student
   {
     "cedula": 1234567890,
     "nombre": "Juan Pérez",
     "semestre": 6,
     "programa": "Ingeniería de Sistemas",
     "promedio": 4.2
   }
   ```

2. Crea un profesor con extensión de 5 dígitos:
   ```http
   POST http://localhost:3000/api/v1/professor
   {
     "cedula": 1122334455,
     "nombre": "Carlos Rodríguez",
     "departamento": "Ciencias de la Computación",
     "extension": 12345,
     "esParEvaluador": false
   }
   ```

3. Crea un proyecto asociando estudiante y profesor:
   ```http
   POST http://localhost:3000/api/v1/proyect
   {
     "titulo": "Sistema de gestión académica avanzado",
     "area": "Sistemas de Información",
     "presupuesto": 5000,
     "notaFinal": 0,
     "estado": 0,
     "fechaInicio": "2025-05-01",
     "fechaFin": "2025-12-31",
     "liderId": 1,
     "mentorId": 1
   }
   ```

## Autor

[Tu Nombre](https://github.com/tu-usuario)

## Licencia

Este proyecto está bajo la Licencia MIT.