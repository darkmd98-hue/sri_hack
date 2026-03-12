import { Image, ImageStyle, Pressable, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';

import { StitchIcon } from '../icons';
import { stitchColors, stitchRadius, stitchShadow } from '../theme';

export function StitchIconButton({
  icon,
  onPress,
  size = 40,
  backgroundColor = 'transparent',
  color = stitchColors.text,
  bordered = false,
  style,
}: {
  icon: string;
  onPress?: () => void;
  size?: number;
  backgroundColor?: string;
  color?: string;
  bordered?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.iconButton,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor,
          borderWidth: bordered ? StyleSheet.hairlineWidth : 0,
          borderColor: bordered ? stitchColors.borderStrong : 'transparent',
        },
        style,
        pressed ? styles.pressed : null,
      ]}
    >
      <StitchIcon color={color} name={icon} size={Math.max(18, size * 0.52)} />
    </Pressable>
  );
}

export function StitchNavItem({
  active = false,
  badge = false,
  icon,
  label,
  onPress,
  uppercase = false,
}: {
  active?: boolean;
  badge?: boolean;
  icon: string;
  label: string;
  onPress?: () => void;
  uppercase?: boolean;
}) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.navItem, pressed ? styles.pressed : null]}>
      <View>
        <StitchIcon
          color={active ? stitchColors.primary : stitchColors.slate400}
          name={icon}
          size={22}
        />
        {badge ? <View style={styles.navBadge} /> : null}
      </View>
      <Text style={[styles.navLabel, active ? styles.navLabelActive : null, uppercase ? styles.navLabelUpper : null]}>
        {label}
      </Text>
    </Pressable>
  );
}

export function StitchAvatar({
  size,
  uri,
  rounded = true,
  style,
}: {
  size: number;
  uri?: string;
  rounded?: boolean;
  style?: StyleProp<ImageStyle>;
}) {
  return (
    <Image
      source={uri ? { uri } : undefined}
      style={[
        {
          width: size,
          height: size,
          borderRadius: rounded ? size / 2 : stitchRadius.lg,
          backgroundColor: stitchColors.slate200,
        },
        style,
      ]}
    />
  );
}

export const stitchCommonStyles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: stitchColors.background,
  },
  pageDark: {
    backgroundColor: stitchColors.backgroundDark,
  },
  card: {
    backgroundColor: stitchColors.panel,
    borderRadius: stitchRadius.lg,
    borderWidth: 1,
    borderColor: stitchColors.border,
    ...stitchShadow.card,
  },
  primaryCard: {
    backgroundColor: stitchColors.primary,
    borderRadius: stitchRadius.lg,
    ...stitchShadow.primary,
  },
});

const styles = StyleSheet.create({
  iconButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  navLabel: {
    color: stitchColors.slate400,
    fontSize: 10,
    fontWeight: '500',
  },
  navLabelActive: {
    color: stitchColors.primary,
    fontWeight: '700',
  },
  navLabelUpper: {
    textTransform: 'uppercase',
    letterSpacing: 0.9,
  },
  navBadge: {
    position: 'absolute',
    top: -1,
    right: -2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: stitchColors.danger,
    borderWidth: 2,
    borderColor: stitchColors.white,
  },
  pressed: {
    opacity: 0.82,
  },
});
