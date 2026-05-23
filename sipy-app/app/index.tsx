import { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../src/context/AuthContext';

export default function Index() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    const timer = setTimeout(() => {
      if (isAuthenticated) {
        router.replace('/(app)/(tabs)/home');
      } else {
        router.replace('/(auth)/login');
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [isAuthenticated, isLoading]);

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Text style={styles.logo}>SIPY</Text>
        <Text style={styles.tagline}>Tu tienda favorita</Text>
      </View>

      <View style={styles.bottom}>
        <ActivityIndicator color="rgba(255,255,255,0.7)" size="small" />
        <Text style={styles.loadingText}>
          {isLoading ? 'Restaurando sesión...' : 'Cargando...'}
        </Text>
      </View>

      <View style={styles.circle1} />
      <View style={styles.circle2} />
      <View style={styles.circle3} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3B4FE4',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  logoContainer: {
    alignItems: 'center',
    zIndex: 10,
  },
  logo: {
    fontSize: 64,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: 8,
  },
  tagline: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.75)',
    marginTop: 8,
    letterSpacing: 2,
    fontWeight: '400',
  },
  bottom: {
    position: 'absolute',
    bottom: 60,
    alignItems: 'center',
    gap: 10,
    zIndex: 10,
  },
  loadingText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 13,
    letterSpacing: 0.5,
  },
  circle1: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(255,255,255,0.06)',
    top: -80,
    right: -80,
  },
  circle2: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.06)',
    bottom: 60,
    left: -60,
  },
  circle3: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255,255,255,0.08)',
    bottom: 200,
    right: -30,
  },
});
