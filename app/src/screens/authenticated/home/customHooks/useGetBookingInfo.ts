import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { v4 as uuidv4 } from "uuid";
import { resetLogBook, setLogBook } from '../../../../redux/slice/logBook_slice';

interface iAPIStatus {
  status: string,
  loading: boolean
}

export default function useGetBookingInfo(user, ActiveBooking) {
  const dispatch = useDispatch();
  const currentLocation = user
  const [APIState, setAPIState] = useState<iAPIStatus>({ status: "idle", loading: true });
  const [response, setResponse] = useState([]);

  useEffect(() => {
    const fetchAPI = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));

        dispatch(resetLogBook())

        const res = [
          {
            id: 1,
            userId: uuidv4(),
            driverId: null,
            pickupLocation: {
              streetName: "Center st.",
              latitude: currentLocation.latitude + 0.005,
              longitude: currentLocation.longitude + 0.005,
            },
            destination: {
              streetName: "Flinders st.",
              latitude: currentLocation.latitude + 0.003,
              longitude: currentLocation.longitude + 0.003,
              distance: "5 km",
            },
            status: 'pending',
            pickupTime: null,
            timestamp: new Date(),
          },
          {
            id: 2,
            userId: uuidv4(),
            driverId: null,
            pickupLocation: {
              streetName: "Center st.",
              latitude: currentLocation.latitude + 0.008,
              longitude: currentLocation.longitude + 0.004,
            },
            destination: {
              streetName: "Flinders st.",
              latitude: currentLocation.latitude + 0.002,
              longitude: currentLocation.longitude + 0.004,
              distance: "5 km",
            },
            status: 'pending',
            pickupTime: null,
            timestamp: new Date(),
          },
          {
            id: 3,
            userId: uuidv4(),
            driverId: null,
            pickupLocation: {
              streetName: "Center st.",
              latitude: currentLocation.latitude + 0.001,
              longitude: currentLocation.longitude + 0.002,
            },
            destination: {
              streetName: "Flinders st.",
              latitude: currentLocation.latitude + 0.002,
              longitude: currentLocation.longitude + 0.004,
              distance: "5 km",
            },
            status: 'accepted',
            pickupTime: null,
            timestamp: new Date(),
          }
        ];

        return res;
      } catch (error) {
        throw new Error('Failed to fetch data');
      }
    };

    if (ActiveBooking.length > 0) {
      return;
    }

    setAPIState({ status: "loading", loading: true });
    fetchAPI()
      .then((res) => {
        const pending = res.filter(booking => booking.status === 'pending');
        dispatch(setLogBook({ log: pending }));
        setResponse(res);
        setAPIState({ status: "succeeded", loading: false });
      })
      .catch(() => {
        setAPIState({ status: "failed", loading: false });
      });
  }, [ActiveBooking]);

  return { response, APIState };
}
