import React, { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, Card, Colors, SkeletonView,
} from 'react-native-ui-lib';
import {
  getPoolStats, getPoolConfig, getRecentBlocks, formatXMR,
  PoolStats, PoolConfig, Block,
} from '../../api/alphablock';

const PoolDashboardScreen: React.FC = () => {
  const [poolStats, setPoolStats] = useState<PoolStats | null>(null);
  const [poolConfig, setPoolConfig] = useState<PoolConfig | null>(null);
  const [recentBlocks, setRecentBlocks] = useState<Block[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [stats, config, blocks] = await Promise.all([
        getPoolStats(),
        getPoolConfig(),
        getRecentBlocks(10),
      ]);
      setPoolStats(stats);
      setPoolConfig(config);
      setRecentBlocks(blocks);
    } catch (err: any) {
      setError(err.message || 'Failed to load pool data');
      console.error('Pool dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const formatHashrate = (hashRate: number): string => {
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

  const formatTimestamp = (timestamp: number): string => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleString();
  };

  if (loading && !poolStats) {
    return (
      <View flex bg-screenBG padding-20>
        <SkeletonView template={SkeletonView.templates.TEXT_CONTENT} times={5} />
      </View>
    );
  }

  if (error) {
    return (
      <View flex bg-screenBG padding-20 center>
        <Text text60 $textDanger marginB-10>Error Loading Pool Data</Text>
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
        {/* Pool Overview */}
        <Card enableShadow marginB-20>
          <View padding-20>
            <Text text50 $textDefault marginB-15>AlphaBlock Pool Overview</Text>
            
            {poolStats && (
              <View>
                <View row spread marginB-10>
                  <Text text70 $textNeutral>Total Hashrate</Text>
                  <Text text60 $textDefault style={{ color: '#06B6D4' }}>
                    {formatHashrate(poolStats.pool_statistics.hashRate)}
                  </Text>
                </View>
                <View row spread marginB-10>
                  <Text text70 $textNeutral>Active Miners</Text>
                  <Text text60 $textDefault style={{ color: '#8B5CF6' }}>
                    {poolStats.pool_statistics.miners}
                  </Text>
                </View>
                <View row spread marginB-10>
                  <Text text70 $textNeutral>Total Blocks Found</Text>
                  <Text text60 $textDefault>
                    {poolStats.pool_statistics.totalBlocksFound}
                  </Text>
                </View>
                <View row spread>
                  <Text text70 $textNeutral>Total Hashes</Text>
                  <Text text60 $textNeutral>
                    {poolStats.pool_statistics.totalHashes.toLocaleString()}
                  </Text>
                </View>
              </View>
            )}
          </View>
        </Card>

        {/* Pool Configuration */}
        {poolConfig && (
          <Card enableShadow marginB-20>
            <View padding-20>
              <Text text50 $textDefault marginB-15>Pool Configuration</Text>
              <View row spread marginB-10>
                <Text text70 $textNeutral>Pool Fee</Text>
                <Text text60 $textDefault>
                  {poolConfig.pplns_fee}%
                </Text>
              </View>
              <View row spread marginB-10>
                <Text text70 $textNeutral>Minimum Payout</Text>
                <Text text60 $textDefault>
                  {formatXMR(poolConfig.min_wallet_payout)}
                </Text>
              </View>
              {poolConfig.ports && poolConfig.ports.length > 0 && (
                <View marginT-10>
                  <Text text70 $textNeutral marginB-10>Available Ports</Text>
                  {poolConfig.ports.map((port, idx) => (
                    <View key={idx} row spread marginB-5 padding-10 bg-grey80 br10>
                      <Text text80 $textDefault>Port {port.port}</Text>
                      <Text text80 $textNeutral>Difficulty: {port.difficulty.toLocaleString()}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          </Card>
        )}

        {/* Recent Blocks */}
        {recentBlocks.length > 0 && (
          <Card enableShadow>
            <View padding-20>
              <Text text50 $textDefault marginB-15>Recent Blocks</Text>
              <ScrollView>
                {recentBlocks.map((block, idx) => (
                  <View
                    key={idx}
                    marginB-10
                    padding-15
                    bg-grey80
                    br10
                  >
                    <View row spread marginB-5>
                      <Text text70 $textDefault>Block #{block.height}</Text>
                      <Text text80 $textNeutral>{formatTimestamp(block.time)}</Text>
                    </View>
                    <Text text80 $textNeutral marginB-5 numberOfLines={1}>
                      {block.hash}
                    </Text>
                    <View row spread>
                      <Text text80 $textNeutral>Reward: {formatXMR(block.reward)}</Text>
                      <Text text80 $textNeutral>Shares: {block.shares}</Text>
                    </View>
                  </View>
                ))}
              </ScrollView>
            </View>
          </Card>
        )}
      </View>
    </ScrollView>
  );
};

export default PoolDashboardScreen;
