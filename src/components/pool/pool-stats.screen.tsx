import React, { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, Card, Colors, SkeletonView,
} from 'react-native-ui-lib';
import { SettingsContext } from '../../core/settings';
import {
  getMinerStats, getMinerWorkers, formatXMR,
  MinerStats, WorkerStats,
} from '../../api/alphablock';

const PoolStatsScreen: React.FC = () => {
  const { settings } = React.useContext(SettingsContext);
  const [minerStats, setMinerStats] = useState<MinerStats | null>(null);
  const [workers, setWorkers] = useState<WorkerStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get wallet address from selected configuration
  const walletAddress = React.useMemo(() => {
    const config = settings.configurations.find(
      (c) => c.id === settings.selectedConfiguration,
    );
    if (config && config.mode === 'simple') {
      const simpleConfig = config as any;
      if (simpleConfig.properties?.wallet) {
        return simpleConfig.properties.wallet;
      }
      if (simpleConfig.properties?.pool?.username) {
        return simpleConfig.properties.pool.username;
      }
    }
    return null;
  }, [settings]);

  const loadData = async () => {
    if (!walletAddress) {
      setError('No wallet address configured');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const [stats, workerData] = await Promise.all([
        getMinerStats(walletAddress),
        getMinerWorkers(walletAddress),
      ]);
      setMinerStats(stats);
      setWorkers(workerData);
    } catch (err: any) {
      setError(err.message || 'Failed to load miner stats');
      console.error('Miner stats error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, [walletAddress]);

  const formatHashrate = (hashRate: number | false): string => {
    if (hashRate === false || hashRate === 0) {
      return '0 H/s';
    }
    if (hashRate >= 1000000000) {
      return `${(hashRate / 1000000000).toFixed(2)} GH/s`;
    }
    if (hashRate >= 1000000) {
      return `${(hashRate / 1000000).toFixed(2)} MH/s`;
    }
    if (hashRate >= 1000) {
      return `${(hashRate / 1000).toFixed(2)} KH/s`;
    }
    return `${hashRate.toFixed(2)} H/s`;
  };

  if (loading && !minerStats) {
    return (
      <View flex bg-screenBG padding-20>
        <SkeletonView template={SkeletonView.templates.TEXT_CONTENT} times={5} />
      </View>
    );
  }

  if (!walletAddress) {
    return (
      <View flex bg-screenBG padding-20 center>
        <Text text60 $textNeutral marginB-10>No Wallet Configured</Text>
        <Text text80 $textNeutral textAlign="center">
          Please configure a wallet address in Settings to view your mining statistics.
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View flex bg-screenBG padding-20 center>
        <Text text60 $textDanger marginB-10>Error Loading Stats</Text>
        <Text text80 $textNeutral marginB-20>{error}</Text>
        <Text text90 $textNeutral onPress={loadData} underline>
          Tap to retry
        </Text>
      </View>
    );
  }

  return (
    <ScrollView bg-screenBG>
      <View padding-20>
        <Card enableShadow marginB-20>
          <View padding-20>
            <Text text50 $textDefault marginB-15>Your Mining Statistics</Text>
            <View marginB-10>
              <Text text70 $textNeutral marginB-5>Wallet Address</Text>
              <Text text80 $textDefault numberOfLines={1} style={{ fontFamily: 'monospace' }}>
                {walletAddress}
              </Text>
            </View>
            
            {minerStats && (
              <View marginT-15>
                <View row spread marginB-10>
                  <Text text70 $textNeutral>Current Hashrate</Text>
                  <Text text60 $textDefault style={{ color: '#06B6D4' }}>
                    {formatHashrate(minerStats.hash)}
                  </Text>
                </View>
                <View row spread marginB-10>
                  <Text text70 $textNeutral>Pending Balance</Text>
                  <Text text60 $textDefault style={{ color: '#8B5CF6' }}>
                    {formatXMR(minerStats.amtDue)}
                  </Text>
                </View>
                <View row spread marginB-10>
                  <Text text70 $textNeutral>Total Paid</Text>
                  <Text text60 $textDefault>
                    {formatXMR(minerStats.amtPaid)}
                  </Text>
                </View>
                <View row spread marginB-10>
                  <Text text70 $textNeutral>Valid Shares</Text>
                  <Text text60 $textDefault>
                    {minerStats.validShares !== false ? minerStats.validShares.toLocaleString() : '0'}
                  </Text>
                </View>
                <View row spread>
                  <Text text70 $textNeutral>Invalid Shares</Text>
                  <Text text60 $textDanger>
                    {minerStats.invalidShares !== false ? minerStats.invalidShares.toLocaleString() : '0'}
                  </Text>
                </View>
              </View>
            )}
          </View>
        </Card>

        {/* Workers */}
        {workers && Object.keys(workers).length > 0 && (
          <Card enableShadow>
            <View padding-20>
              <Text text50 $textDefault marginB-15>Workers</Text>
              {Object.entries(workers).map(([workerName, workerStats]) => (
                <View
                  key={workerName}
                  marginB-10
                  padding-15
                  bg-grey80
                  br10
                >
                  <Text text60 $textDefault marginB-10>{workerName}</Text>
                  <View row spread marginB-5>
                    <Text text70 $textNeutral>Hashrate</Text>
                    <Text text70 $textDefault style={{ color: '#06B6D4' }}>
                      {formatHashrate(workerStats.hash)}
                    </Text>
                  </View>
                  <View row spread marginB-5>
                    <Text text70 $textNeutral>Valid Shares</Text>
                    <Text text70 $textDefault>
                      {workerStats.validShares !== false ? workerStats.validShares.toLocaleString() : '0'}
                    </Text>
                  </View>
                  <View row spread>
                    <Text text70 $textNeutral>Invalid Shares</Text>
                    <Text text70 $textDanger>
                      {workerStats.invalidShares !== false ? workerStats.invalidShares.toLocaleString() : '0'}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </Card>
        )}
      </View>
    </ScrollView>
  );
};

export default PoolStatsScreen;
