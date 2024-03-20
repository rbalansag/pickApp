import React, { useEffect, useState } from 'react';
import { PermissionsAndroid, Alert, Modal, Dimensions } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Colors, Text, TouchableOpacity, View } from 'react-native-ui-lib';
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import { resetLogBook, selectActive, selectLog, selectLogBook, setLogBook } from '../../../redux/slice/logBook_slice';

export default function index(props) {
    const { isModalVisible, closeModal, selectedUser, windowHeight, handleAccept, handleDecline } = props;

    return (
        <Modal
            animationType="slide"
            visible={isModalVisible}
            transparent={true}
            onRequestClose={closeModal}
        >
            <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                <TouchableOpacity style={{ flex: 1 }} onPress={closeModal} />
                <View style={{ backgroundColor: 'white', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, height: windowHeight / 2 }}>
                    {selectedUser && (
                        <View flex>
                            <View flex>
                                <Text>{`Pick up: ${selectedUser.pickupLocation.streetName}`}</Text>
                                <Text>{`Destination: ${selectedUser.destination.streetName}`}</Text>
                                <Text>{`Distance: ${selectedUser.destination.distance}`}</Text>
                            </View>
                            <View spread row paddingV-20 gap-20>
                                <Button
                                    label={'Decline'}
                                    outlineColor={Colors.red30}
                                    outline={true}
                                    flex
                                    onPress={() => handleDecline(selectedUser.id)}
                                    size={Button.sizes.large}
                                />
                                <Button
                                    label={
                                        selectedUser.status === "pending" ? "Accept" :
                                            selectedUser.status === "accepted" ? "xx" :
                                                selectedUser.status === "started" ? "Arrived" :
                                                    selectedUser.status === "picked-up" ? "Pick up" :
                                                        selectedUser.status === "droped-off" && "Drop off"
                                    }
                                    backgroundColor={Colors.green30}
                                    enableShadow={true}
                                    flex
                                    onPress={() => handleAccept(selectedUser.id)}
                                    size={Button.sizes.large}
                                />
                            </View>
                        </View>
                    )}
                </View>
            </View>
        </Modal>
    )
}