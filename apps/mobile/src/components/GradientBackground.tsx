import { View, StyleSheet, type ViewStyle } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { gradients } from "../theme";

type Props = {
  style?: ViewStyle;
};

export function GradientBackground({ style }: Props) {
  return (
    <View style={[StyleSheet.absoluteFill, style]} pointerEvents="none">
      <LinearGradient
        colors={[...gradients.hero.colors]}
        locations={[...gradients.hero.locations]}
        start={gradients.hero.start}
        end={gradients.hero.end}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.glowYellow} />
      <View style={styles.glowOrange} />
    </View>
  );
}

export function GradientHeaderBackground() {
  return (
    <LinearGradient
      colors={[...gradients.sunset.colors]}
      locations={[...gradients.sunset.locations]}
      start={gradients.sunset.start}
      end={gradients.sunset.end}
      style={StyleSheet.absoluteFill}
    />
  );
}

const styles = StyleSheet.create({
  glowYellow: {
    position: "absolute",
    width: 260,
    height: 260,
    right: -50,
    top: "6%",
    borderRadius: 999,
    backgroundColor: "#FFE082",
    opacity: 0.45,
  },
  glowOrange: {
    position: "absolute",
    width: 200,
    height: 200,
    left: -30,
    bottom: "10%",
    borderRadius: 999,
    backgroundColor: "#FF8A50",
    opacity: 0.35,
  },
});
