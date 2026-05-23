import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Image, FlatList, RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../../src/context/AuthContext';
import { useFavorites } from '../../../src/context/FavoritesContext';
import { useQuery } from '@tanstack/react-query';
import { getCategories, getProducts } from '../../../src/services/products.service';
import { QUERY_KEYS } from '../../../src/constants';
import { Product } from '../../../src/types';

export default function HomeScreen() {
  const { user } = useAuth();
  const { favorites } = useFavorites();
  const router = useRouter();

  const { data: categoriesData, isLoading: loadingCats } = useQuery({
    queryKey: [QUERY_KEYS.CATEGORIES],
    queryFn: getCategories,
  });

  const {
    data: productsData,
    isLoading: loadingProducts,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: [QUERY_KEYS.PRODUCTS, 0],
    queryFn: () => getProducts(10, 0),
  });

  const categories = categoriesData?.slice(0, 6) ?? [];
  const featured = productsData?.products?.slice(0, 6) ?? [];

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor="#3B4FE4" />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>¡Hola, {user?.firstName}! 👋</Text>
          <Text style={styles.subGreeting}>¿Qué vas a comprar hoy?</Text>
        </View>
        {user?.image ? (
          <Image source={{ uri: user.image }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>
              {user?.firstName?.charAt(0)}
            </Text>
          </View>
        )}
      </View>

      {/* Banner */}
      <View style={styles.banner}>
        <View>
          <Text style={styles.bannerSmall}>Hoy tenemos</Text>
          <Text style={styles.bannerTitle}>Envío gratis</Text>
          <Text style={styles.bannerSub}>en compras desde</Text>
          <Text style={styles.bannerAmount}>$50.000</Text>
        </View>
        <Text style={styles.bannerEmoji}>📦</Text>
      </View>

      {/* Categorías */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Categorías</Text>
          <TouchableOpacity onPress={() => router.push('/(app)/(tabs)/explore')}>
            <Text style={styles.seeAll}>Ver todas</Text>
          </TouchableOpacity>
        </View>

        {loadingCats ? (
          <View style={styles.skeletonRow}>
            {[1, 2, 3, 4].map((i) => (
              <View key={i} style={styles.skeletonCat} />
            ))}
          </View>
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat.slug}
                style={styles.categoryCard}
                onPress={() => router.push({ pathname: '/(app)/(tabs)/explore', params: { category: cat.slug } })}
              >
                <Text style={styles.categoryEmoji}>🛍️</Text>
                <Text style={styles.categoryName} numberOfLines={1}>
                  {cat.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>

      {/* Favoritos */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Mis Favoritos</Text>
          <TouchableOpacity onPress={() => router.push('/(app)/(tabs)/favorites')}>
            <Text style={styles.seeAll}>Ver todos</Text>
          </TouchableOpacity>
        </View>

        {favorites.length === 0 ? (
          <View style={styles.emptyFav}>
            <Text style={styles.emptyFavEmoji}>❤️</Text>
            <Text style={styles.emptyFavText}>Aún no tienes favoritos</Text>
            <Text style={styles.emptyFavSub}>Explora productos y agrégalos aquí</Text>
          </View>
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {favorites.slice(0, 5).map((product) => (
              <TouchableOpacity
                key={product.id}
                style={styles.favCard}
                onPress={() => router.push(`/(app)/product/${product.id}`)}
              >
                <Image source={{ uri: product.thumbnail }} style={styles.favImage} />
                <Text style={styles.favTitle} numberOfLines={1}>{product.title}</Text>
                <Text style={styles.favPrice}>${product.price}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>

      {/* Productos destacados */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Productos destacados</Text>
          <TouchableOpacity onPress={() => router.push('/(app)/(tabs)/explore')}>
            <Text style={styles.seeAll}>Ver todos</Text>
          </TouchableOpacity>
        </View>

        {loadingProducts ? (
          <View style={styles.skeletonRow}>
            {[1, 2, 3].map((i) => (
              <View key={i} style={styles.skeletonProduct} />
            ))}
          </View>
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {featured.map((product: Product) => (
              <TouchableOpacity
                key={product.id}
                style={styles.featuredCard}
                onPress={() => router.push(`/(app)/product/${product.id}`)}
              >
                <Image source={{ uri: product.thumbnail }} style={styles.featuredImage} />
                <Text style={styles.featuredTitle} numberOfLines={2}>{product.title}</Text>
                <Text style={styles.featuredPrice}>${product.price}</Text>
                <View style={styles.ratingRow}>
                  <Text style={styles.star}>⭐</Text>
                  <Text style={styles.ratingText}>{product.rating}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>

      <View style={{ height: 20 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F6FA' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: '#fff',
  },
  greeting: { fontSize: 20, fontWeight: '700', color: '#1A1A2E' },
  subGreeting: { fontSize: 13, color: '#888', marginTop: 2 },
  avatar: { width: 44, height: 44, borderRadius: 22 },
  avatarPlaceholder: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: '#3B4FE4', justifyContent: 'center', alignItems: 'center',
  },
  avatarText: { color: '#fff', fontWeight: '700', fontSize: 18 },
  banner: {
    margin: 16, borderRadius: 16, backgroundColor: '#3B4FE4',
    padding: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  bannerSmall: { color: 'rgba(255,255,255,0.8)', fontSize: 12 },
  bannerTitle: { color: '#fff', fontSize: 22, fontWeight: '800' },
  bannerSub: { color: 'rgba(255,255,255,0.8)', fontSize: 12 },
  bannerAmount: { color: '#FFD700', fontSize: 18, fontWeight: '700' },
  bannerEmoji: { fontSize: 52 },
  section: { marginTop: 8, backgroundColor: '#fff', paddingVertical: 16 },
  sectionHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', paddingHorizontal: 20, marginBottom: 12,
  },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#1A1A2E' },
  seeAll: { fontSize: 13, color: '#3B4FE4', fontWeight: '600' },
  categoryCard: {
    alignItems: 'center', marginLeft: 16, backgroundColor: '#F0F2FF',
    borderRadius: 12, padding: 12, width: 80,
  },
  categoryEmoji: { fontSize: 28, marginBottom: 4 },
  categoryName: { fontSize: 11, color: '#333', fontWeight: '600', textAlign: 'center' },
  emptyFav: { alignItems: 'center', paddingVertical: 24, paddingHorizontal: 20 },
  emptyFavEmoji: { fontSize: 40, marginBottom: 8 },
  emptyFavText: { fontSize: 15, fontWeight: '600', color: '#333' },
  emptyFavSub: { fontSize: 12, color: '#888', marginTop: 4 },
  favCard: {
    marginLeft: 16, width: 110, backgroundColor: '#F9F9F9',
    borderRadius: 12, padding: 10,
  },
  favImage: { width: '100%', height: 80, borderRadius: 8, resizeMode: 'cover' },
  favTitle: { fontSize: 12, fontWeight: '600', color: '#333', marginTop: 6 },
  favPrice: { fontSize: 13, fontWeight: '700', color: '#3B4FE4', marginTop: 2 },
  featuredCard: {
    marginLeft: 16, width: 140, backgroundColor: '#F9F9F9',
    borderRadius: 12, padding: 10,
  },
  featuredImage: { width: '100%', height: 100, borderRadius: 8, resizeMode: 'cover' },
  featuredTitle: { fontSize: 12, fontWeight: '600', color: '#333', marginTop: 6 },
  featuredPrice: { fontSize: 13, fontWeight: '700', color: '#3B4FE4', marginTop: 2 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  star: { fontSize: 11 },
  ratingText: { fontSize: 11, color: '#888', marginLeft: 2 },
  skeletonRow: { flexDirection: 'row', paddingHorizontal: 16 },
  skeletonCat: {
    width: 80, height: 80, borderRadius: 12,
    backgroundColor: '#E0E0E0', marginRight: 12,
  },
  skeletonProduct: {
    width: 140, height: 160, borderRadius: 12,
    backgroundColor: '#E0E0E0', marginRight: 12,
  },
});
