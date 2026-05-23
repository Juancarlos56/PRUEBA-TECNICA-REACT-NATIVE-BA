import { Stack } from 'expo-router';
import { useAuth } from '../../src/context/AuthContext';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';

export default function AppLayout() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/(auth)/login');
    }
  }, [isAuthenticated, isLoading]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="product/[id]" options={{ headerShown: false }} />
    </Stack>
  );
}
