import React from 'react';
import { Marker } from 'react-native-maps';
import { Colors, View } from 'react-native-ui-lib';
import MapViewDirections from 'react-native-maps-directions';

export default function index(props) {
  const { user, ActiveBooking, handleActiveMarker, BookingPool, handleMarkerPress, showTemporaryMarkers, tempMarkersCoords, currentLocation } = props;

  const statusDestination = ActiveBooking?.[0]?.status === "started" ? "pickupLocation" : ActiveBooking?.[0]?.status === "picked-up" ? "destination" : null;
  
  return (
    <>
      {(statusDestination) &&
        <MapViewDirections
          origin={currentLocation}
          destination={{
            latitude: ActiveBooking[0][statusDestination].latitude,
            longitude: ActiveBooking[0][statusDestination].longitude,
          }}
          apikey={"AIzaSyDvv65niVVwpzlkCfMBPCLb_-KyRqoA4qg"}
          strokeWidth={8}
          strokeColor={Colors.blue40}
        />
      }
      {ActiveBooking?.length > 0 ?
        ActiveBooking?.map((client, index) => (
          <React.Fragment key={client.id}>
            {client.driverId === user.id && (
              <Marker
                coordinate={{
                  latitude: client.pickupLocation.latitude,
                  longitude: client.pickupLocation.longitude,
                }}
                title={`To ${client.destination.streetName}`}
                description={`from ${client.pickupLocation.streetName} ${client.destination.distance}`}
                onPress={handleActiveMarker}
              >
                <View
                  style={{
                    borderRadius: 100,
                    width: 20,
                    height: 20,
                    backgroundColor: client.status === "pending" ? Colors.orange30 : Colors.green30,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.25,
                    shadowRadius: 3,
                    elevation: 5,
                  }}
                />
              </Marker>
            )}
            <Marker
              coordinate={{
                latitude: client.destination.latitude,
                longitude: client.destination.longitude,
              }}
              title={`To ${client.destination.streetName}`}
              description={`from ${client.pickupLocation.streetName} ${client.destination.distance}`}
              onPress={handleActiveMarker}
            >
              <View
                style={{
                  borderRadius: 100,
                  width: 20,
                  height: 20,
                  backgroundColor: client.status === "pending" ? Colors.orange30 : Colors.green30,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.25,
                  shadowRadius: 3,
                  elevation: 5,
                }}
              />
            </Marker>
          </React.Fragment>
        ))
        :
        BookingPool?.map((client) => {
          if (client.status === "declined" || client.status === "dropped-off") {
            return null;
          }
          if (client.driverId !== null) {
            return null; // Skip if driverId is not null
          }
          return (
            <React.Fragment key={client.id}>
              <Marker
                coordinate={{
                  latitude: client.pickupLocation.latitude,
                  longitude: client.pickupLocation.longitude,
                }}
                title={`To ${client.destination.streetName}`}
                description={`from ${client.pickupLocation.streetName} ${client.destination.distance}`}
                onPress={() => handleMarkerPress(client)}
              >
                <View
                  style={{
                    borderRadius: 100,
                    width: 20,
                    height: 20,
                    backgroundColor: client.status === "pending" ? Colors.orange30 : Colors.green30,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.25,
                    shadowRadius: 3,
                    elevation: 5,
                  }}
                />
              </Marker>
            </React.Fragment>
          );
        })}
      {showTemporaryMarkers && (
        <Marker
          coordinate={{
            latitude: tempMarkersCoords.latitude,
            longitude: tempMarkersCoords.longitude,
          }}
          title={'Temporary Marker 1'}
          description={`Latitude: ${tempMarkersCoords.latitude}, Longitude: ${tempMarkersCoords.longitude}`}
        >
          <View
            style={{
              borderRadius: 100,
              width: 20,
              height: 20,
              backgroundColor: Colors.green40,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 3,
              elevation: 5,
            }}
          />
        </Marker>
      )}
    </>
  );
}
