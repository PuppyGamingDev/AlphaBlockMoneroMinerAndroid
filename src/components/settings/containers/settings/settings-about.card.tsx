import React from 'react';
import {
  Card, Text, View,
} from 'react-native-ui-lib';
import { SettingsCardProps } from '.';
import { version } from '../../../../version';

const SettingsAboutCard: React.FC<SettingsCardProps<any>> = () => (
  <Card enableShadow>
    <View centerV spread padding-20 paddingB-5>
      <Card.Section
        style={{ flexShrink: 1 }}
        content={[
          { text: 'About', text65: true, $textDefault: true },
        ]}
      />
    </View>
    <View spread padding-20 paddingT-10>
      <View marginB-15 center>
        <Text text40 style={{ color: '#8B5CF6', fontWeight: 'bold' }} marginB-5>
          AlphaBlock Miner
        </Text>
        <Text text80 style={{ color: '#06B6D4' }} marginB-10>
          Version {version}
        </Text>
        <Text text90 $textNeutral textAlign="center" marginB-10>
          Official Android mining app for the AlphaBlock Monero Mining Pool
        </Text>
      </View>
      
      <View marginB-10>
        <Text text70 $textDefault marginB-5>Pool Information</Text>
        <Text text90 $textNeutral>
          Pool: alphablockmonero.xyz
        </Text>
        <Text text90 $textNeutral>
          Website: https://alphablockmonero.xyz
        </Text>
        <Text text90 $textNeutral>
          Fee: 0% (PPLNS)
        </Text>
      </View>

      <View marginB-10>
        <Text text70 $textDefault marginB-5>Credits</Text>
        <Text text90 $textNeutral marginB-5>
          AlphaBlock Miner uses XMRig as the mining engine.
        </Text>
        <Text text90 $textNeutral>
          XMRig is open-source software licensed under GPLv3.
        </Text>
        <Text text90 $textNeutral marginT-5>
          Built on React Native and Android NDK.
        </Text>
      </View>

      <View>
        <Text text70 $textDefault marginB-5>License</Text>
        <Text text90 $textNeutral>
          MIT License - AlphaBlock Miner
        </Text>
        <Text text90 $textNeutral>
          GPLv3 - XMRig (mining engine)
        </Text>
      </View>
    </View>
  </Card>
);

export default SettingsAboutCard;
