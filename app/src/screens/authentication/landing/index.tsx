import { View, Text, Button, Colors } from 'react-native-ui-lib';
import { Dimensions, PermissionsAndroid } from 'react-native'
import React, { useEffect, useState } from 'react'
import navigationStrings from '../../../navigation/constants/navigationStrings';
import { useDispatch } from 'react-redux';
import { setAuth } from '../../../redux/slice/auth_slice';
import Geolocation from '@react-native-community/geolocation';
import { setUser } from '../../../redux/slice/user_slice';
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";

const windowWidth = Dimensions.get('window').width;
export default function index(props) {
    const dispatch = useDispatch();
    const [currentLocation, setCurrentLocation] = useState(null);

    useEffect(() => {
        requestLocationPermission();

        getCurrentLocation();
    }, []);

    const requestLocationPermission = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    title: 'Location Permission',
                    message: 'This app requires access to your location.',
                    buttonPositive: 'OK',
                }
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log('Location permission granted');
            } else {
                console.log('Location permission denied');
            }
        } catch (err) {
            console.warn(err);
        }
    };


    const getCurrentLocation = () => {
        Geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setCurrentLocation({ latitude, longitude });
            },
            (error) => {
                console.error(error);
            },
            { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
        );
    };

    const handleLogin = () => {
        props.navigation.replace(navigationStrings.AUTHENTICATED)
        const authData = {
            isAuth: true,
            userName: "Jeffrey@gmail.com",
            id: uuidv4()
        }
        const userData = {
            userId: authData.id,
            latitude: currentLocation?.latitude || 0,
            longitude: currentLocation?.longitude || 0,
        }
        dispatch(setAuth({ authData }))
        dispatch(setUser({ userData }))
    }

    return (
        <View useSafeArea={true} flex backgroundColor={Colors.green40}>
            <View flex paddingH-30 centerV paddingT-60>
                <View width={windowWidth / 1.5}>
                    <Text text20L underline color={Colors.white}>Pick app</Text>
                    <Text text40 color={Colors.white}>Lets get to your destination</Text>
                </View>
            </View>
            <View flex paddingH-30 centerV>
                <Button
                    label={'Login'}
                    onPress={handleLogin}
                    backgroundColor={Colors.orange30}
                    enableShadow={true}
                    size={Button.sizes.large} />
            </View>
        </View>
    )
}