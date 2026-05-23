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
        colors={gradients.warm.colors}
        locations={gradients.warm.locations}
        start={gradients.warm.start}
        end={gradients.warm.end}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.amberBlob} />
      <View style={styles.pinkBlob} />
    </View>
  );
}

export function GradientHeaderBackground() {
  return (
    <LinearGradient
      colors={gradients.warm.colors}
      locations={gradients.warm.locations}
      start={gradients.warm.start}
      end={gradients.warm.end}
      style={StyleSheet.absoluteFill}
    />
  );
}

const styles = StyleSheet.create({
  amberBlob: {
    position: "absolute",
    width: 280,
    height: 240,
    right: -40,
    top: "12%",
    borderRadius: 999,
    backgroundColor: "#F2C94C",
    opacity: 0.35,
  },
  pinkBlob: {
    position: "absolute",
    width: 200,
    height: 180,
    left: "8%",
    bottom: "8%",
    borderRadius: 999,
    backgroundColor: "#FFB88C",
    opacity: 0.25,
  },
});
