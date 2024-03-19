// library imports
import React from "react";
import { createStackNavigator, TransitionPresets } from "@react-navigation/stack";
import { register } from "react-native-bundle-splitter";

// component imports
import navigationStrings from "../constants/navigationStrings"
const LandingScreen = register({ loader: () => import("../../screens/authentication/landing"), group: "LANDING", name: navigationStrings.AUTHENTICATION_LANDING });

export default function Index() {
   const Stack = createStackNavigator();

   return (
      <>
         <Stack.Navigator
            screenOptions={{ headerShown: false }}
         >
            <Stack.Screen
               options={{ ...TransitionPresets.SlideFromRightIOS, headerShown: false }}
               name={navigationStrings.AUTHENTICATION_LANDING}
               component={LandingScreen}
            />
         </Stack.Navigator>
      </>
   );
}
