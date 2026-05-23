import { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, ViewStyle } from 'react-native';

type Props = {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
};

export const Skeleton = ({ width = '100%', height = 16, borderRadius = 8, style }: Props) => {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, []);

  return (
    <Animated.View
      style={[
        {
          width: width as any,
          height,
          borderRadius,
          backgroundColor: '#E0E0E0',
          opacity,
        },
        style,
      ]}
    />
  );
};

export const ProductCardSkeleton = () => (
  <View style={styles.card}>
    <Skeleton width="100%" height={140} borderRadius={0} />
    <View style={styles.cardBody}>
      <Skeleton width={60} height={10} borderRadius={4} />
      <Skeleton width="90%" height={13} borderRadius={4} style={{ marginTop: 6 }} />
      <Skeleton width="70%" height={13} borderRadius={4} style={{ marginTop: 4 }} />
      <View style={styles.cardBottom}>
        <Skeleton width={50} height={16} borderRadius={4} />
        <Skeleton width={36} height={12} borderRadius={4} />
      </View>
    </View>
  </View>
);

export const ProductListSkeleton = () => (
  <View style={styles.grid}>
    {[1, 2, 3, 4, 5, 6].map((i) => (
      <ProductCardSkeleton key={i} />
    ))}
  </View>
);

export const HomeCategorySkeleton = () => (
  <View style={styles.categoryRow}>
    {[1, 2, 3, 4].map((i) => (
      <View key={i} style={styles.categoryItem}>
        <Skeleton width={56} height={56} borderRadius={12} />
        <Skeleton width={56} height={10} borderRadius={4} style={{ marginTop: 6 }} />
      </View>
    ))}
  </View>
);

export const HomeFeaturedSkeleton = () => (
  <View style={styles.featuredRow}>
    {[1, 2, 3].map((i) => (
      <View key={i} style={styles.featuredItem}>
        <Skeleton width={130} height={100} borderRadius={12} />
        <Skeleton width={100} height={12} borderRadius={4} style={{ marginTop: 8 }} />
        <Skeleton width={60} height={14} borderRadius={4} style={{ marginTop: 4 }} />
      </View>
    ))}
  </View>
);

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 12,
  },
  cardBody: { padding: 10, gap: 4 },
  cardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 12,
    gap: 12,
  },
  categoryRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
  },
  categoryItem: { alignItems: 'center' },
  featuredRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
  },
  featuredItem: { width: 130 },
});
