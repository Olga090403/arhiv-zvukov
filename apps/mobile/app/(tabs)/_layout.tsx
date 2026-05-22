import { Pressable } from "react-native";
import { Tabs, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { colors, fonts } from "../../src/theme";
import { useAuth } from "../../src/lib/AuthProvider";

export default function TabsLayout() {
  const router = useRouter();
  const { user, signOut } = useAuth();

  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: colors.bg.paper },
        headerTitleStyle: { fontFamily: fonts.headingBold, fontSize: 18, color: colors.text.primary },
        headerShadowVisible: false,
        headerRight: () => (
          <Pressable
            style={{ marginRight: 16 }}
            onPress={() => {
              if (user) {
                signOut();
              } else {
                router.push("/auth");
              }
            }}
          >
            <Ionicons
              name={user ? "log-out-outline" : "person-circle-outline"}
              size={26}
              color={user ? colors.text.muted : colors.brand.amber}
            />
          </Pressable>
        ),
        tabBarStyle: {
          backgroundColor: colors.bg.paper,
          borderTopColor: colors.border,
          height: 88,
          paddingBottom: 28,
          paddingTop: 8,
        },
        tabBarActiveTintColor: colors.brand.amber,
        tabBarInactiveTintColor: colors.text.muted,
        tabBarLabelStyle: { fontFamily: fonts.bodyMedium, fontSize: 11 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Главная",
          headerTitle: "Архив звуков",
          tabBarIcon: ({ color, size }) => <Ionicons name="home-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="record"
        options={{
          title: "Запись",
          tabBarIcon: ({ color, size }) => <Ionicons name="mic-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Поиск",
          headerTitle: "Голосовой поиск",
          tabBarIcon: ({ color, size }) => <Ionicons name="search-outline" size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
