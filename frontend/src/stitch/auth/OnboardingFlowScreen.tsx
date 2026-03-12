import { ImageBackground, Pressable, StyleSheet, Text, View } from 'react-native';

import { stitchImages } from '../data';
import { StitchIcon } from '../icons';
import { stitchColors, stitchRadius, stitchShadow } from '../theme';

export function OnboardingFlowScreen({
  onGetStarted,
  onSkip,
}: {
  onGetStarted: () => void;
  onSkip: () => void;
}) {
  return (
    <View style={styles.container}>
      <View style={styles.phoneFrame}>
        <View style={styles.topBar}>
          <View style={styles.brandRow}>
            <View style={styles.brandIcon}>
              <StitchIcon color={stitchColors.white} name="swap_horiz" size={18} />
            </View>
            <Text style={styles.brandText}>SkillSwap</Text>
          </View>

          <Pressable onPress={onSkip} style={({ pressed }) => [pressed ? styles.pressed : null]}>
            <Text style={styles.skipText}>Skip</Text>
          </Pressable>
        </View>

        <View style={styles.content}>
          <View style={styles.illustrationWrap}>
            <View style={styles.illustrationGlow} />
            <View style={styles.illustrationCard}>
              <ImageBackground
                imageStyle={styles.heroImageStyle}
                source={{ uri: stitchImages.onboardingPreviewOne }}
                style={styles.heroImage}
              >
                <View style={styles.heroOverlay} />
                <View style={styles.heroBottomRow}>
                  <View style={styles.heroBadge}>
                    <StitchIcon color={stitchColors.white} name="handshake" size={20} />
                  </View>
                  <View style={styles.avatarStack}>
                    <View style={[styles.avatarCircle, styles.avatarOne]} />
                    <View style={[styles.avatarCircle, styles.avatarTwo]} />
                  </View>
                </View>
              </ImageBackground>
            </View>
          </View>

          <View style={styles.textWrap}>
            <Text style={styles.heading}>Connect and grow</Text>
            <Text style={styles.bodyText}>
              Join a community of thousands exchanging skills and growing together every day.
            </Text>
          </View>
        </View>

        <View style={styles.footer}>
          <View style={styles.progressDots}>
            <View style={styles.dotInactive} />
            <View style={styles.dotInactive} />
            <View style={styles.dotActive} />
          </View>

          <Pressable
            onPress={onGetStarted}
            style={({ pressed }) => [styles.primaryButton, pressed ? styles.pressed : null]}
          >
            <Text style={styles.primaryButtonText}>Get Started</Text>
            <StitchIcon color={stitchColors.white} name="arrow_forward" size={20} />
          </Pressable>
        </View>
      </View>

      <View style={styles.previewRail}>
        <View style={styles.previewCard}>
          <View style={styles.previewIconBox}>
            <StitchIcon color={stitchColors.primary} name="school" size={16} />
          </View>
          <View>
            <Text style={styles.previewTitle}>Slide 1 Preview</Text>
            <Text style={styles.previewSubtitle}>Teach what you know</Text>
          </View>
        </View>
        <View style={styles.previewCard}>
          <View style={styles.previewIconBox}>
            <StitchIcon color={stitchColors.primary} name="lightbulb" size={16} />
          </View>
          <View>
            <Text style={styles.previewTitle}>Slide 2 Preview</Text>
            <Text style={styles.previewSubtitle}>Learn what you want</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: stitchColors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  phoneFrame: {
    width: '100%',
    maxWidth: 420,
    height: 800,
    backgroundColor: stitchColors.white,
    borderRadius: stitchRadius.lg,
    overflow: 'hidden',
    ...stitchShadow.large,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 8,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brandIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: stitchColors.primary,
  },
  brandText: {
    fontSize: 18,
    fontWeight: '700',
    color: stitchColors.text,
  },
  skipText: {
    color: stitchColors.slate500,
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: 32,
  },
  illustrationWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  illustrationGlow: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: 'rgba(55,19,236,0.10)',
  },
  illustrationCard: {
    width: '100%',
    maxWidth: 280,
    aspectRatio: 1,
    borderRadius: stitchRadius.lg,
    backgroundColor: stitchColors.white,
    borderWidth: 1,
    borderColor: stitchColors.slate100,
    padding: 16,
    ...stitchShadow.large,
  },
  heroImage: {
    flex: 1,
    backgroundColor: stitchColors.slate50,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  heroImageStyle: {
    borderRadius: 12,
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(55,19,236,0.35)',
  },
  heroBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  heroBadge: {
    padding: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.30)',
    backgroundColor: 'rgba(255,255,255,0.20)',
  },
  avatarStack: {
    flexDirection: 'row',
    marginRight: 8,
  },
  avatarCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: stitchColors.white,
    backgroundColor: stitchColors.slate300,
    marginLeft: -8,
  },
  avatarOne: {
    backgroundColor: '#d7dce5',
  },
  avatarTwo: {
    backgroundColor: '#a8b1c0',
  },
  textWrap: {
    paddingVertical: 32,
    alignItems: 'center',
    gap: 16,
  },
  heading: {
    fontSize: 32,
    fontWeight: '800',
    color: stitchColors.text,
    textAlign: 'center',
  },
  bodyText: {
    maxWidth: 280,
    color: stitchColors.slate500,
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
  },
  footer: {
    paddingHorizontal: 32,
    paddingBottom: 32,
    gap: 24,
  },
  progressDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  dotInactive: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(55,19,236,0.20)',
  },
  dotActive: {
    width: 24,
    height: 8,
    borderRadius: 4,
    backgroundColor: stitchColors.primary,
  },
  primaryButton: {
    height: 56,
    borderRadius: stitchRadius.pill,
    backgroundColor: stitchColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    ...stitchShadow.primary,
  },
  primaryButtonText: {
    color: stitchColors.white,
    fontSize: 16,
    fontWeight: '700',
  },
  previewRail: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 16,
    gap: 8,
  },
  previewCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: 12,
    padding: 12,
    backgroundColor: stitchColors.white,
    borderWidth: 1,
    borderColor: stitchColors.slate200,
  },
  previewIconBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(55,19,236,0.10)',
  },
  previewTitle: {
    color: stitchColors.text,
    fontSize: 12,
    fontWeight: '700',
  },
  previewSubtitle: {
    color: stitchColors.slate500,
    fontSize: 12,
  },
  pressed: {
    opacity: 0.85,
  },
});
