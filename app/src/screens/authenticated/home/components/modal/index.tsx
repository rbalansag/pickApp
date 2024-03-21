import React, { useEffect, useState } from 'react';
import { PermissionsAndroid, Alert, Dimensions } from 'react-native';
import { Button, Colors, Text, TouchableOpacity, Modal, View } from 'react-native-ui-lib';
import "react-native-get-random-values";
import { selectToast } from '../../../../../redux/slice/toast_slice';
import { useSelector } from 'react-redux';

export default function index(props) {
    const { isModalVisible, closeModal, selectedUser, windowHeight, handleStatusTransition, handleDecline } = props;
    const toast = useSelector(selectToast);
    const [confirmationStatus, setConfirmationStatus] = useState(false);

    const handleButtonPress = (status) => {
        if (status === 'confirm') {
            handleStatusTransition(selectedUser.id,
                selectedUser.status === 'pending' ? 'accepted' :
                    selectedUser.status === 'accepted' ? 'started' :
                        selectedUser.status === 'started' ? 'picked-up' :
                            selectedUser.status === 'picked-up' ? 'dropped-off' :
                                selectedUser.status === 'dropped-off' && 'completed')
            setConfirmationStatus(false);
        } else {
            setConfirmationStatus(true);
        }
    };

    const handleCloseing = () => {
        setConfirmationStatus(false);
        closeModal()
    }

    return (
        <Modal
            animationType="slide"
            visible={isModalVisible}
            transparent={true}
        >
            <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                <TouchableOpacity style={{ flex: 1 }} onPress={handleCloseing} />
                <View style={{
                    backgroundColor: 'white', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, height: windowHeight / 2,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 0 },
                    shadowOpacity: 0.2,
                    shadowRadius: 6,
                }}>
                    {selectedUser && (
                        <View flex paddingH-20>
                            <View flexS paddingB-40>
                                <View center>
                                    <Text text30L>Ride Request</Text>
                                </View>
                                <View center marginT-10>
                                    <Text text50BO>{selectedUser.status.toUpperCase()}</Text>
                                </View>
                            </View>
                            <View flex>
                                <View flex>
                                    <View row marginV-5>
                                        <Text text50L>Pick up: </Text>
                                        <Text text50BO color={Colors.orange30}>{selectedUser.pickupLocation.streetName}</Text>
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
                                <View spread paddingV-20 gap-10>
                                    {!confirmationStatus && selectedUser.status === 'pending' &&
                                        <Button
                                            label={'Decline'}
                                            outlineColor={Colors.red30}
                                            outline={true}
                                            onPress={() => handleDecline(selectedUser.id)}
                                            size={Button.sizes.large}
                                        />
                                    }

                                    <Button
                                        label={
                                            confirmationStatus
                                                ? 'Are you sure you want to proceed'
                                                : selectedUser.status === 'pending' ? 'Accept' :
                                                    selectedUser.status === 'accepted' ? 'Start' :
                                                        selectedUser.status === 'started' ? 'Pick Up' :
                                                            selectedUser.status === 'picked-up' ? 'Drop Off' :
                                                                selectedUser.status === 'dropped-off' && 'Completed'
                                        }
                                        backgroundColor={
                                            confirmationStatus ? Colors.green30 : Colors.green30
                                        }
                                        enableShadow={true}
                                        onPress={() =>
                                            handleButtonPress(
                                                confirmationStatus ? 'confirm' : selectedUser.status
                                            )
                                        }
                                        size={Button.sizes.large}
                                    />
                                    {confirmationStatus &&
                                        <Button
                                            label={'Cancel'}
                                            outlineColor={Colors.red30}
                                            outline={true}
                                            onPress={() => setConfirmationStatus(false)}
                                            size={Button.sizes.large}
                                        />}
                                </View>
                            </View>
                        </View>
                    )}
                </View>
            </View>
        </Modal>
    )
}