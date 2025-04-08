import { useAppContext } from '@/AppProvider';
import useFirebaseHook from '@/hooks/useFirebaseHook';
import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, Alert } from 'react-native';

const MyscheduleScreen = () => {
  const [schedules, setSchedules] = useState<{ [field: string]: any }[]>([]);

  const {user} =useAppContext()
  const {isLoading, dispatch} = useFirebaseHook()
  
  useEffect(() => {
    dispatch({
      process: async ({get, where}) => {
          const snap = await get('schedules', where('studentId', '==', user?.id));
          setSchedules(snap.docs.map(doc => ({...doc.data()})))
      }, onError: (error) => {
        console.error('Error fetching schedules:', error);
        Alert.alert('Error', 'An error occurred while fetching schedules');
      }
    })
  }, []);

  const renderItem = ({ item }: {item:any}) => (
    <View style={styles.tableRow}>
      <Text style={styles.tableCell}>{item.date}</Text>
      <Text style={styles.tableCell}>{item.timeIn}</Text>
      <Text style={styles.tableCell}>{item.timeOut}</Text>
    </View>
  );

  const renderHeader = () => (
    <View>
      {/* <View style={styles.navbar}>
        <TouchableOpacity onPress={() => navigation.navigate('StudentPage')}>
          <Image source={require('../images/back.png')} style={styles.back} />
        </TouchableOpacity>
        <View style={styles.navCenter}>
          <Image source={require('../images/logo.png')} style={styles.logo} />
          <Image source={require('../images/GateSync.png')} style={styles.gatesync} />
        </View>
      </View> */}

      <View style={styles.content}>
        <Text style={styles.welcomeText}>My Schedule</Text>
      </View>

      <View style={styles.tableHeader}>
        <Text style={styles.tableHeaderCell}>Date</Text>
        <Text style={styles.tableHeaderCell}>Time In</Text>
        <Text style={styles.tableHeaderCell}>Time Out</Text>
      </View>
    </View>
  );

  return (
    <FlatList
      data={schedules}
      renderItem={renderItem}
      keyExtractor={(item, index) => index.toString()}
      ListHeaderComponent={renderHeader}
      ListEmptyComponent={<Text>No schedules available</Text>}
      ListFooterComponent={isLoading ? <Text>Loading...</Text> : null}
      contentContainerStyle={styles.flatListContent}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  navbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#BCE5FF',
    paddingVertical: 10,
    paddingHorizontal: 15,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  navCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 35,
    height: 34,
    resizeMode: 'contain',
   right: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  gatesync: {
    width: 100,
    height: 34,
    resizeMode: 'contain',
    right: 90,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  back: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
  welcomeText: {
    fontSize: 36,
    fontWeight: '800',
    fontFamily: 'Kanit',
    color: '#5394F2',
    marginTop: -15,
  },
  content: {
    marginTop: 20,
    padding: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#007bff',
    paddingVertical: 10,
    borderRadius: 5,
    marginBottom: 10,
    justifyContent: 'space-between',
  },
  tableHeaderCell: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    width: '33%',
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    backgroundColor: '#f9f9f9',
    paddingVertical: 10,
    borderRadius: 5,
    marginBottom: 10,
    justifyContent: 'space-between',
  },
  tableCell: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    width: '33%',
    textAlign: 'center',
  },
  flatListContent: {
    paddingBottom: 20,
  },
});

export default MyscheduleScreen;
