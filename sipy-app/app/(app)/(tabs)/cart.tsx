import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function CartScreen() {
  return (
    <View style={styles.container}>
      <Ionicons name="cart-outline" size={64} color="#ccc" />
      <Text style={styles.title}>Tu carrito está vacío</Text>
      <Text style={styles.sub}>Agrega productos para verlos aquí</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 10, backgroundColor: '#F5F6FA' },
  title: { fontSize: 18, fontWeight: '700', color: '#333' },
  sub: { fontSize: 14, color: '#888' },
});
