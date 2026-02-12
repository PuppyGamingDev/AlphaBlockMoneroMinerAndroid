import React from 'react';
import { Colors, LoaderScreen } from 'react-native-ui-lib';
import { SafeAreaView } from 'react-native';
import { initialWindowMetrics, SafeAreaProvider } from 'react-native-safe-area-context';
import { enableScreens } from 'react-native-screens';
import { NavigationContainer } from '@react-navigation/native';
import { SettingsContext, SettingsContextProvider } from './core/settings';
import { AppNavigator } from './components';
import { SessionDataContextProvider } from './core/session-data/session-data.context';
import { PowerContextProvider } from './core/power/power.context';
import { LoggerContextProvider } from './core/logger';
import { ToasterProvider } from './core/hooks/use-toaster/toaset.context';
import { LoadAssets } from './assets';

enableScreens(false);

const AppWithSettings:React.FC = () => {
  React.useEffect(() => {
    LoadAssets();
    Colors.loadSchemes({
      light: {
        screenBG: '#0A0E27', // AlphaBlock dark background
        textColor: '#E5E7EB', // AlphaBlock text primary
        moonOrSun: '#06B6D4', // AlphaBlock cyan
        mountainForeground: '#8B5CF6', // AlphaBlock purple
        mountainBackground: '#050816', // AlphaBlock darker background
      },
      dark: {
        screenBG: '#0A0E27', // AlphaBlock dark background
        textColor: '#E5E7EB', // AlphaBlock text primary
        moonOrSun: '#06B6D4', // AlphaBlock cyan
        mountainForeground: '#8B5CF6', // AlphaBlock purple
        mountainBackground: '#050816', // AlphaBlock darker background
      },
    });
    Colors.setScheme('dark'); // Always use dark mode for AlphaBlock
  }, []);

  return (
    <SettingsContextProvider>
      <App />
    </SettingsContextProvider>
  );
};

const App = () => {
  const { settings } = React.useContext(SettingsContext);
  const [autoStartAttempted, setAutoStartAttempted] = React.useState(false);

  // Auto-start mining if enabled
  React.useEffect(() => {
    if (settings.ready && settings.autoStart && !autoStartAttempted && settings.selectedConfiguration) {
      setAutoStartAttempted(true);
      // Small delay to ensure everything is initialized
      setTimeout(() => {
        const { useMiner } = require('./core/hooks/use-miner.hook');
        // Note: This will be handled by the miner component when it mounts
      }, 1000);
    }
  }, [settings.ready, settings.autoStart, settings.selectedConfiguration, autoStartAttempted]);

  if (settings.ready === false) {
    return <LoaderScreen message="Loading..." color={Colors.grey40} />;
  }
  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <LoggerContextProvider>
        <PowerContextProvider>
          <SessionDataContextProvider>
            <SafeAreaView style={{ flex: 1 }}>
              <ToasterProvider>
                <NavigationContainer>
                  <AppNavigator />
                </NavigationContainer>
              </ToasterProvider>
            </SafeAreaView>
          </SessionDataContextProvider>
        </PowerContextProvider>
      </LoggerContextProvider>
    </SafeAreaProvider>
  );
};

export default AppWithSettings;
