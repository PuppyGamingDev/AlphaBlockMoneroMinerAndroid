import React from 'react';
import {
  Card, Slider, Switch, Text, View,
} from 'react-native-ui-lib';
import { useDebouncedCallback } from 'use-debounce';
import { SettingsCardProps } from '.';
import { ISettings } from '../../../../core/settings/settings.interface';

const SettingsOthersCard:React.FC<SettingsCardProps<ISettings>> = ({
  settings,
  onUpdate,
}) => {
  const debouncedUpdate = useDebouncedCallback(onUpdate, 1000);

  return (
    <Card enableShadow>
      <View centerV spread padding-20 paddingB-5>
        <Card.Section
          style={{ flexShrink: 1 }}
          content={[
            { text: 'Other', text65: true, $textDefault: true },
          ]}
        />
      </View>
      <View spread padding-20 paddingT-10>
        <View marginB-10>
          <View flex marginB-5>
            <Text text75 $textDefault flex column row>Print Time</Text>
            <Text text100 $textDefault row>
              Print hashrate report every specified number of seconds
            </Text>
          </View>
          <View row flex centerV>
            <Slider
              containerStyle={{ flex: 1 }}
              minimumValue={0}
              maximumValue={300}
              step={10}
              value={settings.printTime}
              onValueChange={
              (value) => debouncedUpdate({ printTime: value })
            }
            />
            <Text marginL-10>
              {settings.printTime}
              s
            </Text>
          </View>
        </View>
        <View marginB-10>
          <View flex marginB-5 row spread centerV>
            <View flex>
              <Text text75 $textDefault flex column row>Auto-Start Mining</Text>
              <Text text100 $textDefault row>
                Automatically start mining when the app opens
              </Text>
            </View>
            <Switch
              value={settings.autoStart || false}
              onValueChange={(value) => onUpdate({ autoStart: value })}
            />
          </View>
        </View>
      </View>
    </Card>
  );
};

export default SettingsOthersCard;
