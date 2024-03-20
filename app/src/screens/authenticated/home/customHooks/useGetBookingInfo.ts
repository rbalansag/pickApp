import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { v4 as uuidv4 } from "uuid";
import { setBookingPool } from '../../../../redux/slice/bookingPool_slice';

export default function useGetBookingInfo(user, BookingPool, ActiveBooking, CompletedBooking) {
    const dispatch = useDispatch();
    const currentLocation = user;

    useEffect(() => {
        const getRandomNumber = () => Math.floor(Math.random() * 3) + 1; // Generate a random number between 1 and 3
        const res = Array.from({ length: getRandomNumber() }, () => ({
            id: Math.random().toString(36).substr(2, 9),
            userId: uuidv4(),
            driverId: null,
            pickupLocation: {
                streetName: "Center st.",
                latitude: currentLocation.latitude + Math.random() / 100,
                longitude: currentLocation.longitude + Math.random() / 100,
            },
            destination: {
                streetName: "Flinders st.",
                latitude: currentLocation.latitude + Math.random() / 100,
                longitude: currentLocation.longitude + Math.random() / 100,
                distance: `${Math.floor(Math.random() * 10)} km`,
            },
            status: 'pending',
            pickupTime: null,
            timestamp: new Date(),
        }));

        dispatch(setBookingPool({ pool: res }));

    }, [CompletedBooking, currentLocation]);

    return null;
}