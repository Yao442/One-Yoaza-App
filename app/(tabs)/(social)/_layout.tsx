import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { withLayoutContext } from 'expo-router';
import { Platform, StyleSheet } from 'react-native';

const { Navigator } = createMaterialTopTabNavigator();

export const MaterialTopTabs = withLayoutContext(Navigator);

export default function SocialLayout() {
  return (
    <MaterialTopTabs
      screenOptions={{
        tabBarActiveTintColor: '#fff',
        tabBarInactiveTintColor: '#666',
        tabBarStyle: styles.tabBar,
        tabBarIndicatorStyle: styles.indicator,
        tabBarLabelStyle: styles.label,
        tabBarScrollEnabled: true,
        tabBarPressColor: 'rgba(255, 255, 255, 0.1)',
      }}
    >
      <MaterialTopTabs.Screen
        name="home"
        options={{
          title: 'Home',
        }}
      />
      <MaterialTopTabs.Screen
        name="communities"
        options={{
          title: 'Communities',
        }}
      />
    </MaterialTopTabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#000',
    borderBottomColor: '#1a1a1a',
    borderBottomWidth: 1,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    height: Platform.OS === 'ios' ? 100 : 80,
  },
  indicator: {
    backgroundColor: '#fff',
    height: 2,
  },
  label: {
    fontSize: 15,
    fontWeight: '600' as const,
    textTransform: 'none' as const,
  },
});
