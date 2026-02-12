import React from 'react';
import { Incubator } from 'react-native-ui-lib';
import { IPool, sharedStyles, PredefinedPoolName } from '.';
import { validateWalletAddress } from '../../../../core/utils';

export type AlphaBlockPoolType = PredefinedPoolName.AlphaBlockLow | PredefinedPoolName.AlphaBlockMedium | PredefinedPoolName.AlphaBlockStandard;

interface AlphaBlockProps extends IPool {
  poolType: AlphaBlockPoolType;
}

const getPoolConfig = (poolType: AlphaBlockPoolType) => {
  switch (poolType) {
    case PredefinedPoolName.AlphaBlockLow:
      return { hostname: 'alphablockmonero.xyz', port: 5555, difficulty: 10000 };
    case PredefinedPoolName.AlphaBlockMedium:
      return { hostname: 'alphablockmonero.xyz', port: 7777, difficulty: 50000 };
    case PredefinedPoolName.AlphaBlockStandard:
      return { hostname: 'alphablockmonero.xyz', port: 3333, difficulty: null };
    default:
      return { hostname: 'alphablockmonero.xyz', port: 5555, difficulty: 10000 };
  }
};

export const AlphaBlock:React.FC<AlphaBlockProps> = ({ onChange, poolType }) => {
  const [wallet, setWallet] = React.useState<string>('');
  const poolConfig = getPoolConfig(poolType);

  React.useEffect(() => {
    onChange({
      hostname: poolConfig.hostname,
      port: poolConfig.port,
      username: wallet,
      password: 'AlphaBlockMiner',
    });
  }, [wallet, poolConfig.hostname, poolConfig.port]);

  return (
    <>
      <Incubator.TextField
        label="Wallet Address"
        value={wallet}
        onChangeText={setWallet}
        validate={['required', (value: string) => validateWalletAddress(value)]}
        validationMessage={['Required', 'Wallet validation failed']}
        validateOnChange
        enableErrors
        floatOnFocus
        showCharCounter
        maxLength={128}
        fieldStyle={sharedStyles.withUnderline}
        hint="46gPyHjLPPM8HaayVyvCDcF2..."
        placeholder="46gPyHjLPPM8HaayVyvCDcF2..."
        marginB-10
        numberOfLines={1}
        textBreakStrategy="simple"
      />
      <Incubator.TextField
        label="Port"
        value={`${poolConfig.port}`}
        editable={false}
        fieldStyle={sharedStyles.withUnderline}
        marginB-10
      />
      {poolConfig.difficulty && (
        <Incubator.TextField
          label="Difficulty"
          value={`${poolConfig.difficulty}`}
          editable={false}
          fieldStyle={sharedStyles.withUnderline}
          marginB-10
        />
      )}
    </>
  );
};
