import React from 'react';
import {
  Colors,
  TabController,
  View,
} from 'react-native-ui-lib';
import { ViewProps } from 'react-native';
import { LazyLoader } from '../core/lazy-loader';

const PoolDashboardScreen = React.lazy(() => import('./pool-dashboard.screen'));
const PoolStatsScreen = React.lazy(() => import('./pool-stats.screen'));

const LazyPoolDashboard = () => (<LazyLoader><PoolDashboardScreen /></LazyLoader>);
const LazyPoolStats = () => (<LazyLoader><PoolStatsScreen /></LazyLoader>);

export const PoolNavigator: React.FC<ViewProps> = () => (
  <TabController items={[{ label: 'Pool' }, { label: 'Stats' }]}>
    <View flex>
      <TabController.TabPage index={0}><LazyPoolDashboard /></TabController.TabPage>
      <TabController.TabPage index={1} lazy><LazyPoolStats /></TabController.TabPage>
    </View>
    <View
      br30
      style={{
        overflow: 'hidden',
        borderColor: Colors.$outlinePrimary,
        borderTopWidth: 2,
        borderLeftWidth: 0.3,
        borderRightWidth: 0.3,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
      }}
    >
      <TabController.TabBar
        enableShadow
      />
    </View>
  </TabController>
);
