import React from "react";
import { createStackNavigator, HeaderStyleInterpolators, CardStyleInterpolators } from "@react-navigation/stack";
import navigationStrings from "../constants/navigationStrings";
import { register } from "react-native-bundle-splitter";
import { createDrawerNavigator } from "@react-navigation/drawer";

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

// Import screens here
// MAIN_STACK group will be pre-loaded on splash screen for faster loading
const LANDING = register({
   loader: () => import("../../screens/landing"),
   group: "MAIN_STACK",
   name: navigationStrings.LANDING,
});
const HOME = register({
   loader: () => import("../../screens/_EXAMPLE/home"),
   group: "MAIN_STACK",
   name: navigationStrings.HOME,
});

// Add root screens to drawer
const Root = () => {
   return (
      <Drawer.Navigator>
         <Drawer.Screen name={navigationStrings.BRAND_NAME} component={LANDING} />
      </Drawer.Navigator>
   );
};

// Add screens to stack
export default () => {
   return (
      <>
         <Stack.Navigator
            screenOptions={{
               gestureEnabled: true,
               cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
               headerStyleInterpolator: HeaderStyleInterpolators.forFade,
               headerMode: "float",
               animationEnabled: true,
            }}
         >
            <Stack.Screen options={{ headerShown: false }} component={Root} name={"Root"} />
            <Stack.Screen
               options={{
                  headerShown: true,
               }}
               component={HOME}
               name={navigationStrings.HOME}
            />
         </Stack.Navigator>
      </>
   );
};
