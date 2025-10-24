// template
import { Tabs } from "expo-router";
import { Building2, PartyPopper, BookOpen, Landmark, User } from "lucide-react-native";
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
        name="index"
        options={{
          title: "Gallery",
          tabBarIcon: ({ color }) => <Building2 size={24} color={color} />,
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
        name="festivals"
        options={{
          title: "Festivals",
          tabBarIcon: ({ color }) => <PartyPopper size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: "History",
          tabBarIcon: ({ color }) => <BookOpen size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="heritage"
        options={{
          title: "Heritage",
          tabBarIcon: ({ color }) => <Landmark size={24} color={color} />,
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
    </Tabs>
  );
}
