import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, spacing, fontSize, fontWeights } from '../theme/theme';

interface AuthFooterProps {
  prompt: string;
  linkText: string;
  onLinkPress: () => void;
}

// Bottom link row under the auth forms, e.g. "New here? Create an account"
const AuthFooter = ({ prompt, linkText, onLinkPress }: AuthFooterProps) => (
  <View style={styles.row}>
    <Text style={styles.text}>{prompt}</Text>
    <Pressable onPress={onLinkPress} hitSlop={8}>
      <Text style={styles.link}>{linkText}</Text>
    </Pressable>
  </View>
);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.lg,
  },
  text: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
  },
  link: {
    color: colors.primary,
    fontSize: fontSize.sm,
    fontWeight: fontWeights.semibold,
  },
});

export default AuthFooter;
