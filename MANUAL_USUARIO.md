# Manual de Usuario

## Sistema de Gestión de Roles Académicos

### 1. Introducción

El Sistema de Gestión de Roles Académicos permite administrar la designación, ratificación, desnombramiento, consulta histórica y generación de documentos oficiales relacionados con:

- Profesores Principales de Año (PPA).
- Alumnos Ayudantes (AA).

La aplicación centraliza la información por facultad y departamento, facilita la consulta de registros vigentes e históricos, y permite generar documentos y resoluciones en formato PDF o Word.

### 2. Roles de usuario

La aplicación muestra opciones diferentes según el rol asignado al usuario.

| Rol | Alcance principal |
| --- | --- |
| Jefe de departamento | Gestiona PPA y AA asociados a su departamento. |
| Vicedecano docente | Gestiona información de la facultad, documentos, resoluciones y accesos por rol. |
| Decano | Consulta y gestiona información de la facultad, documentos, resoluciones y accesos por rol. |
| Administrador | Gestiona permisos iniciales del sistema desde la pantalla de inicio de sesión. |

### 3. Acceso al sistema

1. Abra la aplicación en el navegador.
2. En la pantalla de bienvenida escriba su usuario y contraseña.
3. Presione **Iniciar sesión**.
4. Si las credenciales son correctas y el usuario tiene acceso asignado, se abrirá el panel principal.

La sesión se mantiene activa durante un tiempo limitado. Si la sesión expira, el sistema cerrará el acceso y solicitará autenticación nuevamente.

#### Mensajes frecuentes al iniciar sesión

| Mensaje | Significado |
| --- | --- |
| Debes ingresar usuario y contraseña | No se llenó ningún campo. |
| Completa todos los campos | Falta usuario o contraseña. |
| Usuario o contraseña incorrectos | Las credenciales no son válidas. |
| Este usuario no tiene acceso a la página | El usuario existe, pero no tiene rol operativo asignado para esta aplicación. |
| No se pudo validar el usuario | No fue posible comunicarse con el servicio de usuarios. |

### 4. Navegación general

Después de iniciar sesión, la aplicación muestra una barra lateral con las secciones disponibles.

Las opciones principales son:

- **Panel**
- **Profesores**
- **Estudiantes**
- **Documentos**
- **Resolución**
- **Configuración**
- **Perfil**
- **Cerrar sesión**

La disponibilidad de algunas opciones depende del rol:

| Opción | Jefe de departamento | Vicedecano docente | Decano |
| --- | --- | --- | --- |
| Panel | Sí | Sí | Sí |
| Profesores | Sí | Sí | Sí |
| Estudiantes | Sí | Sí | Sí |
| Documentos | No | Sí | Sí |
| Resolución | No | Sí | Sí |
| Configuración | No | Sí | Sí |

### 5. Panel principal

La sección **Panel** muestra un resumen de los registros vigentes.

#### Profesor Principal de Año (PPA)

Muestra los PPA activos dentro del alcance del usuario. Cada registro presenta:

- Nombre y apellidos del profesor.
- Categoría docente.
- Categoría científica.

#### Alumno Ayudante (AA)

Muestra los AA activos dentro del alcance del usuario. Cada registro presenta:

- Nombre completo del estudiante.
- Tutor.
- Número de carnet.

La información se actualiza automáticamente mientras la sección está abierta.

### 6. Gestión de Profesores Principales de Año (PPA)

La sección **Profesores** permite administrar las designaciones de PPA.

#### 6.1 Consultar PPA vigentes

1. Entre en **Profesores**.
2. En la pestaña **Lista** se muestran los PPA vigentes.
3. Cada registro muestra:
   - Nombre y apellidos.
   - Departamento.
   - Carrera.
   - Año académico.

Si no existen registros vigentes, el sistema muestra el mensaje **No hay PPA vigentes**.

#### 6.2 Buscar un PPA

