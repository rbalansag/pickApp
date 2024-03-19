// library imports
import React, { useEffect, useRef } from "react";
import { Text, View, Colors, Button } from "react-native-ui-lib";
import { createStackNavigator, TransitionPresets } from "@react-navigation/stack";
import { register } from "react-native-bundle-splitter";
import { ActivityIndicator, Platform, StatusBar, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux'
import { PanResponder, Animated } from "react-native";
import { resetToast, selectToast } from "../../redux/slice/toast_slice";

// component imports
import navigationStrings from "../constants/navigationStrings"

const Toast = register<any>({
   loader: () => import("../../components/toast"),
   cached: false,
   placeholder: () => (<></>),
});


import HeaderNav from "../../components/headerNav";


const BottomNav = register({ loader: () => import("./bottomNav"), group: "BOTTOMNAV", name: navigationStrings.MAIN_NAVIGATION });


export default function Index(props) {
   const Stack = createStackNavigator();

   React.useEffect(() => {
      StatusBar.setBarStyle('light-content');
   }, [])

   return (
      <>
         <Stack.Navigator screenOptions={HeaderNav}>
            <Stack.Screen
               options={{ ...TransitionPresets.SlideFromRightIOS, headerShown: false }}
               name={navigationStrings.MAIN_NAVIGATION}
               component={BottomNav}
            />
           
         </Stack.Navigator>
         <Toast/>
      </>
   );
}
