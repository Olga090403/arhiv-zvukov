export const gradients = {
  sunset: {
    colors: ["#FFE259", "#F2C94C", "#FFB347", "#FF8C42", "#FF6B35"] as const,
    locations: [0, 0.28, 0.55, 0.78, 1] as const,
    start: { x: 0, y: 1 },
    end: { x: 1, y: 0 },
  },
  hero: {
    colors: ["#FFF9C4", "#FFE082", "#FFD54F", "#FFB74D", "#FF8A50", "#FF6B35"] as const,
    locations: [0, 0.18, 0.38, 0.58, 0.78, 1] as const,
    start: { x: 0.2, y: 1 },
    end: { x: 0.8, y: 0 },
  },
};

export const colors = {
  brand: {
    black: "#0F0F12",
    amber: "#F2C94C",
    orange: "#FF6B35",
    violet: "#7C5CFF",
  },
  bg: {
    paper: "#FFF8ED",
    dark: "#16161A",
  },
  text: {
    primary: "#0F0F12",
    secondary: "#5C5348",
    light: "#EDEDEF",
    muted: "#8A7F72",
  },
  border: "#FFD699",
  card: "#FFFFFF",
  cardSolid: "#FFF0D4",
  destructive: "#E53935",
  success: "#43A047",
  pending: "#FB8C00",
};

export const fonts = {
  heading: "Unbounded_400Regular",
  headingBold: "Unbounded_700Bold",
  body: "Inter_400Regular",
  bodyMedium: "Inter_500Medium",
  bodySemiBold: "Inter_600SemiBold",
  mono: "JetBrainsMono_400Regular",
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 999,
};
