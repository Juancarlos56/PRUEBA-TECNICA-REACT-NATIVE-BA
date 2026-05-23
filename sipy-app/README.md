# SIPY App — Prueba Técnica React Native

App mobile fintech construida con React Native + Expo, simulando funcionalidades reales de una plataforma de e-commerce moderna estilo Sipy.

---

## Demo

![Demo SIPY](./assets/demo-sipy-app.gif)

---

## Credenciales de prueba

| Campo    | Valor        |
| -------- | ------------ |
| Usuario  | `emilys`     |
| Password | `emilyspass` |

> Las credenciales están validadas tanto en el formulario (antes de llamar a la API) como contra la respuesta del servidor.

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

Además necesitas una de estas opciones para correr la app:

- **Expo Go** instalado en tu dispositivo físico ([iOS](https://apps.apple.com/app/expo-go/id982107779) / [Android](https://play.google.com/store/apps/details?id=host.exp.exponent))
- **Simulador iOS** (requiere Xcode en Mac)
- **Emulador Android** (requiere Android Studio)

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

### 3. Levantar el servidor de desarrollo

```bash
npx expo start
```

### 4. Abrir la app

Una vez corriendo el servidor, tienes estas opciones:

| Plataforma         | Acción                      |
| ------------------ | --------------------------- |
| iOS Simulator      | Presiona `i` en la terminal |
| Android Emulator   | Presiona `a` en la terminal |
| Dispositivo físico | Escanea el QR con Expo Go   |
| Navegador web      | Presiona `w` en la terminal |

### Scripts disponibles

```bash
npm start          # Inicia el servidor de desarrollo
npm run ios        # Abre directamente en simulador iOS
npm run android    # Abre directamente en emulador Android
npm run web        # Abre en navegador
```

---

## Stack tecnológico

| Tecnología                                | Versión          | Uso                                |
| ----------------------------------------- | ---------------- | ---------------------------------- |
| React Native                              | 0.85.3           | Framework mobile multiplataforma   |
| Expo                                      | ~56.0.3          | Plataforma y tooling de desarrollo |
| Expo Router                               | ~56.2.5          | Navegación file-based              |
| TypeScript                                | ~6.0.3           | Tipado estático                    |
| @tanstack/react-query                     | ^5.100.13        | Estado remoto, cache, paginación   |
| @react-native-async-storage/async-storage | 2.2.0            | Persistencia local                 |
| @expo/vector-icons (Ionicons)             | incluido en Expo | Iconografía                        |
| @react-navigation/native                  | ^7.2.4           | Navegación base                    |
| @react-navigation/bottom-tabs             | ^7.16.1          | Tabs inferiores                    |
| @react-navigation/native-stack            | ^7.15.1          | Stack de pantallas                 |
| react-native-safe-area-context            | ~5.7.0           | Áreas seguras del dispositivo      |
| react-native-screens                      | 4.25.1           | Optimización de pantallas nativas  |

---

## API utilizada

**DummyJSON** — [https://dummyjson.com](https://dummyjson.com)

Base URL: `https://dummyjson.com`

| Flujo                   | Método | Endpoint                     | Descripción                         |
| ----------------------- | ------ | ---------------------------- | ----------------------------------- |
| Login                   | POST   | `/auth/login`                | Autenticar usuario y obtener tokens |
| Validar sesión          | GET    | `/auth/me`                   | Verificar token y restaurar sesión  |
| Listado de productos    | GET    | `/products?limit=20&skip=0`  | Productos con paginación            |
| Detalle de producto     | GET    | `/products/{id}`             | Información completa de un producto |
| Categorías              | GET    | `/products/categories`       | Lista de 24 categorías disponibles  |
| Productos por categoría | GET    | `/products/category/{slug}`  | Filtrar productos por categoría     |
| Búsqueda                | GET    | `/products/search?q={query}` | Buscar productos por texto          |

---

## Arquitectura del proyecto

### Estructura de carpetas

```
sipy-app/
├── app/                              # Rutas de la app (Expo Router)
│   ├── _layout.tsx                   # Root layout — monta todos los Providers
│   ├── index.tsx                     # Splash screen + lógica de redirect
│   ├── (auth)/                       # Grupo de rutas públicas (sin sesión)
│   │   ├── _layout.tsx               # Layout del stack de autenticación
│   │   └── login.tsx                 # Pantalla de login
│   └── (app)/                        # Grupo de rutas protegidas (con sesión)
│       ├── _layout.tsx               # Guard de navegación — redirige si no hay sesión
│       ├── (tabs)/                   # Navegación por tabs
│       │   ├── _layout.tsx           # Configuración del Bottom Tab Navigator
│       │   ├── home.tsx              # Tab Inicio — Dashboard principal
│       │   ├── explore.tsx           # Tab Explorar — Lista de productos
│       │   ├── favorites.tsx         # Tab Favoritos — Productos guardados
│       │   ├── cart.tsx              # Tab Carrito — Placeholder
│       │   └── profile.tsx           # Tab Perfil — Datos del usuario y logout
│       └── product/
│           └── [id].tsx              # Pantalla dinámica de detalle de producto
├── src/
│   ├── context/
│   │   ├── AuthContext.tsx           # Sesión global: login, logout, restoreSession
│   │   └── FavoritesContext.tsx      # Favoritos globales con persistencia
│   ├── services/
│   │   ├── auth.service.ts           # loginService, getMeService
│   │   └── products.service.ts       # getProducts, getProductById, getCategories, etc.
│   ├── components/
│   │   └── SkeletonLoader.tsx        # Skeletons animados reutilizables
│   ├── types/
│   │   └── index.ts                  # Tipos TypeScript: AuthUser, Product, Category
│   └── constants/
│       ├── index.ts                  # API_BASE_URL, QUERY_KEYS, STORAGE_KEYS, ALLOWED_CREDENTIALS
│       └── categories.ts             # Mapeo de categorías a iconos y colores
├── .gitignore
├── app.json
├── package.json
├── tsconfig.json
└── README.md
```

---

## Navegación y rutas

### Flujo de navegación

```
app/index.tsx (Splash)
    │
    ├── isLoading = true  →  Muestra splash animado
    │
    ├── isAuthenticated = false  →  /(auth)/login
    │                                    │
    │                                    └── Login exitoso → /(app)/(tabs)/home
    │
    └── isAuthenticated = true   →  /(app)/(tabs)/home
```

### Navegación protegida

El archivo `app/(app)/_layout.tsx` actúa como **guard de navegación**. Monitorea `isAuthenticated` del `AuthContext` y redirige automáticamente a `/login` si el usuario no tiene sesión activa. Esto previene acceso directo a rutas protegidas.

```
/(app)/_layout.tsx  ←  useEffect watch isAuthenticated
    │
    ├── isAuthenticated = false  →  router.replace('/(auth)/login')
    └── isAuthenticated = true   →  renderiza children normalmente
```

### Estructura de tabs

```
Bottom Tab Navigator
    ├── home        →  Inicio      (Ionicons: home / home-outline)
    ├── explore     →  Explorar    (Ionicons: search / search-outline)
    ├── favorites   →  Favoritos   (Ionicons: heart / heart-outline)
    ├── cart        →  Carrito     (Ionicons: cart / cart-outline)
    └── profile     →  Perfil      (Ionicons: person / person-outline)
```

### Navegación dinámica

```
/(app)/product/[id]  ←  Ruta dinámica, recibe el ID del producto
```

Se accede desde Explorar, Home (productos destacados y favoritos) y Favoritos mediante:

```tsx
router.push(`/(app)/product/${product.id}`);
```

---

## Providers y estado global

El árbol de providers en `app/_layout.tsx` es:

```
QueryClientProvider          ← React Query: cache y estado remoto
  └── AuthProvider           ← Sesión: user, tokens, isAuthenticated
        └── FavoritesProvider  ← Favoritos globales con AsyncStorage
              └── Stack Navigator
```

### AuthContext

Maneja el estado global de autenticación:

```typescript
type AuthContextValue = {
  user: AuthUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  authError: string | null;
  login: (username, password, remember) => Promise<boolean>;
  logout: () => Promise<void>;
  restoreSession: () => Promise<void>;
};
```

**Flujo de `restoreSession`:** Al iniciar la app, busca el token en AsyncStorage. Si existe, llama a `GET /auth/me` para validarlo y restaurar la sesión automáticamente. Si falla, limpia el storage y redirige al login.

**Flujo de `login`:** Primero valida las credenciales localmente contra `ALLOWED_CREDENTIALS`. Si coinciden, llama a `POST /auth/login`. Si el usuario marcó "Recordar sesión", persiste el token y datos en AsyncStorage.

### FavoritesContext

Maneja los favoritos del usuario:

```typescript
type FavoritesContextValue = {
  favorites: Product[];
  isFavorite: (id: number) => boolean;
  toggleFavorite: (product: Product) => void;
  clearFavorites: () => void;
};
```

Los favoritos se cargan de AsyncStorage al montar el provider y se sincronizan automáticamente con cada cambio.

---

## React Query — Queries implementadas

| Query Key                       | Función                                 | Pantalla           |
| ------------------------------- | --------------------------------------- | ------------------ |
| `['categories']`                | `getCategories()`                       | Home, Explore      |
| `['products', 0]`               | `getProducts(10, 0)`                    | Home               |
| `['products', category]`        | `getProducts` / `getProductsByCategory` | Explore (infinite) |
| `['products', 'search', query]` | `searchProducts(query)`                 | Explore            |
| `['product-detail', id]`        | `getProductById(id)`                    | Detalle            |

**useMutation** para login:

```typescript
const loginMutation = useMutation({
  mutationFn: () => login(username, password, remember),
});
```

**useInfiniteQuery** para paginación en Explorar:

```typescript
useInfiniteQuery({
  queryKey: [QUERY_KEYS.PRODUCTS, selectedCategory],
  queryFn: ({ pageParam = 0 }) => getProducts(LIMIT, pageParam),
  getNextPageParam: (lastPage) => {
    const nextSkip = lastPage.skip + lastPage.limit;
    return nextSkip < lastPage.total ? nextSkip : undefined;
  },
});
```

---

## Pantallas y funcionalidades

### Splash Screen (`app/index.tsx`)

- Pantalla azul animada con logo SIPY
- Ejecuta `restoreSession()` automáticamente
- Redirige a Home o Login según el estado de sesión
- Muestra "Restaurando sesión..." o "Cargando..." según el estado

### Login (`app/(auth)/login.tsx`)

- `useMutation` de React Query para el submit
- Validaciones de campos antes de llamar a la API:
  - Usuario obligatorio y sin espacios
  - Contraseña obligatoria, mínimo 8 caracteres, sin espacios ni caracteres especiales
- Validación contra credenciales permitidas (`emilys` / `emilyspass`)
- Botón deshabilitado mientras el formulario es inválido
- Loading state que previene doble submit
- Show/hide contraseña con Ionicons
- Checkbox "Recordar sesión" que persiste la sesión en AsyncStorage
- Mensajes de error por campo y error general
- Links decorativos "¿Olvidaste tu contraseña?" y "¿No tienes cuenta? Regístrate"

### Home (`app/(app)/(tabs)/home.tsx`)

- Header azul con menú hamburguesa, saludo dinámico y campana de notificaciones
- Buscador integrado en el header que navega a Explorar con el query
- Banner promocional de envío gratis
- Sección **Categorías**: scroll horizontal con 8 categorías, cada una con ícono Ionicons y color de fondo único por categoría
- Sección **Mis Favoritos**: muestra los últimos 5 favoritos o empty state con ícono
- Sección **Productos destacados**: scroll horizontal con los primeros 6 productos
- Skeleton loaders animados en categorías y productos destacados
- Pull to refresh

### Explorar (`app/(app)/(tabs)/explore.tsx`)

- FlatList con grid de 2 columnas optimizado con `useCallback` y `useMemo`
- Skeleton loaders animados en carga inicial
- Buscador por texto con botón limpiar
- Botón de ordenamiento con opciones: Relevancia, Menor precio, Mayor precio, Rating, Nombre
- **Chips de categorías siempre visibles** — no desaparecen al seleccionar
- El título del header cambia al nombre de la categoría seleccionada
- Paginación infinita con `useInfiniteQuery` y carga automática al llegar al final
- Pull to refresh
- Badge "Poco stock" cuando stock < 10
- Toggle de favorito por producto con Ionicons
- Empty state cuando no hay resultados

### Detalle (`app/(app)/product/[id].tsx`)

- Header con botón volver, compartir y favorito usando Ionicons
- Galería de imágenes con selector de miniaturas, imagen principal grande y dots indicadores
- Título, precio, categoría, rating con estrella dorada
- Badge de stock con ícono (verde "En stock" / naranja "Poco stock")
- Banner de descuento con precio original tachado
- Descripción expandible "Ver más / Ver menos"
- Tabla de información adicional: marca, categoría, stock
- Botón "Compartir por WhatsApp" con ícono de WhatsApp usando `Share` nativo
- Estado de error con botón "Reintentar"
- Estado de loading con spinner

### Favoritos (`app/(app)/(tabs)/favorites.tsx`)

- FlatList con todos los favoritos persistidos
- Contador de productos guardados
- Imagen con `resizeMode: contain` para mostrar el producto completo
- Rating con estrella Ionicons dorada
- Botón corazón para quitar de favoritos
- Botón "Limpiar" con confirmación Alert
- Empty state con ícono y botón para ir a Explorar

### Perfil (`app/(app)/(tabs)/profile.tsx`)

- Avatar del usuario desde la API o placeholder con inicial
- Nombre completo, username y email
- Stats row: Favoritos, Pedidos, Reseñas
- Accesos rápidos con iconos de colores por sección
- Información de cuenta con iconos Ionicons
- Botón "Cerrar sesión" con confirmación Alert que limpia Context y AsyncStorage

---

## Skeletons animados (`src/components/SkeletonLoader.tsx`)

Componentes reutilizables con animación de pulso (opacidad 0.3 → 1 en loop):

| Componente                 | Uso                                             |
| -------------------------- | ----------------------------------------------- |
| `<Skeleton />`             | Base configurable (width, height, borderRadius) |
| `<ProductCardSkeleton />`  | Card individual de producto                     |
| `<ProductListSkeleton />`  | Grid completo de 6 cards                        |
| `<HomeCategorySkeleton />` | Fila de 4 categorías en Home                    |
| `<HomeFeaturedSkeleton />` | Fila de 3 productos destacados en Home          |

---

## Mapeo de categorías (`src/constants/categories.ts`)

Cada una de las 24 categorías de DummyJSON tiene asignado:

- **ícono Ionicons** relevante a la categoría
- **color** del ícono
- **color de fondo** del contenedor

```typescript
export const CATEGORY_META = {
  beauty: { icon: "sparkles-outline", color: "#E91E8C", bg: "#FCE4F3" },
  smartphones: {
    icon: "phone-portrait-outline",
    color: "#3B4FE4",
    bg: "#E8EAFF",
  },
  laptops: { icon: "laptop-outline", color: "#2196F3", bg: "#E3F2FD" },
  // ... 21 categorías más
};
```

---

## Decisiones técnicas

### Expo Router vs React Navigation puro

Se eligió **Expo Router** porque su sistema de routing basado en archivos (file-based) hace que la estructura de rutas sea inmediatamente comprensible — cada archivo en `/app` es una ruta. Simplifica la navegación protegida, el manejo de parámetros dinámicos (`[id].tsx`) y los layouts anidados.

### React Query para datos remotos

**React Query** maneja todo el estado remoto: fetching, caching, revalidación, paginación y estados de loading/error. Ventajas clave:

- `useInfiniteQuery` hace que la paginación infinita sea declarativa y sin boilerplate
- `useMutation` para el login expone `isPending` nativamente, eliminando la necesidad de estado local de loading
- El cache automático evita re-fetches innecesarios al navegar entre pantallas

### AuthContext separado de React Query

Los tokens y datos de sesión son **estado de la aplicación**, no datos remotos cacheables. Viven en Context porque necesitan estar disponibles síncronamente en cualquier componente y persistir entre renders. React Query no es la herramienta correcta para esto.

### FavoritesContext con AsyncStorage

Los favoritos son **preferencias locales del usuario**. No tienen endpoint en la API, por lo que se gestionan completamente en el cliente. AsyncStorage garantiza que persisten entre sesiones sin necesidad de sincronización con el servidor.

### Separación clara de responsabilidades

```
React Query  →  datos remotos (productos, categorías, detalle)
Context      →  estado global de la app (sesión, favoritos)
AsyncStorage →  persistencia entre sesiones (tokens, favoritos)
```

### FlatList con optimizaciones de performance

La lista de productos usa `useCallback` en `renderItem` para evitar re-renders innecesarios, `numColumns={2}` para el grid, `onEndReached` para paginación automática y `refreshControl` para pull-to-refresh.

### Skeletons en lugar de spinners

Los skeletons comunican la estructura de la pantalla antes de que carguen los datos, evitan saltos de layout y ofrecen una experiencia visual más profesional y menos ansiosa que un spinner centrado.

### Ionicons para iconografía

Se migró de emojis a **@expo/vector-icons (Ionicons)** para consistencia visual, control total de tamaño y color, mejor integración con los estados activo/inactivo de la navbar y apariencia más profesional en todas las plataformas.

---

## Variables de entorno y constantes

```typescript
// src/constants/index.ts
export const API_BASE_URL = "https://dummyjson.com";

export const ALLOWED_CREDENTIALS = {
  username: "emilys",
  password: "emilyspass",
};

export const STORAGE_KEYS = {
  ACCESS_TOKEN: "@sipy:accessToken",
  REFRESH_TOKEN: "@sipy:refreshToken",
  USER: "@sipy:user",
  FAVORITES: "@sipy:favorites",
};

export const QUERY_KEYS = {
  PRODUCTS: "products",
  PRODUCT_DETAIL: "product-detail",
  CATEGORIES: "categories",
  PRODUCTS_BY_CATEGORY: "products-by-category",
  SESSION: "session",
};
```
