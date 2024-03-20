import React, { useRef } from "react";
import { Toast, Colors, Text } from "react-native-ui-lib";
import { resetToast, selectToast } from "../../redux/slice/toast_slice";
import { useDispatch, useSelector } from 'react-redux'
import { PanResponder, Animated } from "react-native";

export default function Index(props) {
  const toast = useSelector(selectToast);
  const dispatch = useDispatch();
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderRelease: (_, gestureState) => {
        onDismiss(false);
      },
    })
  ).current;

  const onDismiss = () => {
    dispatch(resetToast())
  }

  return (
    <>
      <Toast
        visible={toast.visible}
        position={'top'}
        autoDismiss={5000}
        onDismiss={onDismiss}
        backgroundColor={"#FFFFFF00"}
        swipeable={true}
      >
        <Animated.View
          {...panResponder.panHandlers}
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            margin: 20,
            padding: 20,
            backgroundColor: toast.color,
            elevation: 3,
            marginTop: 20,
            borderRadius: 10,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.2,
            shadowRadius: 6,
          }}
        >
          <Text color={Colors.white} style={{ textAlign: 'center' }}>{toast?.message}</Text>
        </Animated.View>
      </Toast>
    </>
  );
}