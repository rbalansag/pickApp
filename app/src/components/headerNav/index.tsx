import { createStackNavigator, TransitionPresets } from "@react-navigation/stack";
import { View, Text, Colors } from "react-native-ui-lib";
import { RFValue } from "react-native-responsive-fontsize";

export default {
	...TransitionPresets.SlideFromRightIOS, 
	headerShown: true, 
	headerTitleAlign: 'center',
	headerTitleStyle: {
	  textAlign: 'center',
	  fontFamily: 'Goldplay-Medium',
	  fontSize: RFValue(16)
	},
	headerBackTitleVisible: false,
	headerBackImage: () => (
		<View style={{height: 40, justifyContent: 'center'}} marginL-20>
		</View>
	)
}