1. Presione el icono de búsqueda.
2. Escriba el nombre o apellidos del profesor.
3. La lista se filtrará automáticamente.
4. Para limpiar la búsqueda, cierre el campo de búsqueda.

La búsqueda no distingue tildes ni mayúsculas.

#### 6.3 Designar un PPA

1. En **Profesores**, presione **Designar**.
2. Seleccione el departamento.
3. Seleccione el profesor.
4. Seleccione la carrera.
5. Seleccione el año académico.
6. El sistema registrará la designación.

Si el profesor ya es PPA, el sistema solicita confirmación antes de permitir asignarlo nuevamente.

En el caso del jefe de departamento, el sistema utiliza directamente su departamento asociado.

#### 6.4 Ratificar un PPA

1. Localice el profesor en la lista.
2. Presione **Ratificar**.
3. Confirme la operación.
4. El sistema mostrará una notificación de éxito si la operación se completa correctamente.

#### 6.5 Desnombrar un PPA

1. Localice el profesor en la lista.
2. Presione **Desnombrar**.
3. Confirme la operación.
4. El PPA dejará de aparecer como vigente.

#### 6.6 Consultar historial de PPA

1. Entre en **Profesores**.
2. Seleccione la pestaña **Historial**.
3. El sistema mostrará los PPA agrupados por curso académico.

#### 6.7 Generar resolución decanal desde Profesores

Disponible para vicedecano docente y decano.

1. Entre en **Profesores**.
2. Presione **Generar Resolución Decanal**.
3. Seleccione el formato:
   - PDF
   - Word
4. El archivo se descargará automáticamente si existen datos suficientes para generarlo.

#### 6.8 Exportar información de PPA

1. Entre en **Profesores**.
2. Presione **Exportar** en la barra superior.
3. Seleccione PDF o Word.
4. El sistema descargará el archivo correspondiente.

### 7. Gestión de Alumnos Ayudantes (AA)

La sección **Estudiantes** permite administrar las designaciones de alumnos ayudantes.

#### 7.1 Consultar AA vigentes

1. Entre en **Estudiantes**.
2. En la pestaña **Lista** se muestran los AA vigentes.
3. Cada registro muestra:
   - Nombre completo.
   - Tutor.
   - Etapa.

Si no existen registros vigentes, el sistema muestra **No hay AA vigentes**.

#### 7.2 Buscar un AA

1. Presione el icono de búsqueda.
2. Escriba el nombre o apellidos del estudiante.
3. La lista se filtrará automáticamente.

La búsqueda no distingue tildes ni mayúsculas.

#### 7.3 Designar un AA

1. En **Estudiantes**, presione **Designar**.
2. Seleccione el estudiante.
3. Seleccione el departamento.
4. Seleccione el tutor.
5. Seleccione la asignatura.
6. Seleccione la etapa:
   - Etapa 1
   - Etapa 2
   - Etapa 3
7. El sistema registrará la designación.

En el caso del jefe de departamento, el sistema utiliza directamente su departamento asociado.

#### 7.4 Ratificar un AA

1. Localice el estudiante en la lista.
2. Presione **Ratificar**.
3. Confirme la operación.
4. El sistema notificará el resultado.

#### 7.5 Desnombrar un AA

1. Localice el estudiante en la lista.
2. Presione **Desnombrar**.
3. Confirme la operación.
4. El AA dejará de aparecer como vigente.

#### 7.6 Consultar historial de AA

1. Entre en **Estudiantes**.
2. Seleccione la pestaña **Historial**.
3. El sistema mostrará los AA agrupados por curso académico.

#### 7.7 Generar resolución decanal desde Estudiantes

Disponible para vicedecano docente y decano.

1. Entre en **Estudiantes**.
2. Presione **Generar Resolución Decanal**.
3. Seleccione PDF o Word.
4. El archivo se descargará automáticamente.

#### 7.8 Exportar información de AA

1. Entre en **Estudiantes**.
2. Presione **Exportar** en la barra superior.
3. Seleccione PDF o Word.
4. El sistema descargará el archivo correspondiente.

