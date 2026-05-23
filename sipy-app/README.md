# SIPY App - Prueba Técnica React Native

App fintech mobile construida con React Native + Expo.

## Credenciales de prueba

- **Usuario:** emilys
- **Password:** emilyspass

## Instalación

```bash
npm install
npx expo start
```

## Tecnologías

- React Native + Expo Router
- TypeScript
- React Query (@tanstack/react-query)
- React Context (Auth + Favorites)
- AsyncStorage
- DummyJSON API

## Decisiones técnicas

**Expo Router** sobre React Navigation puro: file-based routing más limpio y mantenible.

**React Query con useInfiniteQuery** para paginación infinita en la lista de productos, con cache automático y pull-to-refresh.

**AuthContext** maneja sesión global: login, logout, restoreSession con AsyncStorage opcional ("Recordar sesión").

**FavoritesContext** persiste favoritos en AsyncStorage y los expone globalmente.

**Separación clara**: React Query para datos remotos, Context para estado de sesión y favoritos locales.

## Estructura

```
app/
  (auth)/login.tsx          # Login con validaciones
  (app)/(tabs)/home.tsx     # Dashboard
  (app)/(tabs)/explore.tsx  # Productos con filtros y paginación
  (app)/(tabs)/favorites.tsx
  (app)/(tabs)/profile.tsx
  (app)/product/[id].tsx    # Detalle con galería y compartir
src/
  context/   # AuthContext, FavoritesContext
  services/  # auth.service, products.service
  types/     # TypeScript types
  constants/ # API_BASE_URL, QUERY_KEYS, STORAGE_KEYS
```

## Funcionalidades implementadas

- Login con validaciones de campos, credenciales permitidas, show/hide password y "Recordar sesión"
- Navegación protegida: redirige a login si no hay sesión activa
- Home con saludo dinámico, banner, categorías, favoritos y productos destacados
- Explorar con FlatList, búsqueda por texto, filtros por categoría, ordenamiento (precio, rating, nombre) e infinite scroll
- Detalle de producto con galería de imágenes, rating, stock, descuento y compartir por WhatsApp
- Favoritos persistidos con AsyncStorage
- Perfil con datos del usuario y cierre de sesión
