import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { ProductCard } from '../../src/components/ProductCard';
import { SectionTitle } from '../../src/components/SectionTitle';
import { SiteHeader } from '../../src/components/SiteHeader';
import { useProductCatalog } from '../../src/context/ProductCatalogContext';
import { colors, layout, spacing } from '../../src/theme';

export default function HomeScreen() {
  const router = useRouter();
  const { products } = useProductCatalog();
  const { width } = useWindowDimensions();
  const isDesktop = width >= layout.desktopBreakpoint;
  const featuredProduct = products[0];

  const openCustomizer = () => {
    if (featuredProduct) {
      router.push({ pathname: '/produto/[slug]', params: { slug: featuredProduct.slug } });
      return;
    }
    router.push('/(tabs)/catalogo');
  };

  return (
    <View style={styles.screen}>
      <SiteHeader />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.page}>
          <ImageBackground
            source={require('../../assets/images/hero-banner.png')}
            resizeMode="cover"
            style={[styles.hero, isDesktop && styles.heroDesktop]}
            imageStyle={styles.heroImage}
          >
            <View pointerEvents="none" style={styles.heroOverlay} />
            <View style={[styles.heroCopy, isDesktop && styles.heroCopyDesktop]}>
              <Text style={[styles.heroTitle, isDesktop && styles.heroTitleDesktop]}>
                Adesivos personalizados para <Text style={styles.blue}>destacar</Text> sua{' '}
                <Text style={styles.pink}>marca.</Text>
              </Text>
              <Text style={[styles.heroText, isDesktop && styles.heroTextDesktop]}>
                Impressão de alta definição, materiais premium e acabamento impecável para o seu negócio.
              </Text>
              <View style={styles.heroButtons}>
                <Pressable accessibilityRole="button" style={styles.primaryButton} onPress={openCustomizer}>
                  <Text style={styles.primaryText}>Criar meu adesivo</Text>
                  <Ionicons name="arrow-forward" size={17} color={colors.white} />
                </Pressable>
                <Pressable accessibilityRole="button" style={styles.outlineButton} onPress={() => router.push('/(tabs)/catalogo')}>
                  <Text style={styles.outlineText}>Ver catálogo</Text>
                </Pressable>
              </View>
            </View>
          </ImageBackground>

          <View style={[styles.benefits, isDesktop && styles.benefitsDesktop]}>
            <Benefit icon="shield-checkmark-outline" title="Materiais premium" text="Mais resistência e durabilidade." />
            <Benefit icon="scan-outline" title="Alta definição" text="Cores vivas e detalhes incríveis." />
            <Benefit icon="headset-outline" title="Atendimento especializado" text="Do pedido à entrega, com você." />
          </View>

          <View style={[styles.section, isDesktop && styles.sectionDesktop]}>
            <SectionTitle action="Ver todos">Mais <Text style={styles.pink}>vendidos</Text></SectionTitle>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalProducts}>
              {products.slice(0, 4).map((product) => (
                <View key={product.id} style={[styles.horizontalCard, isDesktop && styles.horizontalCardDesktop]}>
                  <ProductCard product={product} />
                </View>
              ))}
            </ScrollView>
          </View>

          <ImageBackground
            source={require('../../assets/images/hero-products.png')}
            resizeMode="cover"
            style={[styles.promo, isDesktop && styles.promoDesktop]}
            imageStyle={styles.promoImage}
          >
            <View style={[styles.promoShade, isDesktop && styles.promoShadeDesktop]}>
              <Text style={[styles.promoTitle, isDesktop && styles.promoTitleDesktop]}>Sua marca. <Text style={styles.pink}>Do seu jeito.</Text></Text>
              <Text style={[styles.promoText, isDesktop && styles.promoTextDesktop]}>
                Personalize seus adesivos com o formato, tamanho e acabamento que combinam com a identidade da sua marca.
              </Text>
              <Pressable accessibilityRole="button" style={styles.promoButton} onPress={openCustomizer}>
                <Text style={styles.primaryText}>Criar meu adesivo</Text>
                <Ionicons name="arrow-forward" size={17} color={colors.white} />
              </Pressable>
            </View>
          </ImageBackground>

          <View style={[styles.section, isDesktop && styles.sectionDesktop]}>
            <SectionTitle action="Ver todos">Destaques <Text style={styles.pink}>personalizados</Text></SectionTitle>
            <View style={styles.grid}>
              {products.slice(4, 8).map((product) => (
                <View key={product.id} style={[styles.gridItem, isDesktop && styles.gridItemDesktop]}>
                  <ProductCard product={product} />
                </View>
              ))}
            </View>
          </View>

          <View style={[styles.how, isDesktop && styles.howDesktop]}>
            <SectionTitle>Como <Text style={styles.pink}>funciona</Text></SectionTitle>
            <View style={[styles.steps, isDesktop && styles.stepsDesktop]}>
              <Step number="1" title="Escolha" text="Encontre o modelo, formato e acabamento ideal." />
              <Step number="2" title="Envie sua arte" text="Mande o arquivo ou as informações do seu projeto." />
              <Step number="3" title="Produzimos" text="Cuidamos da impressão com atenção aos detalhes." />
              <Step number="4" title="Receba" text="Seu pedido chega pronto para usar." />
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function Benefit({ icon, title, text }: { icon: keyof typeof Ionicons.glyphMap; title: string; text: string }) {
  return (
    <View style={styles.benefit}>
      <View style={styles.benefitIcon}><Ionicons name={icon} size={24} color={colors.blue} /></View>
      <View style={styles.benefitCopy}>
        <Text style={styles.benefitTitle}>{title}</Text>
        <Text style={styles.benefitText}>{text}</Text>
      </View>
    </View>
  );
}