### 8. Gestión de Documentos

La sección **Documentos** está disponible para vicedecano docente y decano.

Permite consultar documentos generados en el sistema y generar historiales.

#### 8.1 Consultar documentos generados

1. Entre en **Documentos**.
2. Revise el listado de documentos.
3. Cada documento muestra:
   - Nombre del documento.
   - Tipo: PPA o AA.
   - Periodo.

#### 8.2 Filtrar documentos

Puede filtrar por:

- **Periodo**: todos o un curso específico.
- **Tipo**: todos, PPA o AA.

Al cambiar un filtro, el listado se actualiza automáticamente.

#### 8.3 Descargar documento

1. Localice el documento.
2. Presione **Descargar**.
3. El archivo se descargará en el navegador.

#### 8.4 Generar historial

1. En **Documentos**, presione **Historial**.
2. Seleccione el tipo:
   - PPA
   - AA
3. Seleccione el curso inicial en **Desde**.
4. Seleccione el curso final en **Hasta**.
5. Presione **Generar**.
6. El sistema descargará un PDF con el historial.

El sistema valida que el curso inicial no sea mayor que el curso final.

### 9. Resoluciones

La sección **Resolución** está disponible para vicedecano docente y decano.

Permite ver, editar y exportar la resolución oficial de PPA o AA.

#### 9.1 Seleccionar tipo de resolución

Use las pestañas:

- **Resolución PPA**
- **Resolución AA**

Al cambiar de pestaña, el sistema carga la vista previa correspondiente.

#### 9.2 Editar la vista previa

La resolución se muestra en una vista previa editable.

1. Haga clic sobre los campos resaltados.
2. Modifique el texto necesario.
3. El sistema guarda los cambios automáticamente para la facultad actual.

Los cambios pueden guardarse en el backend o de forma local si el servicio de configuración no está disponible.

#### 9.3 Cambiar logos

Si la plantilla incluye campos de logo editables:

1. Haga clic sobre el logo.
2. Seleccione una imagen PNG o JPG.
3. El sistema subirá y guardará el logo para la facultad actual.
4. La vista previa se actualizará.

#### 9.4 Exportar resolución

1. Seleccione el tipo de resolución: PPA o AA.
2. Revise o edite los campos necesarios.
3. Presione:
   - **PDF** para descargar en PDF.
   - **Word** para descargar en DOCX.

Si no existen datos suficientes para generar el documento, el sistema mostrará una notificación indicando que no hay información disponible.

### 10. Configuración dentro de la aplicación

Disponible para vicedecano docente y decano.

Se accede desde **Configuración** en la barra lateral.

#### 10.1 Usuarios

Muestra los usuarios con acceso en la facultad actual.

Cada registro puede mostrar:

- Usuario.
- Nombre.
- Rol.
- Departamento, si aplica.

Use **Recargar** para actualizar la información.

#### 10.2 Actividad

Muestra la actividad reciente de la facultad, incluyendo acciones relacionadas con:

- Documentos.
- PPA.
- Alumnos ayudantes.

Cada actividad muestra:

- Acción.
- Usuario asociado, si está disponible.
- Descripción.
- Fecha y hora.

#### 10.3 Roles

Permite asignar accesos dentro de la facultad actual.

##### Dar acceso como decano

1. Abra **Configuración**.
2. Entre en la pestaña **Roles**.
3. Seleccione **Decano**.
4. Escriba el usuario.
5. Presione **Dar acceso como decano**.

Si ya existe un decano asignado, el sistema solicita confirmación antes de reemplazarlo.

##### Dar acceso como jefe de departamento

1. Abra **Configuración**.
2. Entre en la pestaña **Roles**.
3. Seleccione **Jefe de departamento**.
4. Escriba el usuario.
5. Seleccione el departamento.
6. Presione **Dar acceso como jefe**.

Si ya existe un jefe para ese departamento, el sistema solicita confirmación antes de reemplazarlo.

