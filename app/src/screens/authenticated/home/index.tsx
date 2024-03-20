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
import { resetBookingPool, selectBookingPool, selectActive, setBookingPool, selectComplete, resetActive, resetActivePool } from '../../../redux/slice/bookingPool_slice';
import useGetCurrentLocation from './customHooks/useGetCurrentLocation';
import Modal from './components/modal';
import MapMarker from './components/mapMarkers'
import { setToast } from '../../../redux/slice/toast_slice';

const windowHeight = Dimensions.get('window').height;
const refreshRate = 30000;


export default function MapScreen() {
    const dispatch = useDispatch();
    const user = useSelector(selectUser);
    const BookingPool = useSelector(selectBookingPool);
    const ActiveBooking = useSelector(selectActive);
    const CompletedBooking = useSelector(selectComplete);

    const { currentLocation } = useGetCurrentLocation(user, refreshRate);
    useGetBookingInfo(user, BookingPool, ActiveBooking, CompletedBooking);

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


    const closeModal = () => {
        setIsModalVisible(false);
        setShowTemporaryMarkers(false);
        setTempMarkersCoords({ latitude: 0, longitude: 0 });
        setSelectedUser(null);
    };


    // dispatch(resetBookingPool())
    // console.log(BookingPool?.length, 11)
    // console.log(ActiveBooking.length, 22)
    // console.log(CompletedBooking.length, 33)
    const handleStatusTransition = (id, newStatus) => {
        dispatch(setToast({
            visible: true,
            color: Colors.green30,
            icon: "CheckCircle",
            message: `Booking status is now ${newStatus}`,
        }))

        const updatedBookings = BookingPool.map((booking) =>
            booking.id === id ? { ...booking, status: newStatus, driverId: user.id } : booking
        );
        
        const selectedUser = updatedBookings.find((booking) => booking.id === id);
        setSelectedUser(selectedUser);

        setSelectedUser(selectedUser);
        dispatch(setBookingPool({ pool: updatedBookings }));

        if (newStatus === 'declined') {
            const declinedBooking  = updatedBookings.filter((booking) => booking.id !== id);
            dispatch(setBookingPool({ pool: declinedBooking }));
        }
    

        if (newStatus === 'accepted') {
            const acceptedBooking = updatedBookings.filter(
                (booking) => booking.id === id && booking.status === 'accepted'
            );
            dispatch(setBookingPool({ active: acceptedBooking }));
        }

        if (newStatus === 'started') {
            const startedBooking = updatedBookings.filter(
                (booking) => booking.id === id && booking.status === 'started'
            );
            dispatch(setBookingPool({ active: startedBooking }));
        }

        if (newStatus === 'picked-up') {
            const pickedUpBooking = updatedBookings.map((booking) =>
                booking.id === id ? { ...booking, status: 'picked-up', pickupTime: new Date() } : booking
            );
            dispatch(setBookingPool({ pool: pickedUpBooking }));

            const pickedUpBookingActive = pickedUpBooking.filter(
                (booking) => booking.id === id && booking.status === 'picked-up'
            );
            dispatch(setBookingPool({ active: pickedUpBookingActive }));
        }

        if (newStatus === 'dropped-off') {
            const droppedOffBooking = updatedBookings.filter(
                (booking) => booking.id === id && booking.status === 'dropped-off'
            );
            dispatch(setBookingPool({ completed: [...CompletedBooking, ...droppedOffBooking] }));
            dispatch(resetActivePool());
            closeModal();
        }
    };

    const handleDecline = (id) => {
        const updatedBookings = BookingPool.map((booking) =>
            booking.id === id ? { ...booking, status: 'declined' } : booking
        );
        closeModal()
        dispatch(setBookingPool({ pool: updatedBookings }));
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
                    LogBook={BookingPool}
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
                handleStatusTransition={handleStatusTransition}
                handleDecline={handleDecline}
            />
        </View>
    );
}
