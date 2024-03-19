import React, { useEffect, useRef, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './src/redux/store';
import Navigation from './src/navigation';
import { investigate } from 'react-native-bundle-splitter/dist/utils';
import { LogBox, AppState, Alert } from 'react-native';
import SplashScreen from './src/components/splash';


const App = () => {
  const appState = useRef(AppState.currentState);
  const navigationRef = React.useRef(null);
  const [appLoaded, setAppLoaded] = useState(false);
  const [showSplashScreen, setShowSplashScreen] = useState(true);

  useEffect(() => handleAppStateChange(), []);

  useEffect(() => {
    LogBox.ignoreAllLogs();
    console.log('Bundle info: ', `loaded: ${investigate().loaded.length}, waiting: ${investigate().waiting.length}`);
  }, []);

  const handleAppStateChange = () => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      setShowSplashScreen(appState.current.match(/inactive|background/) && nextAppState === 'active' || appState.current === 'unknown');
      appState.current = nextAppState;
    });
    return () => {
      subscription.remove();
    };
  }

  useEffect(() => {
    handleAppStateChange();
    if (appLoaded) {
      // setTimeout(() => {
        setShowSplashScreen(false);
      // }, 2000);
    }
  }, [appLoaded]);

  return (
    <Provider store={store}>
      <PersistGate loading={false} persistor={persistor}>
        <NavigationContainer ref={navigationRef} onReady={() => setAppLoaded(true)}>
            {showSplashScreen && <SplashScreen />}
            {!showSplashScreen && <Navigation />}
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
};

export default App;