function Step({ number, title, text }: { number: string; title: string; text: string }) {
  return (
    <View style={styles.step}>
      <View style={styles.stepNumber}><Text style={styles.stepNumberText}>{number}</Text></View>
      <View style={styles.stepCopy}><Text style={styles.stepTitle}>{title}</Text><Text style={styles.stepText}>{text}</Text></View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.white },
  content: { paddingBottom: 48 },
  page: { width: '100%', maxWidth: layout.maxWidth, alignSelf: 'center' },
  hero: { minHeight: 380, justifyContent: 'center', margin: spacing.md, marginBottom: 0, paddingHorizontal: spacing.lg, borderRadius: 16, overflow: 'hidden', backgroundColor: colors.blueSoft },
  heroDesktop: { minHeight: 470, marginHorizontal: spacing.lg, marginTop: spacing.lg, paddingHorizontal: spacing.xxl, borderRadius: 20 },
  heroImage: { width: '100%', height: '100%', opacity: 0.32 },
  heroOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(255,255,255,0.34)' },
  heroCopy: { maxWidth: 430 },
  heroCopyDesktop: { maxWidth: 570 },
  heroTitle: { fontSize: 31, lineHeight: 37, fontWeight: '900', color: colors.ink },
  heroTitleDesktop: { fontSize: 48, lineHeight: 54 },
  blue: { color: colors.blue },
  pink: { color: colors.pink },
  heroText: { marginTop: 14, color: colors.text, fontSize: 15, lineHeight: 22, maxWidth: 320 },
  heroTextDesktop: { fontSize: 18, lineHeight: 27, maxWidth: 480 },
  heroButtons: { flexDirection: 'row', gap: 12, marginTop: 24, flexWrap: 'wrap' },
  primaryButton: { minHeight: 48, paddingHorizontal: 20, borderRadius: 9, backgroundColor: colors.blue, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 9 },
  primaryText: { color: colors.white, fontSize: 13, fontWeight: '800', textTransform: 'uppercase' },
  outlineButton: { minHeight: 48, paddingHorizontal: 20, borderRadius: 9, borderWidth: 1.5, borderColor: colors.pink, backgroundColor: 'rgba(255,255,255,0.82)', alignItems: 'center', justifyContent: 'center' },
  outlineText: { color: colors.ink, fontSize: 13, fontWeight: '800', textTransform: 'uppercase' },
  benefits: { margin: spacing.md, padding: spacing.md, borderWidth: 1, borderColor: colors.line, borderRadius: 14, gap: 16, backgroundColor: colors.white },
  benefitsDesktop: { marginHorizontal: spacing.lg, marginVertical: spacing.lg, paddingHorizontal: spacing.xl, paddingVertical: 22, flexDirection: 'row', gap: spacing.xl },
  benefit: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 12 },
  benefitIcon: { width: 42, height: 42, borderRadius: 21, backgroundColor: colors.blueSoft, alignItems: 'center', justifyContent: 'center' },
  benefitCopy: { flex: 1 },
  benefitTitle: { fontSize: 14, color: colors.ink, fontWeight: '800' },
  benefitText: { color: colors.text, fontSize: 12, lineHeight: 17, marginTop: 2 },
  section: { padding: spacing.md, paddingTop: 26 },
  sectionDesktop: { paddingHorizontal: spacing.lg, paddingTop: 36 },
  horizontalProducts: { gap: 14, paddingBottom: 4 },
  horizontalCard: { width: 260 },
  horizontalCardDesktop: { width: 275 },
  promo: { marginHorizontal: spacing.md, marginTop: spacing.lg, minHeight: 210, borderRadius: 14, overflow: 'hidden', backgroundColor: '#101317' },
  promoDesktop: { marginHorizontal: spacing.lg, minHeight: 290, borderRadius: 18 },
  promoImage: { width: '100%', height: '100%', opacity: 0.46 },
  promoShade: { padding: spacing.lg, justifyContent: 'center', flex: 1 },
  promoShadeDesktop: { paddingHorizontal: spacing.xxl },
  promoTitle: { color: colors.white, fontSize: 25, lineHeight: 31, fontWeight: '900' },
  promoTitleDesktop: { fontSize: 38, lineHeight: 44 },
  promoText: { color: '#E8EBF0', fontSize: 13, lineHeight: 19, maxWidth: 300, marginTop: 8 },
  promoTextDesktop: { fontSize: 16, lineHeight: 24, maxWidth: 520 },
  promoButton: { alignSelf: 'flex-start', marginTop: 18, minHeight: 46, paddingHorizontal: 18, borderRadius: 8, backgroundColor: colors.blue, flexDirection: 'row', alignItems: 'center', gap: 8 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 14 },
  gridItem: { width: '48%' },
  gridItemDesktop: { width: '23.75%' },
  how: { padding: spacing.md, paddingTop: 22 },
  howDesktop: { paddingHorizontal: spacing.lg, paddingTop: 40 },
  steps: { gap: 16 },
  stepsDesktop: { flexDirection: 'row', gap: spacing.lg },
  step: { flex: 1, flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  stepCopy: { flex: 1 },
  stepNumber: { width: 32, height: 32, borderRadius: 16, backgroundColor: colors.blue, alignItems: 'center', justifyContent: 'center' },
  stepNumberText: { color: colors.white, fontWeight: '900' },
  stepTitle: { fontWeight: '800', color: colors.ink, fontSize: 15 },
  stepText: { color: colors.text, fontSize: 13, marginTop: 3, lineHeight: 19 },
});
