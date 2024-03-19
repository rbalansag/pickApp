import React from "react";
import { createStackNavigator, TransitionPresets } from "@react-navigation/stack";
import { register } from "react-native-bundle-splitter";
import navigationStrings from "./constants/navigationStrings";
import { useSelector } from "react-redux";
import { selectAuth } from "../redux/slice/auth_slice";

const Authentication = register({ loader: () => import("./authentication"), group: "AUTHENTICATION" });
const Authenticated = register({ loader: () => import("./authenticated"), group: "AUTHENTICATED" });

export default function Index() {
   const Stack = createStackNavigator();
   const auth = useSelector(selectAuth);
   const initialRouteName = auth?.isAuth ? navigationStrings.AUTHENTICATED : navigationStrings.AUTHENTICATION;

   return (
      <>
         <Stack.Navigator initialRouteName={initialRouteName} screenOptions={{ headerShown: false }}>
            <Stack.Screen
               options={{ ...TransitionPresets.SlideFromRightIOS }}
               name={navigationStrings.AUTHENTICATION}
               component={Authentication}
            />
            <Stack.Screen
               options={{ ...TransitionPresets.SlideFromRightIOS }}
               name={navigationStrings.AUTHENTICATED}
               component={Authenticated}
            />
         </Stack.Navigator>
      </>
   );
}
