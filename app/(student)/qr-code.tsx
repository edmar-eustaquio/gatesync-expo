import { useEffect } from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, StatusBar, NativeModules, 
  Platform, AppState ,
  Alert,
} from 'react-native';
// import LinearGradient from 'react-native-linear-gradient';
import QRCode from 'react-native-qrcode-svg';
import { useAppContext } from '@/AppProvider';
import { router } from 'expo-router';

export default function Qr() {
  
    const {user} = useAppContext()

    useEffect(() => {
        if (Platform.OS === 'android' && NativeModules.PreventScreenshotModule) {
          const timer = setTimeout(() => {
            try {
              console.log('Enabling secure mode...');
              NativeModules.PreventScreenshotModule.enableSecureMode();

            //   Toast.show({
            //     type: 'success',
            //     text1: 'Screenshot prevention is enabled',
            //     position: 'bottom',
            //     visibilityTime: 2000,
            //   });
            } catch (error) {
              console.error('Failed to enable screenshot restriction:', error);
            }
          }, 3000); // Delay to prevent app crashes on initial render
    
          return () => {
            clearTimeout(timer);
            if (Platform.OS === 'android' && NativeModules.PreventScreenshotModule) {
              try {
                console.log('Disabling secure mode...');
                NativeModules.PreventScreenshotModule.disableSecureMode();
                // Toast.show({
                //   type: 'success',
                //   text1: 'Screenshot prevention is disabled',
                //   position: 'bottom',
                //   visibilityTime: 2000,
                // });
              } catch (error) {
                console.error('Failed to disable screenshot restriction:', error);
              }
            }
          };
        }
    
        // iOS: Prevent the content from appearing in the task switcher
        const appStateListener = AppState.addEventListener('change', nextAppState => {
          if (nextAppState === 'background') {
            console.log('App moved to background (possible screenshot prevention)');
          }
        });
    
        return () => {
          appStateListener.remove();
        };
      }, []);
    
      return (
        <>
          <View style={styles.container}>
            <StatusBar backgroundColor="#FFF" barStyle="light-content" />
            <View style={styles.contentContainer}>
              <View style={styles.Square}>
                {/* {isLoading ? (
                  <Text>Loading QR Code...</Text>
                ) : qrData ? ( */}
                  <QRCode value={user?.qrData} size={200} />
                {/* ) : (
                  <Text>No QR Code Available</Text>
                )} */}
              </View>
              <Text style={styles.title}>Scan your entry code</Text>
            </View>
    
            <TouchableOpacity style={styles.Button} 
            onPress={() => router.back()}
            >
              <Text style={styles.return}>Dashboard</Text>
            </TouchableOpacity>
          </View>
    
          {/* Toast component */}
          {/* <Toast /> */}
        </>
      );
    };
    
    const styles = StyleSheet.create({
      container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
      contentContainer: { alignItems: 'center', justifyContent: 'center', padding: 20, borderRadius: 21, width: '80%', height: 464 },
      title: { fontSize: 24, fontWeight: '500', color: '#00000' },
      Button: { width: '60%', height: 63, backgroundColor: '#2C41FF', borderRadius: 15, alignItems: 'center', justifyContent: 'center', marginTop: 20 },
      return: { fontSize: 20, fontWeight: '700', color: '#fff' },
      Square: { width: 233, height: 240, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
    });
