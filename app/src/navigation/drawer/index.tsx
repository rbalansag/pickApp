import React from "react";
import { DrawerContentScrollView, DrawerItemList, DrawerItem } from "@react-navigation/drawer";
import { DrawerNavigationHelpers, DrawerDescriptorMap } from "@react-navigation/drawer/lib/typescript/src/types";
import { DrawerNavigationState, ParamListBase } from "@react-navigation/native";
import { ScrollViewProps, ScrollView } from "react-native";

export default function drawerContent(props: any) {
   return (
      <DrawerContentScrollView {...props}>
         <DrawerItemList {...props} />
         <DrawerItem label="Close drawer" onPress={() => props.navigation.closeDrawer()} />
         <DrawerItem label="Toggle drawer" onPress={() => props.navigation.toggleDrawer()} />
      </DrawerContentScrollView>
   );
}
