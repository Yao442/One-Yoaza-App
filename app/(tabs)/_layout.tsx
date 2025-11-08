// template
import { Tabs } from "expo-router";
import { Images, Building2, Tv, ShoppingBag, User } from "lucide-react-native";
import React from "react";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#fff",
        tabBarInactiveTintColor: "#666",
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#000',
          borderTopColor: '#1a1a1a',
          borderTopWidth: 1,
          height: 85,
          paddingBottom: 10,
          paddingTop: 8,
        },
      }}
    >
      <Tabs.Screen
        name="(social)"
        options={{
          title: "Social",
          tabBarIcon: ({ color }) => <Images size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="palace"
        options={{
          title: "The Palace",
          tabBarIcon: ({ color }) => <Building2 size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="entertainment"
        options={{
          title: "Entertainment",
          tabBarIcon: ({ color }) => <Tv size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="marketplace"
        options={{
          title: "Market Place",
          tabBarIcon: ({ color }) => <ShoppingBag size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => <User size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="videos"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="festivals"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="heritage"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
