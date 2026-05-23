import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Image, RefreshControl, TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../../src/context/AuthContext';
import { useFavorites } from '../../../src/context/FavoritesContext';
import { useQuery } from '@tanstack/react-query';
import { getCategories, getProducts } from '../../../src/services/products.service';
import { QUERY_KEYS } from '../../../src/constants';
import { Product } from '../../../src/types';
import { HomeCategorySkeleton, HomeFeaturedSkeleton } from '../../../src/components/SkeletonLoader';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';

export default function HomeScreen() {
  const { user } = useAuth();
  const { favorites } = useFavorites();
  const router = useRouter();
  const [search, setSearch] = useState('');

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

  const handleSearch = () => {
    if (search.trim()) {
      router.push({ pathname: '/(app)/(tabs)/explore', params: { q: search.trim() } });
    }
  };

  return (
    <View style={styles.container}>
      {/* Header azul */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerBtn}>
          <Ionicons name="menu" size={26} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>¡Hola, {user?.firstName}! 👋</Text>
        <TouchableOpacity style={styles.headerBtn}>
          <Ionicons name="notifications-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Buscador */}
      <View style={styles.searchWrapper}>
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={18} color="#999" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar productos..."
            placeholderTextColor="#999"
            value={search}
            onChangeText={setSearch}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Ionicons name="close-circle" size={18} color="#ccc" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor="#3B4FE4" />
        }
      >
        {/* Banner */}
        <View style={styles.bannerWrapper}>
          <View style={styles.banner}>
            <View>
              <Text style={styles.bannerSmall}>Hoy tenemos</Text>
              <Text style={styles.bannerTitle}>Envío gratis</Text>
              <Text style={styles.bannerSub}>en compras desde</Text>
              <Text style={styles.bannerAmount}>$50.000</Text>
            </View>
            <Text style={styles.bannerEmoji}>📦</Text>
          </View>
          <View style={styles.dotsRow}>
            <View style={[styles.dot, styles.dotActive]} />
            <View style={styles.dot} />
            <View style={styles.dot} />
          </View>
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
            <HomeCategorySkeleton />
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesContent}>
              {categories.map((cat) => (
                <TouchableOpacity
                  key={cat.slug}
                  style={styles.categoryCard}
                  onPress={() =>
                    router.push({ pathname: '/(app)/(tabs)/explore', params: { category: cat.slug } })
                  }
                >
                  <View style={styles.categoryImageWrapper}>
                    <Ionicons name="grid-outline" size={28} color="#3B4FE4" />
                  </View>
                  <Text style={styles.categoryName} numberOfLines={1}>{cat.name}</Text>
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
              <Ionicons name="heart-outline" size={40} color="#ccc" />
              <Text style={styles.emptyFavText}>Aún no tienes favoritos</Text>
              <Text style={styles.emptyFavSub}>Explora productos y agrégalos aquí</Text>
            </View>
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesContent}>
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
            <HomeFeaturedSkeleton />
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesContent}>
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
                    <Ionicons name="star" size={11} color="#FFB800" />
                    <Text style={styles.ratingText}>{product.rating}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F6FA' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: '#3B4FE4', paddingTop: 56, paddingBottom: 12, paddingHorizontal: 20,
  },
  headerBtn: { width: 36, height: 36, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 17, fontWeight: '700', color: '#fff' },
  searchWrapper: {
    backgroundColor: '#3B4FE4', paddingHorizontal: 16, paddingBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff',
    borderRadius: 12, paddingHorizontal: 14, height: 46,
  },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, fontSize: 15, color: '#333' },
  bannerWrapper: { margin: 16 },
  banner: {
    borderRadius: 16, backgroundColor: '#3B4FE4', padding: 20,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  bannerSmall: { color: 'rgba(255,255,255,0.8)', fontSize: 12 },
  bannerTitle: { color: '#fff', fontSize: 22, fontWeight: '800' },
  bannerSub: { color: 'rgba(255,255,255,0.8)', fontSize: 12 },
  bannerAmount: { color: '#FFD700', fontSize: 18, fontWeight: '700' },
  bannerEmoji: { fontSize: 52 },
  dotsRow: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginTop: 10 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#ccc' },
  dotActive: { backgroundColor: '#3B4FE4', width: 16 },
  section: { marginTop: 8, backgroundColor: '#fff', paddingVertical: 16 },
  sectionHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', paddingHorizontal: 20, marginBottom: 12,
  },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#1A1A2E' },
  seeAll: { fontSize: 13, color: '#3B4FE4', fontWeight: '600' },
  categoriesContent: { paddingHorizontal: 16, gap: 12 },
  categoryCard: { alignItems: 'center', width: 80 },
  categoryImageWrapper: {
    width: 70, height: 70, borderRadius: 14, backgroundColor: '#F0F2FF',
    justifyContent: 'center', alignItems: 'center', marginBottom: 6,
  },
  categoryName: { fontSize: 11, color: '#333', fontWeight: '600', textAlign: 'center' },
  emptyFav: { alignItems: 'center', paddingVertical: 24, gap: 6 },
  emptyFavText: { fontSize: 15, fontWeight: '600', color: '#333' },
  emptyFavSub: { fontSize: 12, color: '#888' },
  favCard: { width: 110, backgroundColor: '#F9F9F9', borderRadius: 12, padding: 10 },
  favImage: { width: '100%', height: 80, borderRadius: 8, resizeMode: 'cover' },
  favTitle: { fontSize: 12, fontWeight: '600', color: '#333', marginTop: 6 },
  favPrice: { fontSize: 13, fontWeight: '700', color: '#3B4FE4', marginTop: 2 },
  featuredCard: { width: 140, backgroundColor: '#F9F9F9', borderRadius: 12, padding: 10 },
  featuredImage: { width: '100%', height: 100, borderRadius: 8, resizeMode: 'cover' },
  featuredTitle: { fontSize: 12, fontWeight: '600', color: '#333', marginTop: 6 },
  featuredPrice: { fontSize: 13, fontWeight: '700', color: '#3B4FE4', marginTop: 2 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 2, marginTop: 4 },
  ratingText: { fontSize: 11, color: '#888' },
});
