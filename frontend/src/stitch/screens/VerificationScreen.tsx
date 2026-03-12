import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { StitchIcon } from '../icons';
import { stitchColors, stitchRadius, stitchShadow } from '../theme';

export function VerificationScreen({
  onBack,
}: {
  onBack: () => void;
}) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={onBack} style={({ pressed }) => [styles.headerButton, pressed ? styles.pressed : null]}>
          <StitchIcon color={stitchColors.text} name="arrow_back" size={24} />
        </Pressable>
        <Text style={styles.headerTitle}>Verification</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.progressCard}>
          <View style={styles.progressTop}>
            <View style={styles.progressTitleRow}>
              <StitchIcon color={stitchColors.primary} name="verified_user" size={22} />
              <Text style={styles.progressTitle}>Profile Status</Text>
            </View>
            <View style={styles.progressBadge}>
              <Text style={styles.progressBadgeText}>Step 1 of 2</Text>
            </View>
          </View>
          <View style={styles.progressTrack}>
            <View style={styles.progressFill} />
          </View>
          <Text style={styles.progressCaption}>Pending: Student ID Verification</Text>
        </View>

        <View style={styles.heroText}>
          <Text style={styles.heroTitle}>Verify your identity</Text>
          <Text style={styles.heroBody}>
            To keep SkillSwap a safe and trusted community for students, we require a quick university ID verification.
          </Text>
        </View>

        <View style={styles.uploadCard}>
          <View style={styles.uploadIllustration}>
            <View style={styles.patternOverlay} />
            <StitchIcon color={stitchColors.primary} name="badge" size={84} />
            <View style={styles.cameraBadge}>
              <StitchIcon color={stitchColors.primary} name="add_a_photo" size={22} />
            </View>
          </View>

          <View style={styles.uploadBody}>
            <View>
              <Text style={styles.uploadTitle}>Student ID Card</Text>
              <Text style={styles.uploadSubtitle}>
                Upload a clear photo of your current, valid university ID card.
              </Text>
            </View>

            <View style={styles.checkList}>
              <View style={styles.checkRow}>
                <StitchIcon color={stitchColors.green} name="check_circle" size={18} />
                <Text style={styles.checkText}>Name and Photo must be clearly visible</Text>
              </View>
              <View style={styles.checkRow}>
                <StitchIcon color={stitchColors.green} name="check_circle" size={18} />
                <Text style={styles.checkText}>Expiry date must be in the future</Text>
              </View>
            </View>

            <Pressable style={({ pressed }) => [styles.uploadButton, pressed ? styles.pressed : null]}>
              <StitchIcon color={stitchColors.white} name="upload_file" size={20} />
              <Text style={styles.uploadButtonText}>Upload ID</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.whyCard}>
          <View style={styles.whyHeader}>
            <StitchIcon color={stitchColors.primary} name="shield_person" size={22} />
            <Text style={styles.whyTitle}>Why verification matters</Text>
          </View>

          <View style={styles.whyList}>
            <View style={styles.whyRow}>
              <View style={styles.whyIconWrap}>
                <StitchIcon color={stitchColors.primary} name="lock" size={16} />
              </View>
              <Text style={styles.whyText}>
                <Text style={styles.whyTextStrong}>Secure Community:</Text> Ensures all members are real students from verified institutions.
              </Text>
            </View>
            <View style={styles.whyRow}>
              <View style={styles.whyIconWrap}>
                <StitchIcon color={stitchColors.primary} name="handshake" size={16} />
              </View>
              <Text style={styles.whyText}>
                <Text style={styles.whyTextStrong}>Build Trust:</Text> Verified badges help you get more responses to your skill swap offers.
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <View style={styles.footerNote}>
            <StitchIcon color={stitchColors.slate400} name="encrypted" size={14} />
            <Text style={styles.footerNoteText}>Your data is encrypted and only used for verification.</Text>
          </View>
          <Pressable onPress={onBack}>
            <Text style={styles.skipText}>Skip for now</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: stitchColors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  headerButton: {
    width: 48,
    height: 48,
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    color: stitchColors.text,
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    marginRight: 48,
  },
  headerSpacer: {
    width: 48,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  progressCard: {
    marginHorizontal: 16,
    marginTop: 8,
    padding: 24,
    borderRadius: 16,
    backgroundColor: stitchColors.white,
    borderWidth: 1,
    borderColor: stitchColors.slate200,
    gap: 12,
    ...stitchShadow.card,
  },
  progressTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  progressTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  progressTitle: {
    color: stitchColors.text,
    fontSize: 16,
    fontWeight: '500',
  },
  progressBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: stitchRadius.pill,
    backgroundColor: 'rgba(55,19,236,0.10)',
  },
  progressBadgeText: {
    color: stitchColors.primary,
    fontSize: 13,
    fontWeight: '700',
  },
  progressTrack: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    backgroundColor: stitchColors.slate200,
  },
  progressFill: {
    width: '50%',
    height: '100%',
    borderRadius: 4,
    backgroundColor: stitchColors.primary,
  },
  progressCaption: {
    color: stitchColors.slate500,
    fontSize: 12,
  },
  heroText: {
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 16,
    alignItems: 'center',
  },
  heroTitle: {
    color: stitchColors.text,
    fontSize: 30,
    fontWeight: '700',
    textAlign: 'center',
  },
  heroBody: {
    marginTop: 12,
    color: stitchColors.slate600,
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
  },
  uploadCard: {
    marginHorizontal: 16,
    borderRadius: 16,
    backgroundColor: stitchColors.white,
    borderWidth: 1,
    borderColor: stitchColors.slate200,
    overflow: 'hidden',
    ...stitchShadow.card,
  },
  uploadIllustration: {
    aspectRatio: 16 / 9,
    backgroundColor: 'rgba(55,19,236,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    borderBottomWidth: 1,
    borderBottomColor: stitchColors.slate100,
  },
  patternOverlay: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.12,
    backgroundColor: 'transparent',
  },
  cameraBadge: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: stitchColors.white,
    ...stitchShadow.card,
  },
  uploadBody: {
    padding: 24,
    gap: 20,
  },
  uploadTitle: {
    color: stitchColors.text,
    fontSize: 22,
    fontWeight: '700',
  },
  uploadSubtitle: {
    marginTop: 6,
    color: stitchColors.slate500,
    fontSize: 14,
    lineHeight: 21,
  },
  checkList: {
    gap: 10,
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  checkText: {
    color: stitchColors.slate500,
    fontSize: 12,
  },
  uploadButton: {
    minHeight: 48,
    borderRadius: stitchRadius.pill,
    backgroundColor: stitchColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    ...stitchShadow.primary,
  },
  uploadButtonText: {
    color: stitchColors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  whyCard: {
    marginHorizontal: 24,
    marginTop: 24,
    padding: 20,
    borderRadius: 16,
    backgroundColor: 'rgba(55,19,236,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(55,19,236,0.10)',
  },
  whyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  whyTitle: {
    color: stitchColors.text,
    fontSize: 18,
    fontWeight: '700',
  },
  whyList: {
    gap: 16,
  },
  whyRow: {
    flexDirection: 'row',
    gap: 12,
  },
  whyIconWrap: {
    marginTop: 2,
  },
  whyText: {
    flex: 1,
    color: stitchColors.slate600,
    fontSize: 14,
    lineHeight: 22,
  },
  whyTextStrong: {
    color: stitchColors.text,
    fontWeight: '700',
  },
  footer: {
    marginTop: 24,
    alignItems: 'center',
    gap: 16,
    paddingHorizontal: 24,
  },
  footerNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  footerNoteText: {
    color: stitchColors.slate400,
    fontSize: 12,
  },
  skipText: {
    color: stitchColors.slate500,
    fontSize: 14,
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
  pressed: {
    opacity: 0.85,
  },
});
