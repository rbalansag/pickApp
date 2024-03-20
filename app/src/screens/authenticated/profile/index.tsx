import React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import navigationStrings from '../../../navigation/constants/navigationStrings';
import { useDispatch } from 'react-redux';
import { resetAuth } from '../../../redux/slice/auth_slice';
import { Text, View, TouchableOpacity } from 'react-native-ui-lib';
import { resetToast } from '../../../redux/slice/toast_slice';

const navigationPanel = ["User", "Logout"];

export default function Index(props) {
  const dispatch = useDispatch();

  const renderItem = ({ item }) => (
    <TouchableOpacity paddingH-30 style={styles.itemContainer} onPress={() => handleNavigation(item)}>
      <Text style={styles.itemText}>{item}</Text>
    </TouchableOpacity>
  );

  const handleNavigation = (item) => {
    if (item === 'User') {
      props.navigation.navigate(navigationStrings.CONTACTS);
    } else if (item === 'Logout') {
      props.navigation.replace(navigationStrings.AUTHENTICATION);

      dispatch(resetAuth())
      dispatch(resetToast())
    }
  };

  return (
    <View style={styles.container} useSafeArea={true}>
      <FlatList
        data={navigationPanel}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  itemContainer: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#CCCCCC',
  },
  itemText: {
    fontSize: 18,
  },
});
