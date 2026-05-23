import { View, StyleSheet, type ViewStyle } from "react-native";
import { colors } from "../theme";

type Props = {
  style?: ViewStyle;
};

/** Warm paper background with subtle amber glow — §10 design */
export function GradientBackground({ style }: Props) {
  return (
    <View style={[StyleSheet.absoluteFill, styles.paper, style]} pointerEvents="none">
      <View style={styles.amberGlow} />
    </View>
  );
}

export function GradientHeaderBackground() {
  return <View style={[StyleSheet.absoluteFill, styles.paperHeader]} />;
}

const styles = StyleSheet.create({
  paper: {
    backgroundColor: colors.bg.paper,
  },
  paperHeader: {
    backgroundColor: colors.bg.paper,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  amberGlow: {
    position: "absolute",
    width: 320,
    height: 280,
    right: -60,
    top: "8%",
    borderRadius: 999,
    backgroundColor: colors.brand.amber,
    opacity: 0.12,
  },
});
