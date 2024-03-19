import { View, Text, Button, Colors } from 'react-native-ui-lib';
import { Dimensions } from 'react-native'
import React from 'react'
import navigationStrings from '../../../navigation/constants/navigationStrings';
import { useDispatch } from 'react-redux';
import { setAuth } from '../../../redux/slice/auth_slice';

const windowWidth = Dimensions.get('window').width;
export default function index(props) {
    const dispatch = useDispatch();


    const handleLogin = () => {
        props.navigation.replace(navigationStrings.AUTHENTICATED)
        const authData = {
            isAuth: true,
            userName: "Jeffrey@gmail.com"
        }
        dispatch(setAuth({ authData }))
    }
    
    return (
        <View useSafeArea={true} flex>
            <View flex paddingH-30 centerV paddingT-60>
                <View width={windowWidth / 1.5}>
                    <Text text20L underline>Pick app</Text>
                    <Text text40 color={"#5848ff"}>Lets get to your destination</Text>
                </View>
            </View>
            <View flex paddingH-30 centerV>
                <Button
                    label={'Login'}
                    onPress={handleLogin}
                    backgroundColor={Colors.dark}
                    enableShadow={true}
                    size={Button.sizes.large} />
            </View>
        </View>
    )
}