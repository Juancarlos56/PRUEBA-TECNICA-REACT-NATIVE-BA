import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { QUERY_KEYS } from '../../../src/constants';
import { useFavorites } from '../../../src/context/FavoritesContext';
import { getProductById } from '../../../src/services/products.service';

const { width } = Dimensions.get('window');

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [selectedImage, setSelectedImage] = useState(0);
  const [expanded, setExpanded] = useState(false);

  const { data: product, isLoading, isError, refetch } = useQuery({
    queryKey: [QUERY_KEYS.PRODUCT_DETAIL, id],
    queryFn: () => getProductById(Number(id)),
    retry: 2,
  });

  const handleShare = async () => {
    if (!product) return;
    try {
      await Share.share({
        message: `*${product.title}*\n💰 Precio: $${product.price}\n Rating: ${product.rating}\n\n${product.description}\n\nhttps://dummyjson.com/products/${product.id}`,
        title: product.title,
      });
    } catch (e) {}
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#3B4FE4" />
        <Text style={styles.loadingText}>Cargando producto...</Text>
      </View>
    );
  }

  if (isError || !product) {
    return (
      <View style={styles.centered}>
        <Ionicons name="alert-circle-outline" size={48} color="#ccc" />
        <Text style={styles.errorText}>No se pudo cargar el producto</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
          <Text style={styles.retryText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const favorite = isFavorite(product.id);

  return (
    <View style={styles.container}>
      {/* Header flotante */}
      <View style={styles.floatingHeader}>
        <TouchableOpacity style={styles.headerBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={22} color="#1A1A2E" />
        </TouchableOpacity>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.headerBtn} onPress={handleShare}>
            <Ionicons name="share-outline" size={22} color="#1A1A2E" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerBtn}
            onPress={() => toggleFavorite(product)}
          >
            <Ionicons
              name={favorite ? 'heart' : 'heart-outline'}
              size={22}
              color={favorite ? '#FF4081' : '#1A1A2E'}
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Galería */}
        <View style={styles.gallery}>
          <Image
            source={{ uri: product.images[selectedImage] ?? product.thumbnail }}
            style={styles.mainImage}
            resizeMode="contain"
          />
          <View style={styles.dotsRow}>
            {product.images.map((_, i) => (
              <View key={i} style={[styles.dot, i === selectedImage && styles.dotActive]} />
            ))}
          </View>
        </View>

        {/* Miniaturas */}
        {product.images.length > 1 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.thumbnailRow}
            contentContainerStyle={{ paddingHorizontal: 16 }}
          >
            {product.images.map((img, i) => (
              <TouchableOpacity
                key={i}
                onPress={() => setSelectedImage(i)}
                style={[styles.thumbnail, i === selectedImage && styles.thumbnailActive]}
              >
                <Image source={{ uri: img }} style={styles.thumbnailImage} resizeMode="contain" />
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {/* Info */}
        <View style={styles.infoContainer}>
          <Text style={styles.category}>{product.category}</Text>
          <View style={styles.titleRow}>
            <Text style={styles.title}>{product.title}</Text>
            <Text style={styles.price}>${product.price}</Text>
          </View>

          {/* Rating y stock */}
          <View style={styles.metaRow}>
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={16} color="#FFB800" />
              <Text style={styles.ratingValue}>{product.rating}</Text>
              <Text style={styles.ratingLabel}> / 5.0</Text>
            </View>
            <View style={[
              styles.stockBadge,
              product.stock > 20 ? styles.stockGood : styles.stockLow,
            ]}>
              <Ionicons
                name={product.stock > 20 ? 'checkmark-circle-outline' : 'warning-outline'}
                size={13}
                color={product.stock > 20 ? '#2E7D32' : '#E65100'}
              />
              <Text style={[
                styles.stockBadgeText,
                { color: product.stock > 20 ? '#2E7D32' : '#E65100' }
              ]}>
                {product.stock > 20 ? 'En stock' : `Solo ${product.stock} unidades`}
              </Text>
            </View>
          </View>

          {/* Descuento */}
          {product.discountPercentage > 0 && (
            <View style={styles.discountRow}>
              <Ionicons name="pricetag-outline" size={14} color="#F57C00" />
              <Text style={styles.discountText}>
                {product.discountPercentage.toFixed(1)}% de descuento
              </Text>
              <Text style={styles.originalPrice}>
                ${(product.price / (1 - product.discountPercentage / 100)).toFixed(2)}
              </Text>
            </View>
          )}

          {/* Descripción */}
          <View style={styles.descSection}>
            <Text style={styles.descTitle}>Descripción</Text>
            <Text style={styles.descText} numberOfLines={expanded ? undefined : 3}>
              {product.description}
            </Text>
            <TouchableOpacity onPress={() => setExpanded((v) => !v)}>
              <Text style={styles.expandBtn}>{expanded ? 'Ver menos' : 'Ver más'}</Text>
            </TouchableOpacity>
          </View>

          {/* Info adicional */}
          <View style={styles.extraInfo}>
            {product.brand && (
              <View style={styles.extraRow}>
                <Text style={styles.extraLabel}>Marca</Text>
                <Text style={styles.extraValue}>{product.brand}</Text>
              </View>
            )}
            <View style={styles.extraRow}>
              <Text style={styles.extraLabel}>Categoría</Text>
              <Text style={styles.extraValue}>{product.category}</Text>
            </View>
            <View style={styles.extraRow}>
              <Text style={styles.extraLabel}>Stock disponible</Text>
              <Text style={styles.extraValue}>{product.stock} unidades</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Botón inferior */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[styles.favBottomBtn, favorite && styles.favBottomBtnActive]}
          onPress={() => toggleFavorite(product)}
        >
          <Ionicons
            name={favorite ? 'heart' : 'heart-outline'}
            size={22}
            color={favorite ? '#FF4081' : '#999'}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.addCartBtn} onPress={handleShare}>
          <Ionicons name="logo-whatsapp" size={20} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.addCartText}>Compartir por WhatsApp</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 },
  loadingText: { color: '#888', fontSize: 14 },
  errorText: { fontSize: 16, color: '#333', fontWeight: '600' },
  retryButton: {
    backgroundColor: '#3B4FE4', borderRadius: 10,
    paddingHorizontal: 24, paddingVertical: 10, marginTop: 8,
  },
  retryText: { color: '#fff', fontWeight: '600' },
  floatingHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', paddingTop: 60, paddingHorizontal: 16,
    paddingBottom: 8, backgroundColor: '#fff',
    borderBottomWidth: 1, borderBottomColor: '#F5F5F5',
  },
  headerRight: { flexDirection: 'row', gap: 8 },
  headerBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: '#F5F6FA',
    justifyContent: 'center', alignItems: 'center',
  },
  gallery: {
    width: width, height: 280,
    backgroundColor: '#F9F9F9',
    justifyContent: 'center', alignItems: 'center',
  },
  mainImage: { width: width - 40, height: 260 },
  dotsRow: {
    flexDirection: 'row', justifyContent: 'center',
    gap: 6, position: 'absolute', bottom: 12,
  },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#ddd' },
  dotActive: { backgroundColor: '#3B4FE4', width: 16 },
  thumbnailRow: { paddingVertical: 12, backgroundColor: '#F9F9F9' },
  thumbnail: {
    width: 64, height: 64, borderRadius: 10,
    marginRight: 10, borderWidth: 2, borderColor: 'transparent',
    overflow: 'hidden', backgroundColor: '#fff',
    justifyContent: 'center', alignItems: 'center',
  },
  thumbnailActive: { borderColor: '#3B4FE4' },
  thumbnailImage: { width: '100%', height: '100%' },
  infoContainer: { padding: 20 },
  category: {
    fontSize: 12, color: '#3B4FE4', fontWeight: '700',
    textTransform: 'uppercase', letterSpacing: 1,
  },
  titleRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'flex-start', marginTop: 6, gap: 12,
  },
  title: { flex: 1, fontSize: 20, fontWeight: '800', color: '#1A1A2E', lineHeight: 26 },
  price: { fontSize: 22, fontWeight: '900', color: '#3B4FE4' },
  metaRow: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', marginTop: 12,
  },
  ratingContainer: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  ratingValue: { fontSize: 16, fontWeight: '700', color: '#1A1A2E' },
  ratingLabel: { fontSize: 13, color: '#888' },
  stockBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20,
  },
  stockGood: { backgroundColor: '#E8F5E9' },
  stockLow: { backgroundColor: '#FFF3E0' },
  stockBadgeText: { fontSize: 12, fontWeight: '600' },
  discountRow: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    marginTop: 10, backgroundColor: '#FFF8E1',
    padding: 10, borderRadius: 10,
  },
  discountText: { fontSize: 13, color: '#F57C00', fontWeight: '600' },
  originalPrice: { fontSize: 13, color: '#bbb', textDecorationLine: 'line-through' },
  descSection: { marginTop: 20 },
  descTitle: { fontSize: 16, fontWeight: '700', color: '#1A1A2E', marginBottom: 8 },
  descText: { fontSize: 14, color: '#555', lineHeight: 22 },
  expandBtn: { color: '#3B4FE4', fontSize: 13, fontWeight: '600', marginTop: 6 },
  extraInfo: {
    marginTop: 20, backgroundColor: '#F5F6FA',
    borderRadius: 12, padding: 16, gap: 12,
  },
  extraRow: { flexDirection: 'row', justifyContent: 'space-between' },
  extraLabel: { fontSize: 13, color: '#888' },
  extraValue: { fontSize: 13, fontWeight: '600', color: '#1A1A2E' },
  bottomBar: {
    flexDirection: 'row', padding: 16, paddingBottom: 32,
    backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#F0F0F0',
    gap: 12,
  },
  favBottomBtn: {
    width: 52, height: 52, borderRadius: 14,
    borderWidth: 1, borderColor: '#E0E0E0',
    justifyContent: 'center', alignItems: 'center',
  },
  favBottomBtnActive: { borderColor: '#FF4081', backgroundColor: '#FFF0F5' },
  addCartBtn: {
    flex: 1, backgroundColor: '#3B4FE4', borderRadius: 14,
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center', height: 52,
  },
  addCartText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});
