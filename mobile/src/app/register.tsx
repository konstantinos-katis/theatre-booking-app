import { useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {
  router,
  useLocalSearchParams,
} from 'expo-router';
import axios from 'axios';

const API_URL = 'http://localhost:5000';

export default function RegisterScreen() {
  const params = useLocalSearchParams<{
    redirect?: string | string[];
  }>();

  const redirectPath = Array.isArray(params.redirect)
    ? params.redirect[0]
    : params.redirect;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    try {
      setMessage('');

      if (!name || !email || !password) {
        setMessage('Please complete all fields.');
        return;
      }

      setLoading(true);

      await axios.post(`${API_URL}/register`, {
        name,
        email,
        password,
      });

      setMessage(
        'Registration successful. Redirecting to login...'
      );

      setTimeout(() => {
        const loginPath = redirectPath
          ? `/login?email=${encodeURIComponent(
              email
            )}&redirect=${encodeURIComponent(
              redirectPath
            )}`
          : `/login?email=${encodeURIComponent(email)}`;

        router.replace(loginPath as any);
      }, 800);
    } catch (error) {
      setMessage(
        'Registration failed. This email may already exist.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLoginNavigation = () => {
    if (redirectPath) {
      router.push(
        `/login?redirect=${encodeURIComponent(
          redirectPath
        )}` as any
      );

      return;
    }

    router.push('/login');
  };

  return (
    <View style={styles.page}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.appLabel}>
            CREATE ACCOUNT
          </Text>

          <Text style={styles.title}>
            User Register
          </Text>

          <Text style={styles.subtitle}>
            Create an account to select seats, confirm reservations
            and manage your active bookings.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            Register Details
          </Text>

          <Text style={styles.label}>
            Name
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Enter your name"
            placeholderTextColor="#9b8d83"
            value={name}
            onChangeText={setName}
          />

          <Text style={styles.label}>
            Email
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            placeholderTextColor="#9b8d83"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <Text style={styles.label}>
            Password
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            placeholderTextColor="#9b8d83"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <CustomButton
            title={
              loading
                ? 'Creating account...'
                : 'Create Account'
            }
            variant="primary"
            onPress={handleRegister}
            disabled={loading}
          />

          <View style={styles.buttonGap}>
            <CustomButton
              title="Go to Login"
              variant="secondary"
              onPress={handleLoginNavigation}
            />
          </View>

          <View style={styles.buttonGap}>
            <CustomButton
              title="Back to Home"
              variant="secondary"
              onPress={() => router.replace('/')}
            />
          </View>

          {message ? (
            <View style={styles.messageBox}>
              <Text style={styles.messageText}>
                {message}
              </Text>
            </View>
          ) : null}
        </View>
      </View>
    </View>
  );
}

function CustomButton({
  title,
  variant,
  onPress,
  disabled = false,
}: {
  title: string;
  variant: 'primary' | 'secondary';
  onPress: () => void;
  disabled?: boolean;
}) {
  return (
    <Pressable
      style={[
        styles.customButton,
        variant === 'primary' &&
          styles.primaryButton,
        variant === 'secondary' &&
          styles.secondaryButton,
        disabled && styles.disabledButton,
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text
        style={[
          styles.customButtonText,
          variant === 'primary' &&
            styles.primaryButtonText,
          variant === 'secondary' &&
            styles.secondaryButtonText,
        ]}
      >
        {title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#f8f3ee',
    padding: 20,
  },
  content: {
    flex: 1,
    width: '100%',
    maxWidth: 620,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  header: {
    backgroundColor: '#d9c7b8',
    padding: 28,
    borderRadius: 32,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#cbb7a6',
  },
  appLabel: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.4,
    color: '#6b5f57',
    marginBottom: 8,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: '#3f342d',
  },
  subtitle: {
    color: '#5f5047',
    marginTop: 10,
    fontSize: 15,
    lineHeight: 23,
  },
  card: {
    backgroundColor: '#fffdf9',
    padding: 22,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#eaded2',
  },
  cardTitle: {
    fontSize: 21,
    fontWeight: '700',
    color: '#4b3d35',
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#6b5f57',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#fffaf5',
    borderWidth: 1,
    borderColor: '#eaded2',
    paddingVertical: 13,
    paddingHorizontal: 14,
    borderRadius: 22,
    marginBottom: 14,
    color: '#3f342d',
  },
  buttonGap: {
    marginTop: 10,
  },
  messageBox: {
    backgroundColor: '#eef4ea',
    padding: 14,
    borderRadius: 22,
    marginTop: 14,
    borderLeftWidth: 4,
    borderLeftColor: '#8cad7f',
  },
  messageText: {
    color: '#3f342d',
    fontSize: 14,
  },
  customButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 13,
    paddingHorizontal: 18,
    borderRadius: 26,
  },
  customButtonText: {
    fontSize: 14,
    fontWeight: '700',
  },
  primaryButton: {
    backgroundColor: '#8f6f5b',
  },
  primaryButtonText: {
    color: '#ffffff',
  },
  secondaryButton: {
    backgroundColor: '#efe4d8',
    borderWidth: 1,
    borderColor: '#d7c4b4',
  },
  secondaryButtonText: {
    color: '#4b3d35',
  },
  disabledButton: {
    opacity: 0.6,
  },
});