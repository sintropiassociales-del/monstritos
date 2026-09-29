# Plataforma Monstritos A.C.

Plataforma de seguimiento para el **SDQ** (Anexos 7 y 17) y el **Cuestionario Inicial ERI** (Anexos 8 y 18). Incluye datos de familia, visitas familiares, análisis del grupo, el comparativo base → final, un panel de alertas y enlaces para que los niños contesten en tableta.

## Dónde va cada archivo

| Archivo | Destino | Qué hacer |
|---|---|---|
| `index.html` | Repositorio de GitHub (raíz) → GitHub Pages | Plataforma del equipo. Pega la URL de Apps Script en `WEB_APP_URL`. |
| `aplicar.html` | Mismo repositorio de GitHub (raíz) | Página que abren los niños con el enlace. Pega la **misma** URL en `WEB_APP_URL`. |
| `puntuacion.js` | Mismo repositorio de GitHub (raíz) | Reglas de calificación que usan las dos páginas. |
| `logo.png`, `icono.png` | Mismo repositorio de GitHub (raíz) | Logo y favicon. |
| `Code.gs` | Google Apps Script → archivo `Code.gs` | Backend. |
| `Puntuacion.gs` | Google Apps Script → archivo nuevo `Puntuacion.gs` | Mismo contenido que `puntuacion.js`. Tiene que estar en el backend. |
| `LEEME.md` | Repositorio (opcional) | Esta guía. |

## Instalación (una sola vez)

1. **Google Sheet:** crea una hoja nueva en Google Drive (por ejemplo "Plataforma Monstritos – datos").
2. **Apps Script:** en esa hoja abre *Extensiones → Apps Script*.
   - Reemplaza el contenido de `Code.gs` por el archivo `Code.gs`.
   - Crea el archivo *+ → Secuencia de comandos* con el nombre `Puntuacion` y pega `Puntuacion.gs`.
   - En `CONFIG`, arriba de `Code.gs`, revisa `ADMIN_EMAIL`, `ADMIN_PASSWORD_INICIAL` y, si quieres avisos por correo de las alertas, `EMAIL_ALERTAS`.
3. En el editor elige la función **`setup`** y presiona **Ejecutar**. Acepta los permisos que pida. Esto crea las pestañas (Usuarios, Proyectos, Participantes, SDQ, ERI, Familias, Visitas, Enlaces y Alertas) y el usuario administrador.
4. Ve a **Implementar → Nueva implementación → Aplicación web**, con *Ejecutar como: Yo* y *Quién tiene acceso: Cualquier usuario*. Copia la URL que termina en `/exec`.
5. **GitHub:** crea un repositorio (por ejemplo `monstritos-plataforma`) y sube `index.html`, `aplicar.html`, `puntuacion.js`, `logo.png` e `icono.png`. En `index.html` y en `aplicar.html` pega la URL del paso 4 en la línea `var WEB_APP_URL = '...'`.
6. Activa **Settings → Pages → Deploy from branch → main / (root)**. La plataforma queda en `https://TU-USUARIO.github.io/monstritos-plataforma/`.
7. Entra con el correo de `ADMIN_EMAIL` y la contraseña inicial, y **cámbiala en "Mi cuenta"**.

> Si después modificas `Code.gs`, usa *Implementar → Administrar implementaciones → Editar → Nueva versión*. Así la URL no cambia. Si cambias las reglas en `puntuacion.js`, actualiza también `Puntuacion.gs`: deben ser idénticos.

## Cómo se usa

1. **Grupos y proyectos → + Nuevo grupo:** un grupo por escuela, grado y ciclo.
2. **Niñas y niños:** agrega la lista por folio o impórtala desde Excel con la plantilla. El nombre es opcional y nunca aparece en las descargas de los cuestionarios.
3. **SDQ / ERI → + Capturar cuestionario:** transcribe lo que se aplicó en papel. Tienes dos formas de hacerlo:
   - la *captura rápida*: 25 dígitos (0/1/2/x) en el SDQ, o 26 letras en el ERI, como en la hoja "Ingresar Datos";
   - marcar cada respuesta.

   Elige el **momento** (Base o Final).
4. **Validar → Generar descargable:**
   - **Excel** con las mismas hojas que los anexos: Ingresar Datos, Puntuacion, Analisis, Analisis riesgo y Ev. Riesgo.
   - **CSV**.
   - **Informe PDF**: en la vista de impresión elige "Guardar como PDF".
5. **Análisis y comparativo:** distribución Normal / Límite / Anormal (SDQ), Bajo / Medio / Alto por factor (ERI), riesgo global y cambio % base → final.
6. **Enlaces de aplicación:** genera un enlace con código QR para que el grupo conteste en tableta, siempre con un facilitador presente. Cada folio contesta una vez por momento.
7. **Alertas:** cualquier "Sí" en las preguntas 21 o 22 del ERI abre una alerta. Regístrale estatus y seguimiento según el protocolo de canalización.
8. **Instrumentos:** imprime el SDQ, el ERI y la ficha familiar en blanco.

## Reglas de calificación

- **SDQ:** No es verdad = 0, A medias = 1, Verdaderamente sí = 2. Los ítems 7, 11, 14, 21 y 25 se invierten. Hay 5 escalas de 0 a 10 y el total de dificultades va de 0 a 40, con los rangos del Anexo 17. Si faltan 1 o 2 ítems en una escala, el puntaje se prorratea (regla oficial del SDQ); si faltan 3 o más, la escala queda incompleta.
- **ERI:** puntajes por opción, pesos ×2 y factores significativos y críticos idénticos a la hoja DHARTE del Anexo 18. Se verificó que da el mismo resultado en los 143 registros de ejemplo del anexo.
  - **Única diferencia con el Excel:** la fórmula original de "NIVEL DE RIESGO" deja vacíos dos casos (total de 0-14 con algún crítico en 1, y total de 15-38 sin ningún crítico). La plataforma los clasifica como **MEDIO**. Regla completa: ALTO si el total es ≥ 39 o algún crítico vale 2; MEDIO si el total es de 15-38 o algún crítico vale 1; BAJO en cualquier otro caso.
- La pregunta 16 del ERI decía "preguntas 17-23"; en la plataforma se corrigió a **16-23**.
