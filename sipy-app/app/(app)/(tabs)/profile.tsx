import {
  View, Text, StyleSheet, TouchableOpacity,
  Image, Alert, ScrollView,
} from 'react-native';
import { useAuth } from '../../../src/context/AuthContext';
import { useFavorites } from '../../../src/context/FavoritesContext';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const { favorites, clearFavorites } = useFavorites();
  const router = useRouter();

  const handleLogout = () => {
    Alert.alert(
      'Cerrar sesión',
      '¿Estás seguro de que quieres cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Cerrar sesión',
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/(auth)/login');
          },
        },
      ]
    );
  };

  const menuItems = [
    { icon: '❤️', label: 'Mis favoritos', value: `${favorites.length} productos`, onPress: () => router.push('/(app)/(tabs)/favorites') },
    { icon: '🔍', label: 'Explorar productos', value: '', onPress: () => router.push('/(app)/(tabs)/explore') },
    { icon: '🏠', label: 'Ir al inicio', value: '', onPress: () => router.push('/(app)/(tabs)/home') },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Perfil</Text>
      </View>

      {/* Avatar y datos */}
      <View style={styles.profileCard}>
        {user?.image ? (
          <Image source={{ uri: user.image }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>{user?.firstName?.charAt(0)}</Text>
          </View>
        )}
        <Text style={styles.fullName}>{user?.firstName} {user?.lastName}</Text>
        <Text style={styles.username}>@{user?.username}</Text>
        <Text style={styles.email}>{user?.email}</Text>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{favorites.length}</Text>
            <Text style={styles.statLabel}>Favoritos</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>Pedidos</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>Reseñas</Text>
          </View>
        </View>
      </View>

      {/* Menú */}
      <View style={styles.menuSection}>
        <Text style={styles.menuSectionTitle}>Accesos rápidos</Text>
        {menuItems.map((item, i) => (
          <TouchableOpacity
            key={i}
            style={styles.menuItem}
            onPress={item.onPress}
          >
            <Text style={styles.menuIcon}>{item.icon}</Text>
            <Text style={styles.menuLabel}>{item.label}</Text>
            <View style={styles.menuRight}>
              {item.value ? <Text style={styles.menuValue}>{item.value}</Text> : null}
              <Text style={styles.menuArrow}>›</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Info cuenta */}
      <View style={styles.menuSection}>
        <Text style={styles.menuSectionTitle}>Información de cuenta</Text>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Usuario</Text>
          <Text style={styles.infoValue}>{user?.username}</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Email</Text>
          <Text style={styles.infoValue}>{user?.email}</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Nombre</Text>
          <Text style={styles.infoValue}>{user?.firstName} {user?.lastName}</Text>
        </View>
      </View>

      {/* Logout */}
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutIcon}>🚪</Text>
        <Text style={styles.logoutText}>Cerrar sesión</Text>
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F6FA' },
  header: {
    paddingTop: 60, paddingHorizontal: 20, paddingBottom: 12,
    backgroundColor: '#fff',
  },
  headerTitle: { fontSize: 24, fontWeight: '800', color: '#1A1A2E' },
  profileCard: {
    backgroundColor: '#fff', alignItems: 'center',
    paddingVertical: 28, paddingHorizontal: 20,
    borderBottomWidth: 1, borderBottomColor: '#F0F0F0',
  },
  avatar: { width: 88, height: 88, borderRadius: 44, marginBottom: 12 },
  avatarPlaceholder: {
    width: 88, height: 88, borderRadius: 44,
    backgroundColor: '#3B4FE4', justifyContent: 'center',
    alignItems: 'center', marginBottom: 12,
  },
  avatarText: { color: '#fff', fontSize: 36, fontWeight: '700' },
  fullName: { fontSize: 20, fontWeight: '800', color: '#1A1A2E' },
  username: { fontSize: 14, color: '#3B4FE4', fontWeight: '600', marginTop: 2 },
  email: { fontSize: 13, color: '#888', marginTop: 4 },
  statsRow: {
    flexDirection: 'row', alignItems: 'center',
    marginTop: 20, backgroundColor: '#F5F6FA',
    borderRadius: 14, padding: 16, gap: 0, width: '100%',
  },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 20, fontWeight: '800', color: '#1A1A2E' },
  statLabel: { fontSize: 12, color: '#888', marginTop: 2 },
  statDivider: { width: 1, height: 32, backgroundColor: '#E0E0E0' },
  menuSection: {
    backgroundColor: '#fff', marginTop: 12,
    paddingHorizontal: 20, paddingVertical: 16,
  },
  menuSectionTitle: {
    fontSize: 12, color: '#888', fontWeight: '600',
    textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12,
  },
  menuItem: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F5F6FA',
  },
  menuIcon: { fontSize: 20, marginRight: 12 },
  menuLabel: { flex: 1, fontSize: 15, color: '#1A1A2E', fontWeight: '500' },
  menuRight: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  menuValue: { fontSize: 13, color: '#888' },
  menuArrow: { fontSize: 20, color: '#ccc' },
  infoItem: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', paddingVertical: 10,
    borderBottomWidth: 1, borderBottomColor: '#F5F6FA',
  },
  infoLabel: { fontSize: 14, color: '#888' },
  infoValue: { fontSize: 14, color: '#1A1A2E', fontWeight: '600' },
  logoutBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    margin: 20, backgroundColor: '#FFF0F0', borderRadius: 14,
    paddingVertical: 14, gap: 8,
    borderWidth: 1, borderColor: '#FFCDD2',
  },
  logoutIcon: { fontSize: 20 },
  logoutText: { fontSize: 16, fontWeight: '700', color: '#E53935' },
});
