import {
  View, Text, StyleSheet, FlatList,
  TouchableOpacity, Image, Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useFavorites } from '../../../src/context/FavoritesContext';
import { Product } from '../../../src/types';
import { Ionicons } from '@expo/vector-icons';

export default function FavoritesScreen() {
  const { favorites, toggleFavorite, clearFavorites } = useFavorites();
  const router = useRouter();

  const handleClear = () => {
    Alert.alert(
      'Limpiar favoritos',
      '¿Estás seguro de que quieres eliminar todos los favoritos?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', style: 'destructive', onPress: clearFavorites },
      ]
    );
  };

  const renderItem = ({ item }: { item: Product }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/(app)/product/${item.id}`)}
      activeOpacity={0.85}
    >
      <Image source={{ uri: item.thumbnail }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.category}>{item.category}</Text>
        <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.price}>${item.price}</Text>
        <View style={styles.ratingRow}>
          <Ionicons name="star" size={12} color="#FFB800" />
          <Text style={styles.rating}>{item.rating}</Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.removeBtn}
        onPress={() => toggleFavorite(item)}
      >
        <Ionicons name="heart" size={24} color="#FF4081" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mis Favoritos</Text>
        {favorites.length > 0 && (
          <TouchableOpacity onPress={handleClear}>
            <Text style={styles.clearBtn}>Limpiar</Text>
          </TouchableOpacity>
        )}
      </View>

      {favorites.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="heart-outline" size={64} color="#ddd" />
          <Text style={styles.emptyTitle}>Aún no tienes favoritos</Text>
          <Text style={styles.emptySub}>
            Explora productos y agrégalos a tus favoritos
          </Text>
          <TouchableOpacity
            style={styles.exploreBtn}
            onPress={() => router.push('/(app)/(tabs)/explore')}
          >
            <Text style={styles.exploreBtnText}>Explorar productos</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <Text style={styles.countText}>
            {favorites.length} producto{favorites.length !== 1 ? 's' : ''} guardado{favorites.length !== 1 ? 's' : ''}
          </Text>
          <FlatList
            data={favorites}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F6FA' },
  header: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', paddingTop: 60, paddingHorizontal: 20,
    paddingBottom: 12, backgroundColor: '#fff',
  },
  headerTitle: { fontSize: 24, fontWeight: '800', color: '#1A1A2E' },
  clearBtn: { fontSize: 14, color: '#E53935', fontWeight: '600' },
  countText: {
    fontSize: 13, color: '#888', paddingHorizontal: 20,
    paddingVertical: 10, backgroundColor: '#fff',
    borderBottomWidth: 1, borderBottomColor: '#F0F0F0',
  },
  listContent: { padding: 16, paddingBottom: 80 },
  card: {
    flexDirection: 'row', backgroundColor: '#fff',
    borderRadius: 16, marginBottom: 12, padding: 12,
    alignItems: 'center', gap: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05, shadowRadius: 6, elevation: 2,
  },
  image: {
    width: 80, height: 80, borderRadius: 12,
    resizeMode: 'contain', backgroundColor: '#F9F9F9',
  },
  info: { flex: 1, gap: 2 },
  category: {
    fontSize: 10, color: '#3B4FE4', fontWeight: '700',
    textTransform: 'uppercase',
  },
  title: { fontSize: 14, fontWeight: '600', color: '#1A1A2E', lineHeight: 19 },
  price: { fontSize: 16, fontWeight: '800', color: '#1A1A2E', marginTop: 2 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  rating: { fontSize: 12, color: '#888' },
  removeBtn: {
    width: 40, height: 40, justifyContent: 'center', alignItems: 'center',
  },
  emptyContainer: {
    flex: 1, justifyContent: 'center', alignItems: 'center',
    paddingHorizontal: 40, gap: 10,
  },
  emptyTitle: { fontSize: 20, fontWeight: '700', color: '#1A1A2E' },
  emptySub: { fontSize: 14, color: '#888', textAlign: 'center', lineHeight: 20 },
  exploreBtn: {
    marginTop: 16, backgroundColor: '#3B4FE4', borderRadius: 12,
    paddingHorizontal: 28, paddingVertical: 12,
  },
  exploreBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});
