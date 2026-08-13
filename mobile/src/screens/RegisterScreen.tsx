import React, { useEffect, useState } from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import AuthFooter from '../components/AuthFooter';
import AuthShell from '../components/AuthShell';
import Button from '../components/Button';
import ErrorBanner from '../components/ErrorBanner';
import Input from '../components/Input';
import { useAppDispatch, useAppSelector } from '../store';
import { clearError, register } from '../store/authSlice';
import { AuthStackParamList } from '../navigation/AuthNavigator';
import { isValidEmail } from '../utils/validation';

type Props = NativeStackScreenProps<AuthStackParamList, 'Register'>;

interface FieldErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

const RegisterScreen = ({ navigation }: Props) => {
  const dispatch = useAppDispatch();
  const loading = useAppSelector(state => state.auth.loading);
  const error = useAppSelector(state => state.auth.error);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const clearFieldError = (field: keyof FieldErrors) => {
    setFieldErrors(prev => (prev[field] ? { ...prev, [field]: undefined } : prev));
  };

  const handleRegister = () => {
    const errors: FieldErrors = {};
    if (!name.trim()) {
      errors.name = 'Name is required';
    }
    if (!email.trim()) {
      errors.email = 'Email is required';
    } else if (!isValidEmail(email.trim())) {
      errors.email = 'Enter a valid email address';
    }
    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    if (!confirmPassword) {
      errors.confirmPassword = 'Confirm your password';
    } else if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    dispatch(register({ name: name.trim(), email: email.trim(), password }));
  };

  return (
    <AuthShell
      title="Create your account"
      subtitle="Start managing your tasks today"
      footer={
        <AuthFooter
          prompt="Already have an account? "
          linkText="Log in"
          onLinkPress={() => navigation.navigate('Login')}
        />
      }
    >
      <Input
        label="Name"
        value={name}
        onChangeText={value => {
          setName(value);
          clearFieldError('name');
        }}
        placeholder="Your name"
        autoCorrect={false}
        error={fieldErrors.name}
      />
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
          if (confirmPassword) clearFieldError('confirmPassword');
        }}
        placeholder="At least 6 characters"
        secureTextEntry
        error={fieldErrors.password}
      />
      <Input
        label="Confirm password"
        value={confirmPassword}
        onChangeText={value => {
          setConfirmPassword(value);
          clearFieldError('confirmPassword');
        }}
        placeholder="Repeat your password"
        secureTextEntry
        error={fieldErrors.confirmPassword}
      />

      {error ? <ErrorBanner message={error} /> : null}

      <Button title="Create Account" onPress={handleRegister} loading={loading} />
    </AuthShell>
  );
};

export default RegisterScreen;
