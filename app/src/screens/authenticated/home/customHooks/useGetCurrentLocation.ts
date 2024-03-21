import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { v4 as uuidv4 } from "uuid";
import { resetLogBook, setLogBook } from '../../../../redux/slice/bookingPool_slice';
import Geolocation from '@react-native-community/geolocation';

interface iAPIStatus {
  status: string,
  loading: boolean
}


export default function useGetCurrentLocation(user, refreshRate) {
  const [currentLocation, setCurrentLocation] = useState(user);

  useEffect(() => {
    fetchUserLocation();
    const intervalId = setInterval(() => {
      fetchUserLocation();
    }, refreshRate);
    return () => clearInterval(intervalId);
  }, []);

  const fetchUserLocation = () => {
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


  return { currentLocation };
}
