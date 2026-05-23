import { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ActivityIndicator, KeyboardAvoidingView,
  Platform, ScrollView,
} from 'react-native';
import { useAuth } from '../../src/context/AuthContext';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
  const { login, authError, isAuthenticated } = useAuth();
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ username?: string; password?: string }>({});

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/(app)/(tabs)/home');
    }
  }, [isAuthenticated]);

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

  const handleLogin = async () => {
    if (!validate() || loading) return;
    setLoading(true);
    await login(username.trim(), password, remember);
    setLoading(false);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.logo}>SIPY</Text>
          <Text style={styles.welcome}>¡Bienvenido!</Text>
          <Text style={styles.subtitle}>Ingresa a tu cuenta</Text>
        </View>

        <View style={styles.form}>
          <TextInput
            style={[styles.input, errors.username ? styles.inputError : null]}
            placeholder="Usuario"
            placeholderTextColor="#999"
            value={username}
            onChangeText={(t) => {
              setUsername(t);
              if (errors.username) setErrors((e) => ({ ...e, username: undefined }));
            }}
            autoCapitalize="none"
          />
          {errors.username ? <Text style={styles.errorText}>{errors.username}</Text> : null}

          <View style={[styles.passwordContainer, errors.password ? styles.inputError : null]}>
            <TextInput
              style={styles.inputPassword}
              placeholder="Contraseña"
              placeholderTextColor="#999"
              value={password}
              onChangeText={(t) => {
                setPassword(t);
                if (errors.password) setErrors((e) => ({ ...e, password: undefined }));
              }}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
            />
            <TouchableOpacity style={styles.eyeButton} onPress={() => setShowPassword((v) => !v)}>
              <Text style={styles.eyeIcon}>{showPassword ? '🙈' : '👁️'}</Text>
            </TouchableOpacity>
          </View>
          {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}

          {authError ? <Text style={styles.authError}>{authError}</Text> : null}

          <View style={styles.row}>
            <TouchableOpacity style={styles.checkboxRow} onPress={() => setRemember((v) => !v)}>
              <View style={[styles.checkbox, remember && styles.checkboxChecked]}>
                {remember && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <Text style={styles.rememberText}>Recordar sesión</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.button, (!isFormValid || loading) && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={!isFormValid || loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Iniciar sesión</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1, backgroundColor: '#3B4FE4',
    justifyContent: 'center', padding: 24,
  },
  header: { alignItems: 'center', marginBottom: 40 },
  logo: { fontSize: 42, fontWeight: '900', color: '#fff', letterSpacing: 4, marginBottom: 12 },
  welcome: { fontSize: 22, fontWeight: '700', color: '#fff' },
  subtitle: { fontSize: 14, color: 'rgba(255,255,255,0.8)', marginTop: 4 },
  form: { backgroundColor: '#fff', borderRadius: 20, padding: 24, gap: 12 },
  input: {
    borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 10,
    paddingHorizontal: 16, paddingVertical: 12, fontSize: 15,
    color: '#333', backgroundColor: '#F9F9F9',
  },
  inputError: { borderColor: '#E53935' },
  passwordContainer: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1, borderColor: '#E0E0E0',
    borderRadius: 10, backgroundColor: '#F9F9F9',
  },
  inputPassword: {
    flex: 1, paddingHorizontal: 16, paddingVertical: 12,
    fontSize: 15, color: '#333',
  },
  eyeButton: { paddingHorizontal: 12 },
  eyeIcon: { fontSize: 18 },
  errorText: { color: '#E53935', fontSize: 12, marginTop: -6, marginLeft: 4 },
  authError: { color: '#E53935', fontSize: 13, textAlign: 'center', fontWeight: '600' },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  checkboxRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  checkbox: {
    width: 20, height: 20, borderWidth: 2, borderColor: '#3B4FE4',
    borderRadius: 4, justifyContent: 'center', alignItems: 'center',
  },
  checkboxChecked: { backgroundColor: '#3B4FE4' },
  checkmark: { color: '#fff', fontSize: 12, fontWeight: '700' },
  rememberText: { fontSize: 13, color: '#555' },
  button: {
    backgroundColor: '#3B4FE4', borderRadius: 10,
    paddingVertical: 14, alignItems: 'center', marginTop: 8,
  },
  buttonDisabled: { backgroundColor: '#A0A8F0' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
