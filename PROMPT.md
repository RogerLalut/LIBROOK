# 📚 LIBROOK - Registro de Prompts IA

Documento que registra los prompts utilizados durante el desarrollo de LIBROOK, detallando cómo la Inteligencia Artificial ayudó a mejorar funcionalidades, UX/UI, arquitectura y seguridad del proyecto.

# PROMPTS FINALES UTILIZADOS — LIBROOK

---

## 🟣 Prompt Base Principal

```txt
Actúa como un desarrollador senior experto en React, Vite y Bootstrap 5.

Crea una Single Page Application (SPA) moderna y profesional para compra, venta y arriendo de libros, inspirada visualmente en sitios como Buscalibre.com.

La aplicación debe consumir la API pública:
https://openlibrary.org/search.json?q=

Objetivo:
Desarrollar una plataforma responsive de libros donde los usuarios puedan buscar libros, ver detalles, publicar libros propios y administrarlos localmente mediante operaciones CRUD.

Requisitos técnicos obligatorios:

- React con componentes funcionales
- Uso de useState y useEffect
- Consumo de API usando axios o fetch
- Manejo de loading states y error states
- Persistencia de datos usando LocalStorage
- Sincronización inicial entre API y datos locales
- CRUD completo
- Sistema Login y Sign Up simulado
- Validaciones de formularios
- Arquitectura limpia y escalable

Diseño UI/UX:
- Inspirado en Buscalibre
- Responsive
- Bootstrap 5
- Colores Magenta y Amarillo
- Hero section
- Navbar moderna
- Footer profesional
```

---

# 🎨 UI/UX + Marketplace

```txt
Mejorar la experiencia visual y funcional de la SPA.

- Usar colores Magenta y Amarillo
- Diseño tipo marketplace moderno
- Responsive
- Navbar sticky
- Hover effects
- Cards modernas
- Imágenes bien encuadradas usando object-fit: cover
- Carruseles suaves
- Hero section atractiva
- Skeleton loading
```

---

# 📚 Página de Detalle del Libro

```txt
Eliminar completamente las tarjetas flip.

Al presionar “Ver más” navegar a una página dedicada del libro usando React Router.

La página debe mostrar:
- portada grande
- título
- autor
- editorial
- año
- existencias
- resumen
- reseñas
- puntuaciones
- botones:
  - Agregar al carrito
  - Agregar Arriendo
```

---

# 🛒 Carrito y Arriendos

```txt
Crear un carrito general que permita:
- compras
- arriendos

El arriendo NO debe agregarse automáticamente.

Debe existir botón:
- “Agregar Arriendo”

Cada producto debe indicar:
- Compra
- Arriendo

Persistencia usando LocalStorage.
```

---

# 👤 Login, Perfil y Usuario

```txt
Implementar sistema de Login y Sign Up usando LocalStorage.

Agregar:
- perfil usuario
- configuración
- edición perfil
- avatar dinámico consumiendo API pública
- dropdown usuario funcional

Mostrar:
- compras
- arriendos
- favoritos
- publicaciones
```

---

# 🧭 Navbar y Categorías

```txt
Corregir completamente navbar y categorías.

Cada categoría debe:
- navegar correctamente
- filtrar dinámicamente
- actualizar resultados

Agregar:
- Inicio
- Libros Nuevos
- Libros Usados
- Categorías
- E-Books
- Carrito
- Perfil
```

---

# 📖 Filtros Nuevos y Usados

```txt
Corregir filtros de libros nuevos y usados.

- Nuevos:
  mostrar SOLO libros nuevos

- Usados:
  mostrar SOLO libros usados

Agregar badge:
- Nuevo
- Usado
```

---

# 📘 E-Books

```txt
Agregar catálogo de E-Books.

Los E-Books:
- NO deben tener estado nuevo/usado
- Deben tener badge “Digital”
- Deben estar separados de libros físicos

Agregar filtros:
- Físicos
- Digitales
```

---

# 🔎 Buscador y Filtros

```txt
Corregir búsqueda alfabética.

Al presionar una letra:
- mostrar libros cuyo título comience con esa letra

Agregar filtros:
- relevancia
- precio
- recientes

Agregar selector:
- 25
- 50
- 100
- Todos
```

---

# ⚡ Rendimiento y Paginación

```txt
Optimizar rendimiento.

- Mostrar inicialmente solo 25 libros
- Agregar botón:
  “Mostrar más libros”

Al presionar:
- cargar 25 adicionales
- mantener filtros y búsqueda
- evitar recargar toda la página

Agregar:
- lazy loading
- debounce
- skeleton loading
```

---

# 🎠 Recomendados y Carrusel

```txt
Agregar sección:
- “Recomendado para ti”

Implementar carrusel:
- autoplay
- transición suave
- scroll horizontal
- responsive
```

---

# 📝 Publicar Libros

```txt
Mejorar formulario de publicación.

Agregar:
- selector Nuevo/Usado
- precio venta
- precio arriendo opcional

Validar:
- precios negativos
- campos vacíos
- datos inválidos
```

---

# 🛡️ Seguridad y Validaciones

```txt
Implementar seguridad frontend profesional.

Agregar:
- sanitización inputs
- prevención básica XSS
- validaciones robustas
- loading states
- manejo errores

Crear función:
sanitizeInput()

Validar:
- campos vacíos
- correos inválidos
- precios negativos
- longitudes

Mostrar errores visibles usando Bootstrap y toast notifications.
```

---

# ⚠️ Error Handling + Loading

```txt
Implementar manejo profesional de errores.

Usar:
- try/catch
- loading states
- feedback usuario

Mostrar:
- spinner
- skeleton loading
- alertas
- mensajes error

Evitar crashes por datos faltantes.
```

---

# 📱 Responsive Design

```txt
Aplicar diseño responsive completo mobile-first.

Optimizar:
- navbar
- cards
- filtros
- carruseles
- perfil
- carrito

Mantener coherencia visual estilo Buscalibre.
```

---

# 📌 Resultado Final Esperado

```txt
Crear una SPA moderna tipo marketplace de libros con:

- React + Hooks
- CRUD completo
- LocalStorage
- OpenLibrary API
- Login y Perfil
- Carrito y Arriendos
- E-Books
- Responsive Design
- Seguridad frontend
- Error handling
- UX/UI moderna
- Bootstrap 5
- Colores Magenta y Amarillo
```
