import React, { useEffect, useState } from 'react';
import { Dimensions } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Colors, Text, TouchableOpacity, View } from 'react-native-ui-lib';
import "react-native-get-random-values";

export default function index(props) {
  const { ActiveBooking, handleActiveMarker, LogBook, handleMarkerPress, showTemporaryMarkers, tempMarkersCoords } = props;
  return (
    <>
      {ActiveBooking.length > 0 ?
        ActiveBooking.map((client, index) => {
          return (
            <>
              <Marker
                key={client.id}
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
                    backgroundColor:
                      client.status == "pending" ? Colors.yellow20 :
                        client.status == "accepted" && Colors.green30,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.25,
                    shadowRadius: 3,
                    elevation: 5,
                  }}
                />
              </Marker>
              <Marker
                key={client.id}
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
                    backgroundColor:
                      client.status == "pending" ? Colors.yellow20 :
                        client.status == "accepted" && Colors.green30,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.25,
                    shadowRadius: 3,
                    elevation: 5,
                  }}
                />
              </Marker>
            </>
          )
        })
        :
        LogBook?.map((client, index) => {
          if (client.status === "declined" || client.status === "dropped-off") {
            return null;
          }
          return (
            <>
              <Marker
                key={client.id}
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
                    backgroundColor:
                      client.status == "pending" ? Colors.yellow20 :
                        client.status == "accepted" && Colors.green30,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.25,
                    shadowRadius: 3,
                    elevation: 5,
                  }}
                />
              </Marker>
            </>
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
              backgroundColor: Colors.red30,
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
  )
}