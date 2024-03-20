import React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { Text, View, Colors } from 'react-native-ui-lib';
import { useSelector } from 'react-redux';
import { selectComplete } from '../../../redux/slice/bookingPool_slice';

export default function Index() {
  const completedBookings = useSelector(selectComplete);

  const groupedData = completedBookings.reduce((acc, item) => {
    const dateKey = new Date(item.pickupTime).toLocaleDateString('en-GB');
    acc[dateKey] = acc[dateKey] ? [...acc[dateKey], item] : [item];
    return acc;
  }, {});

  // Sort the keys in ascending order
  const sortedKeys = Object.keys(groupedData).sort((a, b) => new Date(a) - new Date(b));

  const renderItem = ({ item }) => {
    const formatTime = (dateString) => {
      const date = new Date(dateString);
      const formattedTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      return formattedTime;
    };

    return (
      <View paddingH-30 style={styles.itemContainer}>
        <View row spread>
          <View row marginV-2>
            <Text text70L>Ticket: </Text>
            <Text text70L>{item.id}</Text>
          </View>
          <View row marginV-2>
            <Text text70L>{formatTime(item.pickupTime)}</Text>
          </View>
        </View>
        <View row spread>
          <View row marginV-2>
            <Text text70L>From: </Text>
            <Text text70BO color={Colors.orange30}>{item.pickupLocation.streetName}</Text>
          </View>
          <View row marginV-2>
            <Text text70L>To: </Text>
            <Text text70BO color={Colors.green40}>{item.destination.streetName}</Text>
          </View>
        </View>
      </View>
    );
  };

  const ListHeader = ({ dateKey }) => (
    <View style={styles.headerContainer}>
      <Text style={styles.headerText}>{dateKey}</Text>
    </View>
  );

  return (
    <View style={styles.container} useSafeArea={true}>
      {sortedKeys.map((dateKey) => (
        <View key={dateKey}>
          <FlatList
            data={groupedData[dateKey]}
            renderItem={renderItem}
            ListHeaderComponent={() => <ListHeader dateKey={dateKey} />}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  headerContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.dark,
  },
  itemContainer: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#CCCCCC',
  },
});
