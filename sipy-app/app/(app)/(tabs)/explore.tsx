import React, { useState, useCallback, useMemo } from 'react';
import {
  View, Text, StyleSheet, FlatList, TextInput,
  TouchableOpacity, Image, ActivityIndicator,
  RefreshControl, ScrollView,
} from 'react-native';
import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { getCategories, getProducts, getProductsByCategory, searchProducts } from '../../../src/services/products.service';
import { QUERY_KEYS } from '../../../src/constants';
import { useFavorites } from '../../../src/context/FavoritesContext';
import { Product } from '../../../src/types';

const SORT_OPTIONS = [
  { key: 'default', label: 'Relevancia' },
  { key: 'price_asc', label: 'Menor precio' },
  { key: 'price_desc', label: 'Mayor precio' },
  { key: 'rating', label: 'Rating' },
  { key: 'name', label: 'Nombre' },
];

const LIMIT = 20;

export default function ExploreScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { isFavorite, toggleFavorite } = useFavorites();

  const [search, setSearch] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(
    (params.category as string) || ''
  );
  const [sortKey, setSortKey] = useState('default');
  const [showSort, setShowSort] = useState(false);

  const { data: categoriesData } = useQuery({
    queryKey: [QUERY_KEYS.CATEGORIES],
    queryFn: getCategories,
  });

  const {
    data: searchData,
    isLoading: searchLoading,
    refetch: refetchSearch,
    isRefetching: searchRefetching,
  } = useQuery({
    queryKey: [QUERY_KEYS.PRODUCTS, 'search', searchQuery],
    queryFn: () => searchProducts(searchQuery),
    enabled: searchQuery.length > 0,
  });

  const {
    data: infiniteData,
    isLoading: productsLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch: refetchProducts,
    isRefetching: productsRefetching,
  } = useInfiniteQuery({
    queryKey: [QUERY_KEYS.PRODUCTS, selectedCategory],
    queryFn: ({ pageParam = 0 }) =>
      selectedCategory
        ? getProductsByCategory(selectedCategory, LIMIT, pageParam)
        : getProducts(LIMIT, pageParam),
    getNextPageParam: (lastPage) => {
      const nextSkip = lastPage.skip + lastPage.limit;
      return nextSkip < lastPage.total ? nextSkip : undefined;
    },
    initialPageParam: 0,
    enabled: searchQuery.length === 0,
  });

  const allProducts = useMemo(() => {
    if (searchQuery.length > 0) return searchData?.products ?? [];
    return infiniteData?.pages.flatMap((p) => p.products) ?? [];
  }, [searchQuery, searchData, infiniteData]);

  const sortedProducts = useMemo(() => {
    const list = [...allProducts];
    switch (sortKey) {
      case 'price_asc': return list.sort((a, b) => a.price - b.price);
      case 'price_desc': return list.sort((a, b) => b.price - a.price);
      case 'rating': return list.sort((a, b) => b.rating - a.rating);
      case 'name': return list.sort((a, b) => a.title.localeCompare(b.title));
      default: return list;
    }
  }, [allProducts, sortKey]);

  const isLoading = searchQuery.length > 0 ? searchLoading : productsLoading;
  const isRefreshing = searchQuery.length > 0 ? searchRefetching : productsRefetching;

  const handleRefresh = () => {
    if (searchQuery.length > 0) refetchSearch();
    else refetchProducts();
  };

  const handleSearch = useCallback(() => {
    setSearchQuery(search.trim());
    setSelectedCategory('');
  }, [search]);

  const handleCategorySelect = (slug: string) => {
    setSelectedCategory(slug === selectedCategory ? '' : slug);
    setSearchQuery('');
    setSearch('');
  };

  const renderProduct = useCallback(({ item }: { item: Product }) => (
    <TouchableOpacity
      style={styles.productCard}
      onPress={() => router.push(`/(app)/product/${item.id}`)}
      activeOpacity={0.85}
    >
      <View style={styles.imageContainer}>
        <Image source={{ uri: item.thumbnail }} style={styles.productImage} />
        <TouchableOpacity
          style={styles.favButton}
          onPress={() => toggleFavorite(item)}
        >
          <Text style={styles.favIcon}>{isFavorite(item.id) ? '❤️' : '🤍'}</Text>
        </TouchableOpacity>
        {item.stock < 10 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Poco stock</Text>
          </View>
        )}
      </View>
      <View style={styles.productInfo}>
        <Text style={styles.productCategory}>{item.category}</Text>
        <Text style={styles.productTitle} numberOfLines={2}>{item.title}</Text>
        <View style={styles.productBottom}>
          <Text style={styles.productPrice}>${item.price}</Text>
          <View style={styles.ratingRow}>
            <Text style={styles.star}>⭐</Text>
            <Text style={styles.ratingText}>{item.rating}</Text>
          </View>
        </View>
        <Text style={styles.stockText}>Stock: {item.stock}</Text>
      </View>
    </TouchableOpacity>
  ), [isFavorite, toggleFavorite]);

  const renderFooter = () => {
    if (!isFetchingNextPage) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator color="#3B4FE4" />
      </View>
    );
  };

  const renderEmpty = () => {
    if (isLoading) return null;
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyEmoji}>🔍</Text>
        <Text style={styles.emptyText}>No se encontraron productos</Text>
        <Text style={styles.emptySub}>Intenta con otra búsqueda o categoría</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Explorar</Text>
      </View>

      {/* Buscador */}
      <View style={styles.searchRow}>
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
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
            <TouchableOpacity onPress={() => { setSearch(''); setSearchQuery(''); }}>
              <Text style={styles.clearIcon}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity
          style={[styles.sortButton, showSort && styles.sortButtonActive]}
          onPress={() => setShowSort((v) => !v)}
        >
          <Text style={styles.sortIcon}>⇅</Text>
        </TouchableOpacity>
      </View>

      {/* Sort options */}
      {showSort && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.sortRow}>
          {SORT_OPTIONS.map((opt) => (
            <TouchableOpacity
              key={opt.key}
              style={[styles.sortChip, sortKey === opt.key && styles.sortChipActive]}
              onPress={() => { setSortKey(opt.key); setShowSort(false); }}
            >
              <Text style={[styles.sortChipText, sortKey === opt.key && styles.sortChipTextActive]}>
                {opt.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* Categorías */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesRow}
        contentContainerStyle={{ paddingHorizontal: 16 }}
      >
        <TouchableOpacity
          style={[styles.categoryChip, selectedCategory === '' && styles.categoryChipActive]}
          onPress={() => handleCategorySelect('')}
        >
          <Text style={[styles.categoryChipText, selectedCategory === '' && styles.categoryChipTextActive]}>
            Todos
          </Text>
        </TouchableOpacity>
        {categoriesData?.map((cat) => (
          <TouchableOpacity
            key={cat.slug}
            style={[styles.categoryChip, selectedCategory === cat.slug && styles.categoryChipActive]}
            onPress={() => handleCategorySelect(cat.slug)}
          >
            <Text style={[styles.categoryChipText, selectedCategory === cat.slug && styles.categoryChipTextActive]}>
              {cat.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Lista */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3B4FE4" />
          <Text style={styles.loadingText}>Cargando productos...</Text>
        </View>
      ) : (
        <FlatList
          data={sortedProducts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderProduct}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.listContent}
          onEndReached={() => {
            if (hasNextPage && !isFetchingNextPage && searchQuery.length === 0) {
              fetchNextPage();
            }
          }}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={renderEmpty}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              tintColor="#3B4FE4"
            />
          }
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F6FA' },
  header: {
    paddingTop: 60, paddingHorizontal: 20, paddingBottom: 12,
    backgroundColor: '#fff',
  },
  headerTitle: { fontSize: 24, fontWeight: '800', color: '#1A1A2E' },
  searchRow: {
    flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 10,
    backgroundColor: '#fff', gap: 10, alignItems: 'center',
  },
  searchContainer: {
    flex: 1, flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#F5F6FA', borderRadius: 12,
    paddingHorizontal: 12, borderWidth: 1, borderColor: '#E8E8E8',
  },
  searchIcon: { fontSize: 16, marginRight: 8 },
  searchInput: { flex: 1, paddingVertical: 10, fontSize: 15, color: '#333' },
  clearIcon: { fontSize: 14, color: '#999', paddingLeft: 8 },
  sortButton: {
    width: 44, height: 44, borderRadius: 12, backgroundColor: '#F5F6FA',
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 1, borderColor: '#E8E8E8',
  },
  sortButtonActive: { backgroundColor: '#3B4FE4', borderColor: '#3B4FE4' },
  sortIcon: { fontSize: 20, color: '#333' },
  sortRow: { backgroundColor: '#fff', paddingVertical: 8, paddingLeft: 16 },
  sortChip: {
    paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20,
    backgroundColor: '#F5F6FA', marginRight: 8,
    borderWidth: 1, borderColor: '#E8E8E8',
  },
  sortChipActive: { backgroundColor: '#3B4FE4', borderColor: '#3B4FE4' },
  sortChipText: { fontSize: 13, color: '#555', fontWeight: '500' },
  sortChipTextActive: { color: '#fff' },
  categoriesRow: { backgroundColor: '#fff', paddingVertical: 10, maxHeight: 52 },
  categoryChip: {
    paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20,
    backgroundColor: '#F5F6FA', marginRight: 8,
    borderWidth: 1, borderColor: '#E8E8E8',
  },
  categoryChipActive: { backgroundColor: '#3B4FE4', borderColor: '#3B4FE4' },
  categoryChipText: { fontSize: 13, color: '#555', fontWeight: '500' },
  categoryChipTextActive: { color: '#fff', fontWeight: '600' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 },
  loadingText: { color: '#888', fontSize: 14 },
  listContent: { padding: 12, paddingBottom: 80 },
  columnWrapper: { gap: 12 },
  productCard: {
    flex: 1, backgroundColor: '#fff', borderRadius: 16,
    overflow: 'hidden', marginBottom: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
  },
  imageContainer: { position: 'relative' },
  productImage: { width: '100%', height: 140, resizeMode: 'cover' },
  favButton: {
    position: 'absolute', top: 8, right: 8,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 20, width: 32, height: 32,
    justifyContent: 'center', alignItems: 'center',
  },
  favIcon: { fontSize: 16 },
  badge: {
    position: 'absolute', bottom: 8, left: 8,
    backgroundColor: '#FF6B35', borderRadius: 6,
    paddingHorizontal: 6, paddingVertical: 2,
  },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: '700' },
  productInfo: { padding: 10 },
  productCategory: { fontSize: 10, color: '#3B4FE4', fontWeight: '600', textTransform: 'uppercase' },
  productTitle: { fontSize: 13, fontWeight: '600', color: '#1A1A2E', marginTop: 2, lineHeight: 18 },
  productBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 },
  productPrice: { fontSize: 15, fontWeight: '800', color: '#1A1A2E' },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  star: { fontSize: 11 },
  ratingText: { fontSize: 11, color: '#888' },
  stockText: { fontSize: 10, color: '#999', marginTop: 2 },
  footerLoader: { paddingVertical: 20, alignItems: 'center' },
  emptyContainer: { flex: 1, alignItems: 'center', paddingTop: 60, gap: 8 },
  emptyEmoji: { fontSize: 48 },
  emptyText: { fontSize: 16, fontWeight: '600', color: '#333' },
  emptySub: { fontSize: 13, color: '#888' },
});
