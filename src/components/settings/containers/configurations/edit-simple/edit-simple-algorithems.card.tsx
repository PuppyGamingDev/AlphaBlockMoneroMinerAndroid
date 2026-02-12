import { merge } from 'lodash/fp';
import React from 'react';
import {
  Card, Colors, GridView, SkeletonView, Switch, Text, View,
} from 'react-native-ui-lib';
import { Dimensions, ScaledSize } from 'react-native';
import { Algorithems, Algorithm } from '../../../../../core/settings/settings.interface';
import { EditSimpleCardProps } from './index';

const screen = Dimensions.get('screen');

export const EditSimpleAlgorithemsCard: React.FC<EditSimpleCardProps> = (
  { setLocalState, localState },
) => {
  const [dimensions, setDimensions] = React.useState<ScaledSize>({
    ...screen,
    width: screen.width - 20,
  });

  React.useEffect(() => {
    const subscription = Dimensions.addEventListener(
      'change',
      ({ screen: _screen }) => {
        setDimensions({
          ..._screen,
          width: _screen.width - 20,
        });
      },
    );
    return () => subscription?.remove();
  });

  const renderItem = React.useCallback((item: Algorithm) => (
    <View marginB-5 key={`algo-${item}`} style={{ borderBottomWidth: 1, borderColor: Colors.$outlineDisabled }} marginR-10 paddingB-10>
      <View row flex>
        <Text text90 $textNeutralLight flex column marginB-5>{item}</Text>
        <Switch
          value={localState.properties?.algos ? localState.properties?.algos[item] : true}
          onValueChange={(value) => setLocalState((oldState) => merge(
            oldState,
            {
              properties: {
                algos: {
                  [`${item}`]: value,
                },
              },
            },
          ))}
        />
      </View>
    </View>
  ), [localState.properties]);

  // AlphaBlock only uses rx/0, so show a simplified view
  return React.useMemo(() => (
    <Card
      enableShadow
    >
      <View centerV spread padding-20 paddingB-5>
        <Card.Section
          style={{ flexShrink: 1 }}
          content={[
            { text: 'Algorithm', text65: true, $textDefault: true },
            { text: 'AlphaBlock Miner uses RandomX (rx/0) algorithm for Monero mining. This is the only algorithm supported.', text90: true, $textNeutral: true },
          ]}
        />
      </View>
      <View spread padding-20 paddingT-10>
        <View row centerV padding-15 bg-grey80 br10>
          <Text text60 $textDefault flex>RandomX (rx/0)</Text>
          <View paddingL-10>
            <Text text70 style={{ color: '#06B6D4' }}>Enabled</Text>
          </View>
        </View>
      </View>
    </Card>
  ), []);
};

const EditSimpleAlgorithemsCardSkeleton: React.FC<EditSimpleCardProps> = (props) => {
  const [loaded, setLoaded] = React.useState<boolean>(false);
  React.useEffect(() => {
    const interval = setTimeout(() => setLoaded(true), 800);
    return () => {
      clearTimeout(interval);
      setLoaded(false);
    };
  }, []);

  return (
    <SkeletonView
      template={SkeletonView.templates.TEXT_CONTENT}
      customValue={props}
      showContent={loaded}
      renderContent={
        // eslint-disable-next-line react/jsx-props-no-spreading
        (customProps: EditSimpleCardProps) => (<EditSimpleAlgorithemsCard {...customProps} />)
      }
      times={5}
    />
  );
};

export default EditSimpleAlgorithemsCardSkeleton;
