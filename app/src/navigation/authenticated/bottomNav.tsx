import React, { useRef } from "react";
import { ActivityIndicator, Platform, StyleSheet, TouchableOpacity } from "react-native";
import { register } from "react-native-bundle-splitter";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Colors, Text, View } from "react-native-ui-lib";
import navigationStrings from "../constants/navigationStrings"
const HomeScreen = register({ loader: () => import("../../screens/authenticated/home"), group: "MAPS", name: navigationStrings.HOME_LANDING });
const RecordScreen = register({ loader: () => import("../../screens/authenticated/record"), group: "MAPS", name: navigationStrings.MAPS });
const ProfileScreen = register({ loader: () => import("../../screens/authenticated/profile"), group: "MAPS", name: navigationStrings.PROFILE });

const Tab = createBottomTabNavigator();

const screenOptions = {
   tabBarStyle: { zIndex: 15, elevation: 15, backgroundColor: Colors.light, height: 94 },
   tabBarShowLabel: false,
   tabBarHideOnKeyboard: true,
   headerShown: false
}

const styles = StyleSheet.create({
   mainContainer: {
      height: 100,
      borderTopWidth: 1,
      borderColor: "rgba(62, 70, 99, 0.10)"
   },
   mainItemContainer: {
      flex: 1
   },
})

const tabIcon = (icon, label, focused) => {
   return (
      <View style={{ opacity: focused ? 1 : 0.5, alignItems: 'center' }}>
         <Text fontSize10>{label}</Text>
      </View>
   )
}

const HomeIcon = { tabBarIcon: ({ focused }) => tabIcon('Map', 'Map', focused), headerShown: false }
const RecordIcon = { tabBarIcon: ({ focused }) => tabIcon('Record', 'Record', focused), headerShown: false, tabBarLabel: "Log" }
const ProfileIcon = { tabBarIcon: ({ focused }) => tabIcon('Profile', 'Profile', focused), headerShown: false }



const TabBar = ({ state, descriptors, navigation }: any) => {

   return (
      <View backgroundColor={Colors.bgDefault} spread row style={styles.mainContainer}>
         {state.routes.map((route: any, index: number) => {
            const { options } = descriptors[route.key];
            const isFocused = state.index === index;

            const onPress = () => {
               const event = navigation.emit({
                  type: 'tabPress',
                  target: route.key,
               });

               if (!isFocused && !event.defaultPrevented) {
                  navigation.navigate(route.name);
               }
            };

            return (
               <TouchableOpacity
                  key={Math.random()}
                  onPress={onPress}
                  style={styles.mainItemContainer}
               >
                  <View flex-1 centerV centerH>
                     {options.tabBarIcon({ focused: isFocused })}
                  </View>
               </TouchableOpacity>
            );
         })}
      </View>
   );
}


export default function Index(props) {

   return (
      <>
         <Tab.Navigator screenOptions={screenOptions} tabBar={props => <TabBar {...props} />}>
            <Tab.Screen
               options={HomeIcon}
               name={navigationStrings.HOME}
               component={HomeScreen}
            />
            <Tab.Screen
               options={RecordIcon}
               name={navigationStrings.MAPS}
               component={RecordScreen}
            />
            <Tab.Screen
               options={ProfileIcon}
               name={navigationStrings.PROFILE}
               component={ProfileScreen}
            />
         </Tab.Navigator>

      </>
   );
}
