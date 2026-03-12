import { StyleSheet, Text, View } from 'react-native';

import { StitchIcon } from '../icons';
import { stitchColors, stitchRadius, stitchShadow } from '../theme';

export function StitchSplashScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.logoWrap}>
          <View style={styles.logoGlow} />
          <View style={styles.logoBox}>
            <StitchIcon color={stitchColors.white} name="sync_alt" size={52} />
          </View>
        </View>

        <View style={styles.titleWrap}>
          <Text style={styles.title}>SkillSwap</Text>
          <Text style={styles.subtitle}>Learn and share together</Text>
        </View>

        <View style={styles.progressWrap}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>Initializing</Text>
            <Text style={styles.progressValue}>30%</Text>
          </View>
          <View style={styles.progressTrack}>
            <View style={styles.progressFill} />
          </View>
        </View>

        <Text style={styles.version}>Version 2.0.4</Text>
      </View>

      <View style={styles.bgOrbTop} />
      <View style={styles.bgOrbBottom} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: stitchColors.background,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  card: {
    width: '100%',
    maxWidth: 360,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  logoWrap: {
    marginBottom: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoGlow: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(55,19,236,0.10)',
  },
  logoBox: {
    width: 128,
    height: 128,
    borderRadius: stitchRadius.lg,
    backgroundColor: stitchColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...stitchShadow.primary,
  },
  titleWrap: {
    alignItems: 'center',
  },
  title: {
    color: stitchColors.text,
    fontSize: 36,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    color: stitchColors.slate500,
    fontSize: 18,
    fontWeight: '500',
  },
  progressWrap: {
    width: '100%',
    maxWidth: 200,
    marginTop: 96,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressLabel: {
    color: stitchColors.primary,
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  progressValue: {
    color: stitchColors.slate400,
    fontSize: 11,
    fontWeight: '500',
  },
  progressTrack: {
    height: 6,
    width: '100%',
    backgroundColor: stitchColors.slate200,
    borderRadius: stitchRadius.pill,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    width: '30%',
    backgroundColor: stitchColors.primary,
    borderRadius: stitchRadius.pill,
  },
  version: {
    position: 'absolute',
    bottom: -120,
    color: stitchColors.slate400,
    fontSize: 14,
    fontWeight: '500',
  },
  bgOrbTop: {
    position: 'absolute',
    top: -72,
    left: -72,
    width: 256,
    height: 256,
    borderRadius: 128,
    backgroundColor: 'rgba(55,19,236,0.12)',
  },
  bgOrbBottom: {
    position: 'absolute',
    bottom: -72,
    right: -72,
    width: 256,
    height: 256,
    borderRadius: 128,
    backgroundColor: 'rgba(55,19,236,0.12)',
  },
});
