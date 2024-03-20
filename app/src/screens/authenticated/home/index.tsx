import React, { useEffect, useState } from 'react';
import { Dimensions } from 'react-native';
import MapView from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser } from '../../../redux/slice/user_slice';
import { Button, Colors, Text, TouchableOpacity, View } from 'react-native-ui-lib';
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import useGetBookingInfo from './customHooks/useGetBookingInfo';
import { resetLogBook, selectActive, selectLog, selectLogBook, setLogBook } from '../../../redux/slice/logBook_slice';
import useGetCurrentLocation from './customHooks/useGetCurrentLocation';
import Modal from './components/modal';
import MapMarker from './components/mapMarkers'

const windowHeight = Dimensions.get('window').height;
const refreshRate = 30000;

export default function MapScreen() {
    const dispatch = useDispatch();
    // dispatch(resetLogBook())
    const user = useSelector(selectUser);
    const LogBook = useSelector(selectLog);
    const ActiveBooking = useSelector(selectActive);

    useGetBookingInfo(user, ActiveBooking);
    const { currentLocation } = useGetCurrentLocation(user, refreshRate);

    const [showTemporaryMarkers, setShowTemporaryMarkers] = useState(false);
    const [tempMarkersCoords, setTempMarkersCoords] = useState({ latitude: 0, longitude: 0 });

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);


    // Redirect to users current location
    const handleMapReady = () => {
        if (currentLocation) {
            const newRegion = {
                latitude: currentLocation.latitude,
                longitude: currentLocation.longitude,
                latitudeDelta: 0.02,
                longitudeDelta: 0.02,
            };
            this.mapRef.animateToRegion(newRegion, 1000);
        }
    };

    const handleMarkerPress = (client) => {
        setShowTemporaryMarkers(true);
        setTempMarkersCoords({
            latitude: client.destination.latitude,
            longitude: client.destination.longitude,
        });
        setSelectedUser(client);
        setIsModalVisible(true);

        // Calculate midpoint between marker and temporary marker
        const midLatitude = (client.pickupLocation.latitude + tempMarkersCoords.latitude);
        const midLongitude = (client.pickupLocation.longitude + tempMarkersCoords.longitude);

        // Offset the midpoint to the top of the screen
        const offsetMidLatitude = midLatitude + (currentLocation.latitude - midLatitude) * 1;
        const offsetMidLongitude = midLongitude;

        // Animate map to the offset midpoint
        this.mapRef.animateToRegion({
            latitude: offsetMidLatitude,
            longitude: offsetMidLongitude,
            latitudeDelta: 0.02,
            longitudeDelta: 0.02,
        }, 1000);
    };

    const handleActiveMarker = () => {
        setIsModalVisible(true);
        setSelectedUser(ActiveBooking[0])

    }

    const handleAccept = (id) => {
        const updatedBookings = LogBook.map((booking) =>
            booking.id === id ? { ...booking, status: 'accepted', driverId: user.userId } : booking
        );
        dispatch(setLogBook({ log: updatedBookings }));

        const acceptedBooking = updatedBookings.filter((booking) =>
            booking.id === id && booking.status === 'accepted'
        );
        setTempMarkersCoords({ latitude: 0, longitude: 0 });

        setShowTemporaryMarkers(false);
        setSelectedUser(acceptedBooking[0])
        dispatch(setLogBook({ active: acceptedBooking }));
        // run api here to update the BE that that booking is taken
    };


    const handleDecline = (id) => {
        const updatedBookings = LogBook.map((booking) =>
            booking.id === id ? { ...booking, status: 'declined' } : booking
        );
        closeModal()
        dispatch(setLogBook({ log: updatedBookings }));

    };

    const closeModal = () => {
        setIsModalVisible(false);
        setShowTemporaryMarkers(false);
        setTempMarkersCoords({ latitude: 0, longitude: 0 });
        setSelectedUser(null);
    };


    return (
        <View style={{ flex: 1 }}>
            <MapView
                ref={(ref) => { this.mapRef = ref; }}
                showsUserLocation={true}
                userLocationPriority={"high"}
                followsUserLocation={true}
                showsBuildings={false}
                showsCompass={false}
                showsScale={false}
                showsTraffic={true}
                showsMyLocationButton={true}
                style={{ flex: 1 }}
                initialRegion={{
                    latitude: currentLocation?.latitude || 0,
                    longitude: currentLocation?.longitude || 0,
                    latitudeDelta: 0.02,
                    longitudeDelta: 0.02,
                }}
                onMapReady={handleMapReady}
            >
                <MapMarker
                    ActiveBooking={ActiveBooking}
                    handleActiveMarker={handleActiveMarker}
                    LogBook={LogBook}
                    handleMarkerPress={handleMarkerPress}
                    showTemporaryMarkers={showTemporaryMarkers}
                    tempMarkersCoords={tempMarkersCoords}
                />
            </MapView>

            <Modal
                isModalVisible={isModalVisible}
                closeModal={closeModal}
                selectedUser={selectedUser}
                windowHeight={windowHeight}
                handleAccept={handleAccept}
                handleDecline={handleDecline}
            />
        </View>
    );
}
