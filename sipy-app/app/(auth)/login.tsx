import { Ionicons } from '@expo/vector-icons';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  KeyboardAvoidingView,
  Platform, ScrollView,
  StyleSheet,
  Text, TextInput, TouchableOpacity,
  View,
} from 'react-native';
import { useAuth } from '../../src/context/AuthContext';

const { width } = Dimensions.get('window');

export default function LoginScreen() {
  const { login, authError, isAuthenticated } = useAuth();
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ username?: string; password?: string }>({});

  useEffect(() => {
    if (isAuthenticated) router.replace('/(app)/(tabs)/home');
  }, [isAuthenticated]);

  const loginMutation = useMutation({
    mutationFn: () => login(username.trim(), password, remember),
  });

  const validate = () => {
    const newErrors: { username?: string; password?: string } = {};
    if (!username.trim()) newErrors.username = 'El usuario es obligatorio';
    if (!password) {
      newErrors.password = 'La contraseña es obligatoria';
    } else if (password.length < 8) {
      newErrors.password = 'Mínimo 8 caracteres';
    } else if (/\s/.test(password)) {
      newErrors.password = 'No debe contener espacios';
    } else if (/[^a-zA-Z0-9]/.test(password)) {
      newErrors.password = 'No debe contener caracteres especiales';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isFormValid =
    username.trim().length > 0 &&
    password.length >= 8 &&
    !/\s/.test(password) &&
    !/[^a-zA-Z0-9]/.test(password);

  const handleLogin = () => {
    if (!validate() || loginMutation.isPending) return;
    loginMutation.mutate();
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Logo */}
        <View style={styles.logoSection}>
          <Text style={styles.logo}>SIPY</Text>
          <Text style={styles.welcome}>¡Bienvenido!</Text>
          <Text style={styles.subtitle}>Ingresa a tu cuenta</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          {/* Username */}
          <View>
            <View style={[styles.inputWrapper, errors.username ? styles.inputWrapperError : null]}>
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="rgba(255,255,255,0.5)"
                value={username}
                onChangeText={(t) => {
                  setUsername(t);
                  if (errors.username) setErrors((e) => ({ ...e, username: undefined }));
                }}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>
            {errors.username ? (
              <Text style={styles.errorText}>{errors.username}</Text>
            ) : null}
          </View>

          {/* Password */}
          <View>
            <View style={[styles.inputWrapper, errors.password ? styles.inputWrapperError : null]}>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="Contraseña"
                placeholderTextColor="rgba(255,255,255,0.5)"
                value={password}
                onChangeText={(t) => {
                  setPassword(t);
                  if (errors.password) setErrors((e) => ({ ...e, password: undefined }));
                }}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowPassword((v) => !v)}
              >
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={22}
                  color="rgba(255,255,255,0.7)"
                />
              </TouchableOpacity>
            </View>
            {errors.password ? (
              <Text style={styles.errorText}>{errors.password}</Text>
            ) : null}
          </View>

          {/* Error general */}
          {authError ? <Text style={styles.authError}>{authError}</Text> : null}
          {loginMutation.isError ? (
            <Text style={styles.authError}>Error al conectar con el servidor</Text>
          ) : null}

          {/* Recordar + Olvidaste */}
          <View style={styles.optionsRow}>
            <TouchableOpacity
              style={styles.checkboxRow}
              onPress={() => setRemember((v) => !v)}
            >
              <View style={[styles.checkbox, remember && styles.checkboxChecked]}>
                {remember && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <Text style={styles.rememberText}>Recordar sesión</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text style={styles.forgotText}>¿Olvidaste tu contraseña?</Text>
            </TouchableOpacity>
          </View>

          {/* Botón login */}
          <TouchableOpacity
            style={[
              styles.button,
              (!isFormValid || loginMutation.isPending) && styles.buttonDisabled,
            ]}
            onPress={handleLogin}
            disabled={!isFormValid || loginMutation.isPending}
            activeOpacity={0.85}
          >
            {loginMutation.isPending ? (
              <ActivityIndicator color="#3B4FE4" />
            ) : (
              <Text style={styles.buttonText}>Iniciar sesión</Text>
            )}
          </TouchableOpacity>

          {/* Registro */}
          <TouchableOpacity style={styles.registerRow}>
            <Text style={styles.registerText}>¿No tienes cuenta? </Text>
            <Text style={styles.registerLink}>Regístrate</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#3B4FE4',
    paddingHorizontal: 28,
    paddingTop: 80,
    paddingBottom: 40,
  },
  logoSection: {
    marginTop: 100,
    alignItems: 'center',
    marginBottom: 48,
  },
  logo: {
    fontSize: 52,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: 6,
    marginBottom: 16,
  },
  welcome: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.7)',
  },
  form: {
    gap: 16,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 18,
    height: 56,
  },
  inputWrapperError: {
    borderColor: '#FF6B6B',
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#fff',
    paddingVertical: 0,
  },
  eyeButton: {
    paddingLeft: 10,
  },
  eyeIcon: { fontSize: 18 },
  errorText: {
    color: '#FF6B6B',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  authError: {
    color: '#FF6B6B',
    fontSize: 13,
    textAlign: 'center',
    fontWeight: '600',
    backgroundColor: 'rgba(255,107,107,0.15)',
    padding: 10,
    borderRadius: 10,
  },
  optionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: -4,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#fff',
    borderColor: '#fff',
  },
  checkmark: {
    color: '#3B4FE4',
    fontSize: 12,
    fontWeight: '900',
  },
  rememberText: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
  },
  forgotText: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
  },
  button: {
    backgroundColor: '#fff',
    borderRadius: 14,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
  },
  buttonDisabled: {
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  buttonText: {
    color: '#3B4FE4',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  registerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
  },
  registerText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
  },
  registerLink: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
});
