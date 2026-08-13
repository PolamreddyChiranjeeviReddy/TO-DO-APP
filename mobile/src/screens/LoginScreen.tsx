import React, { useEffect, useState } from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import AuthFooter from '../components/AuthFooter';
import AuthShell from '../components/AuthShell';
import Button from '../components/Button';
import ErrorBanner from '../components/ErrorBanner';
import Input from '../components/Input';
import { useAppDispatch, useAppSelector } from '../store';
import { clearError, login } from '../store/authSlice';
import { AuthStackParamList } from '../navigation/AuthNavigator';
import { isValidEmail } from '../utils/validation';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

interface FieldErrors {
  email?: string;
  password?: string;
}

const LoginScreen = ({ navigation }: Props) => {
  const dispatch = useAppDispatch();
  const loading = useAppSelector(state => state.auth.loading);
  const error = useAppSelector(state => state.auth.error);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const clearFieldError = (field: keyof FieldErrors) => {
    setFieldErrors(prev => (prev[field] ? { ...prev, [field]: undefined } : prev));
  };

  const handleLogin = () => {
    const errors: FieldErrors = {};
    if (!email.trim()) {
      errors.email = 'Email is required';
    } else if (!isValidEmail(email.trim())) {
      errors.email = 'Enter a valid email address';
    }
    if (!password) {
      errors.password = 'Password is required';
    }
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    dispatch(login({ email: email.trim(), password }));
  };

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Log in to manage your tasks"
      footer={
        <AuthFooter
          prompt="New here? "
          linkText="Create an account"
          onLinkPress={() => navigation.navigate('Register')}
        />
      }
    >
      <Input
        label="Email"
        value={email}
        onChangeText={value => {
          setEmail(value);
          clearFieldError('email');
        }}
        placeholder="you@example.com"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        error={fieldErrors.email}
      />
      <Input
        label="Password"
        value={password}
        onChangeText={value => {
          setPassword(value);
          clearFieldError('password');
        }}
        placeholder="Your password"
        secureTextEntry
        error={fieldErrors.password}
      />

      {error ? <ErrorBanner message={error} /> : null}

      <Button title="Log In" onPress={handleLogin} loading={loading} />
    </AuthShell>
  );
};

export default LoginScreen;
