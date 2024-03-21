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
import { resetToast, setToast } from '../../../redux/slice/toast_slice';

const windowHeight = Dimensions.get('window').height;
const refreshRate = 30000;


export default function MapScreen() {
    const dispatch = useDispatch();
    const user = useSelector(selectUser);
    const BookingPool = useSelector(selectBookingPool);
    const ActiveBooking = useSelector(selectActive);
    const CompletedBooking = useSelector(selectComplete);

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [reload, setReload] = useState(false);

    const { currentLocation } = useGetCurrentLocation(user, refreshRate);
    useGetBookingInfo(user, BookingPool, ActiveBooking, CompletedBooking, reload);

    const [showTemporaryMarkers, setShowTemporaryMarkers] = useState(false);
    const [tempMarkersCoords, setTempMarkersCoords] = useState({ latitude: 0, longitude: 0 });


    useEffect(() => {
        const allDeclinedOrEmpty = BookingPool.every(
            (booking) => booking.status === 'declined' || BookingPool.length === 0
        );

        if (allDeclinedOrEmpty) {
            dispatch(
                setToast({
                    visible: true,
                    color: Colors.orange20,
                    icon: 'CheckCircle',
                    message: `No booking.. I'll help you look, please wait`,
                })
            );
            setTimeout(() => {
                setReload(!reload);
            }, 2000);
        }
    }, [BookingPool, dispatch]);

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

    // Redirect the map to the marker and set the selected booking to the modal
    const handleMarkerPress = (client) => {

        // Show temporary markers and set their coordinates
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
        animateMapToOffsetMidpoint(offsetMidLatitude, offsetMidLongitude);
    };

    // Add comments to explain the purpose of the function
    const animateMapToOffsetMidpoint = (latitude, longitude) => {
        // Animate map to the offset midpoint
        this.mapRef.animateToRegion({
            latitude,
            longitude,
            latitudeDelta: 0.02,
            longitudeDelta: 0.02,
        }, 1000);
    };

    const handleActiveMarker = () => {
        setIsModalVisible(true);
        setSelectedUser(ActiveBooking[0])
    }

    const closeModal = () => {
        dispatch(resetToast())
        setIsModalVisible(false);
        setShowTemporaryMarkers(false);
        setTempMarkersCoords({ latitude: 0, longitude: 0 });
        setSelectedUser(null);
    };

    /**
     * This function handles the transition of booking status based on the newStatus parameter.
     * It updates the selectedUser state, updates the booking pool in Redux state, and dispatches actions accordingly.
    */
    const handleStatusTransition = (id, newStatus) => {
        dispatch(
            setToast({
                visible: true,
                color: Colors.green30,
                icon: 'CheckCircle',
                message: `Status has updated to ${newStatus}`,
            }))
        // Add your update state logic here based on newStatus
        const updatedBookings = BookingPool.map((booking) =>
            booking.id === id ? { ...booking, status: newStatus, driverId: user.id } : booking
        );

        // Update selectedUser state
        const selectedUser = updatedBookings.find((booking) => booking.id === id);
        setSelectedUser(selectedUser);

        // Dispatch action to update the booking pool in Redux state
        dispatch(setBookingPool({ pool: updatedBookings }));

        // Handle different status transitions and dispatch corresponding actions
        switch (newStatus) {
            case 'declined':
                // Filter out the declined booking from the updated bookings
                const declinedBooking = updatedBookings.filter((booking) => booking.id !== id);
                dispatch(setBookingPool({ pool: declinedBooking }));
                break;
            case 'accepted':
                // Filter the accepted booking based on ID and status
                const acceptedBooking = updatedBookings.filter(
                    (booking) => booking.id === id && booking.status === 'accepted'
                );
                dispatch(setBookingPool({ active: acceptedBooking }));
                break;
            case 'started':
                // Filter the started booking based on ID and status
                const startedBooking = updatedBookings.filter(
                    (booking) => booking.id === id && booking.status === 'started'
                );
                dispatch(setBookingPool({ active: startedBooking }));
                break;
            case 'picked-up':
                // Update the status of the picked-up booking and set pickupTime
                const pickedUpBooking = updatedBookings.map((booking) =>
                    booking.id === id ? { ...booking, status: 'picked-up', pickupTime: new Date() } : booking
                );
                dispatch(setBookingPool({ pool: pickedUpBooking }));

                // Filter the active picked-up booking
                const pickedUpBookingActive = pickedUpBooking.filter(
                    (booking) => booking.id === id && booking.status === 'picked-up'
                );
                dispatch(setBookingPool({ active: pickedUpBookingActive }));
                break;
            case 'dropped-off':
                // Filter the dropped-off booking based on ID and status
                const droppedOffBooking = updatedBookings.filter(
                    (booking) => booking.id === id && booking.status === 'dropped-off'
                );
                // Update completed bookings in Redux state
                dispatch(setBookingPool({ completed: [...CompletedBooking, ...droppedOffBooking] }));
                // Reset active bookings and close modal
                dispatch(resetActivePool());
                break;
            default:
                break;
        }
    };

    /**
     * Handle declining a booking by removing it from the BookingPool array.
     */
    const handleDecline = (id) => {
        // Filter out the declined booking from the BookingPool
        const updatedBookings = BookingPool.filter((booking) => booking.id !== id);

        // Close modal
        closeModal();

        // Update the booking pool in Redux state
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
                    user={user}
                    ActiveBooking={ActiveBooking}
                    handleActiveMarker={handleActiveMarker}
                    BookingPool={BookingPool}
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
