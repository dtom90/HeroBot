import { Ionicons } from '@expo/vector-icons';
import { Drawer } from 'expo-router/drawer';

import { VALID_HEROES, HERO_CONFIGS } from '~/utils/heroNavigation';

const DrawerLayout = () => {
  return (
    <Drawer>
      <Drawer.Screen
        name="index"
        options={{
          headerTitle: 'Home',
          drawerLabel: 'Home',
          drawerIcon: ({ size, color }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
    </Drawer>
  );
};

export default DrawerLayout;