### 11. Configuración administrativa desde el inicio de sesión

En la pantalla de inicio de sesión hay un botón de configuración. Esta opción es para usuarios con permiso de administrador.

#### 11.1 Entrar a configuración administrativa

1. En la pantalla de inicio, presione el icono de configuración.
2. Escriba usuario administrador y contraseña.
3. Presione **Entrar a configuración**.

Solo los usuarios con permiso de administrador pueden entrar.

#### 11.2 Asignar vicedecano docente

1. Entre a la configuración administrativa.
2. Seleccione la pestaña **Vicedecanos**.
3. Escriba el usuario.
4. Seleccione la facultad.
5. Presione **Dar acceso**.

Si ya existe un vicedecano docente en esa facultad, el sistema solicita confirmación para reemplazarlo.

#### 11.3 Cambiar administrador del sistema

1. Entre a la configuración administrativa.
2. Seleccione la pestaña **Administrador**.
3. Revise el administrador actual.
4. Escriba el nuevo usuario administrador.
5. Presione **Dar permiso de administrador**.
6. Confirme la operación.

Después del cambio, el administrador anterior deja de tener acceso a esta configuración.

### 12. Perfil de usuario

Para consultar el perfil:

1. Presione el bloque del usuario en la parte inferior de la barra lateral.
2. Seleccione **Perfil**.

El perfil muestra:

- Inicial del usuario.
- Nombre o usuario.
- Rol.
- Usuario.
- Actividad reciente.

### 13. Cerrar sesión

1. Presione el bloque del usuario en la parte inferior de la barra lateral.
2. Seleccione **Cerrar sesión**.
3. El sistema cerrará la sesión y volverá a la pantalla de inicio.

### 14. Notificaciones y confirmaciones

La aplicación utiliza mensajes visuales para informar el resultado de las operaciones.

| Tipo | Uso |
| --- | --- |
| Éxito | La operación se completó correctamente. |
| Advertencia | La operación se completó, pero implica un cambio importante, como un desnombramiento. |
| Error | Ocurrió un problema o faltan datos. |

Las acciones sensibles, como ratificar, desnombrar o reemplazar roles, solicitan confirmación antes de ejecutarse.

### 15. Recomendaciones de uso

- Verifique que el usuario tenga el rol correcto antes de iniciar operaciones.
- Revise la facultad o departamento asociado al usuario antes de designar PPA o AA.
- Use la búsqueda para evitar duplicados o selecciones incorrectas.
- Antes de exportar resoluciones, revise la vista previa editable.
- Descargue y conserve los documentos oficiales generados.
- Si el sistema indica que no hay información suficiente para generar un documento, revise que existan PPA o AA vigentes en el periodo correspondiente.

### 16. Solución de problemas frecuentes

| Situación | Acción recomendada |
| --- | --- |
| No aparece la opción Documentos | Verifique que el usuario no sea jefe de departamento. |
| No aparece la opción Resolución | Verifique que el usuario sea vicedecano docente o decano. |
| No se puede generar un documento | Compruebe que existan datos vigentes para PPA o AA. |
| No aparecen departamentos o facultades | Revise la conexión con el backend y la configuración del usuario. |
| No se puede asignar un rol | Verifique que el usuario exista en la API de usuarios. |
| La búsqueda no muestra resultados | Limpie el campo de búsqueda y revise el nombre escrito. |
| La sesión se cerró | Inicie sesión nuevamente. |

### 17. Glosario

| Término | Significado |
| --- | --- |
| PPA | Profesor Principal de Año. |
| AA | Alumno Ayudante. |
| Ratificar | Confirmar la continuidad de una designación. |
| Desnombrar | Retirar una designación vigente. |
| Resolución decanal | Documento oficial asociado a designaciones académicas. |
| Curso | Periodo académico usado para agrupar registros e historiales. |
| Facultad | Unidad académica principal del usuario. |
| Departamento | Unidad académica asociada a profesores, estudiantes y jefes de departamento. |
