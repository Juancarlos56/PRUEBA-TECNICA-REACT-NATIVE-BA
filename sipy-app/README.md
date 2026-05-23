# SIPY App — Prueba Técnica React Native

App mobile fintech construida con React Native + Expo, simulando funcionalidades reales de una plataforma de e-commerce moderna.

---

## Demo

![Demo SIPY](./assets/demo-app.gif)

## Credenciales de prueba

| Campo    | Valor        |
| -------- | ------------ |
| Usuario  | `emilys`     |
| Password | `emilyspass` |

---

## Requisitos previos

| Herramienta  | Versión utilizada |
| ------------ | ----------------- |
| Node.js      | v22.6.0           |
| npm          | 10.8.2            |
| Expo CLI     | 56.1.10           |
| React Native | 0.85.3            |
| React        | 19.2.3            |
| TypeScript   | ~6.0.3            |

Además necesitas:

- [Expo Go](https://expo.dev/client) instalado en tu dispositivo físico, **o**
- Simulador de iOS (Xcode) / Android Studio configurado

---

## Instalación y ejecución

### 1. Clonar el repositorio

```bash
git clone TU_REPO_URL
cd sipy-app
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Levantar el proyecto

```bash
npx expo start
```

Esto abrirá el **Expo Dev Server**. Desde ahí puedes:

| Opción                    | Comando                     |
| ------------------------- | --------------------------- |
| Abrir en simulador iOS    | Presiona `i`                |
| Abrir en emulador Android | Presiona `a`                |
| Abrir en navegador        | Presiona `w`                |
| Escanear QR con Expo Go   | Escanea el QR con la cámara |

---

## Stack tecnológico

| Tecnología                                | Versión   | Uso                               |
| ----------------------------------------- | --------- | --------------------------------- |
| React Native                              | 0.85.3    | Framework mobile                  |
| Expo                                      | ~56.0.3   | Plataforma de desarrollo          |
| Expo Router                               | ~56.2.5   | Navegación file-based             |
| TypeScript                                | ~6.0.3    | Tipado estático                   |
| @tanstack/react-query                     | ^5.100.13 | Estado remoto, cache y paginación |
| @react-native-async-storage/async-storage | 2.2.0     | Persistencia local                |
| @react-navigation/native                  | ^7.2.4    | Navegación base                   |
| @react-navigation/bottom-tabs             | ^7.16.1   | Navegación por tabs               |
| @react-navigation/native-stack            | ^7.15.1   | Navegación en stack               |
| react-native-safe-area-context            | ~5.7.0    | Áreas seguras en pantalla         |
| react-native-screens                      | 4.25.1    | Optimización de pantallas nativas |

---

## API utilizada

**DummyJSON** — [https://dummyjson.com](https://dummyjson.com)

| Flujo                   | Método | Endpoint                        |
| ----------------------- | ------ | ------------------------------- |
| Login                   | POST   | `/auth/login`                   |
| Validar sesión          | GET    | `/auth/me`                      |
| Listado de productos    | GET    | `/products?limit=20&skip=0`     |
| Detalle de producto     | GET    | `/products/{id}`                |
| Categorías              | GET    | `/products/categories`          |
| Productos por categoría | GET    | `/products/category/{category}` |
| Búsqueda                | GET    | `/products/search?q={query}`    |

---

## Estructura del proyecto

```
sipy-app/
├── app/
│   ├── index.tsx                    # Splash screen + redirect según sesión
│   ├── _layout.tsx                  # Root layout con Providers
│   ├── (auth)/
│   │   ├── _layout.tsx
│   │   └── login.tsx                # Login con validaciones y useMutation
│   └── (app)/
│       ├── _layout.tsx              # Navegación protegida
│       ├── (tabs)/
│       │   ├── _layout.tsx          # Bottom tabs navbar
│       │   ├── home.tsx             # Dashboard principal
│       │   ├── explore.tsx          # Lista de productos con filtros
│       │   ├── favorites.tsx        # Favoritos persistidos
│       │   └── profile.tsx          # Perfil y logout
│       └── product/
│           └── [id].tsx             # Detalle de producto
├── src/
│   ├── context/
│   │   ├── AuthContext.tsx          # Sesión global: login, logout, restoreSession
│   │   └── FavoritesContext.tsx     # Favoritos globales con AsyncStorage
│   ├── services/
│   │   ├── auth.service.ts          # loginService, getMeService
│   │   └── products.service.ts      # getProducts, getProductById, etc.
│   ├── components/
│   │   └── SkeletonLoader.tsx       # Skeletons animados reutilizables
│   ├── types/
│   │   └── index.ts                 # AuthUser, Product, Category, etc.
│   └── constants/
│       └── index.ts                 # API_BASE_URL, QUERY_KEYS, STORAGE_KEYS
└── README.md
```

---

## Funcionalidades implementadas

### 🔐 Autenticación

- Login con validaciones completas de campos
- Validación contra credenciales permitidas antes de llamar a la API
- Show/hide password
- Checkbox "Recordar sesión" con persistencia en AsyncStorage
- Botón deshabilitado mientras el formulario es inválido
- Loading state con `useMutation` de React Query
- Prevención de doble submit

### 🏠 Home

- Saludo dinámico con nombre del usuario desde AuthContext
- Avatar del usuario desde la API
- Banner promocional
- Sección de categorías con skeleton loader
- Sección de favoritos (con empty state si no hay)
- Sección de productos destacados con skeleton loader
- Pull to refresh

### 🔍 Explorar

- FlatList con grid de 2 columnas optimizado con `useCallback` y `memo`
- Skeleton loaders animados durante la carga inicial
- Búsqueda por texto en tiempo real
- Filtros por categoría como chips horizontales
- Ordenamiento por: relevancia, menor precio, mayor precio, rating, nombre
- Paginación infinita con `useInfiniteQuery`
- Pull to refresh
- Empty state cuando no hay resultados
- Badge de "Poco stock" cuando stock < 10
- Toggle de favorito por producto

### 📦 Detalle de producto

- Galería de imágenes con selector de miniaturas y dots indicadores
- Título, precio, rating, stock disponible
- Badge de descuento con precio original tachado
- Descripción expandible "Ver más / Ver menos"
- Información adicional: marca, categoría, stock
- Toggle favorito
- Compartir producto por WhatsApp con `Share` nativo de iOS/Android
- Estado de error con botón "Reintentar"

### ❤️ Favoritos

- Lista persistida en AsyncStorage
- Contador de productos guardados
- Navegación al detalle desde cada item
- Toggle para quitar favorito
- Botón "Limpiar todos" con confirmación
- Empty state con botón para ir a Explorar

### 👤 Perfil

- Avatar y datos del usuario desde AuthContext
- Stats: favoritos, pedidos, reseñas
- Accesos rápidos a secciones
- Información de cuenta
- Logout con confirmación, limpieza de Context y AsyncStorage

### 💀 Skeletons

- `Skeleton` base con animación de pulso
- `ProductCardSkeleton` para cards de productos
- `ProductListSkeleton` para el grid completo
- `HomeCategorySkeleton` para la sección de categorías
- `HomeFeaturedSkeleton` para productos destacados

---

## Decisiones técnicas

**Expo Router** sobre React Navigation puro: routing file-based más limpio, mantenible y alineado con las convenciones modernas de Expo.

**React Query con `useInfiniteQuery`** para la lista de productos: maneja automáticamente la paginación, cache, revalidación y estados de loading/error sin duplicar lógica.

**`useMutation` para el login**: consistente con el patrón de React Query para mutaciones, expone `isPending`, `isError` y evita doble submit de forma nativa.

**AuthContext separado de React Query**: los datos de sesión (token, usuario autenticado) son estado global de la app, no datos remotos cacheables. Context es la herramienta correcta para esto.

**FavoritesContext con AsyncStorage**: los favoritos son preferencias locales del usuario, no datos del servidor. Se persisten localmente y se exponen globalmente sin necesidad de llamadas a la API.

**Separación clara de responsabilidades**:

- React Query → datos remotos (productos, categorías, detalle)
- Context → estado global de sesión y favoritos locales
- AsyncStorage → persistencia entre sesiones

**Skeletons animados** en lugar de spinners: mejor experiencia de usuario, evita saltos de layout y comunica la estructura de la pantalla antes de que carguen los datos.

---

## Scripts disponibles

```bash
npm start          # Inicia el servidor de desarrollo
npm run ios        # Abre en simulador iOS
npm run android    # Abre en emulador Android
npm run web        # Abre en navegador
```
