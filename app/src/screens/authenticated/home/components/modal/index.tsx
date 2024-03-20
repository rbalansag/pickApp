import React, { useEffect, useState } from 'react';
import { PermissionsAndroid, Alert, Modal, Dimensions } from 'react-native';
import { Button, Colors, Text, TouchableOpacity, View } from 'react-native-ui-lib';
import "react-native-get-random-values";

export default function index(props) {
    const { isModalVisible, closeModal, selectedUser, windowHeight, handleStatusTransition, handleDecline } = props;

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
                    <View center>
                        <Text text30L>Ride Request</Text>
                    </View>
                    {selectedUser && (
                        <View flex marginV-30 marginH-20>
                            <View flex>
                                <View row marginV-5>
                                    <Text text50L>Pick up: </Text>
                                    <Text text50BO color={Colors.yellow20}>{selectedUser.pickupLocation.streetName}</Text>
                                </View>

                                <View row marginV-5>
                                    <Text text50L>Destination: </Text>
                                    <Text text50BO color={Colors.green40}>{selectedUser.destination.streetName}</Text>
                                </View>

                                <View row marginV-5>
                                    <Text text50L>Distance: </Text>
                                    <Text text50BO color={Colors.green40}>{selectedUser.destination.distance}</Text>
                                </View>
                            </View>
                            <View spread row paddingV-20 gap-20>
                                {selectedUser.status === 'pending' &&
                                    <Button
                                        label={'Decline'}
                                        outlineColor={Colors.red30}
                                        outline={true}
                                        flex
                                        onPress={() => handleDecline(selectedUser.id)}
                                        size={Button.sizes.large}
                                    />
                                }
                                <Button
                                    label={selectedUser.status === 'pending' ? 'Accept' :
                                        selectedUser.status === 'accepted' ? 'Start' :
                                            selectedUser.status === 'started' ? 'Pick Up' :
                                                selectedUser.status === 'picked-up' ? 'Drop Off' :
                                                    selectedUser.status === 'dropped-off' && 'Completed'}
                                    backgroundColor={Colors.green30}
                                    enableShadow={true}
                                    flex
                                    onPress={() => handleStatusTransition(selectedUser.id,
                                        selectedUser.status === 'pending' ? 'accepted' :
                                            selectedUser.status === 'accepted' ? 'started' :
                                                selectedUser.status === 'started' ? 'picked-up' :
                                                    selectedUser.status === 'picked-up' ? 'dropped-off' :
                                                        selectedUser.status === 'dropped-off' && 'completed')}
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