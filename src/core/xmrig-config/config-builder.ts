/* eslint-disable max-classes-per-file */
import _ from 'lodash';
import base64 from 'react-native-base64';
import * as JSON5 from 'json5';
import {
  Configuration,
  ConfigurationMode,
  IAdvanceConfiguration,
  ISimpleConfiguration,
} from '../settings/settings.interface';
import { config as configJson } from './config';

type Pool = {
    user: string;
    pass: string;
    url: string;
    tls: boolean;
}
class ConfigBuilderPrivate {
  config: Record<string, any> = _.cloneDeep(configJson);

  reset() {
    this.config = _.cloneDeep(configJson);
  }

  setConfig(data: Record<string, any>) {
    this.config = _.cloneDeep(data);
  }

  setPool(pool: Partial<Pool>) {
    this.config = {
      ...this.config,
      ...{
        pools: [
          {
            ...this.config.pools[0],
            ...pool,
          },
        ],
      },
    };
  }

  setProps(props: Record<string, any>) {
    this.config = _.merge(
      this.config,
      props,
    );
  }

  getConfigString() {
    return JSON.stringify(this.config);
  }

  getConfigBase64() {
    return base64.encode(this.getConfigString());
  }
}

export default class ConfigBuilder {
  public static build(configuration: Configuration): ConfigBuilderPrivate | null {
    if (!configuration) {
      return null;
    }
    const pConfig = new ConfigBuilderPrivate();

    if (configuration.mode === ConfigurationMode.SIMPLE) {
      const asSimpleConfig: ISimpleConfiguration = _.cloneDeep(configuration);
      pConfig.reset();
      
      // Build pool URL with stratum+tcp:// prefix
      const poolUrl = asSimpleConfig.properties?.pool?.hostname && asSimpleConfig.properties?.pool?.port
        ? `stratum+tcp://${asSimpleConfig.properties.pool.hostname}:${asSimpleConfig.properties.pool.port}`
        : '';
      
      // Build worker name: AlphaBlockMiner or AlphaBlockMiner:custom_worker
      // If no custom password is set, use default format
      const workerName = asSimpleConfig.properties?.pool?.password 
        ? asSimpleConfig.properties.pool.password 
        : 'AlphaBlockMiner';
      
      pConfig.setPool({
        user: asSimpleConfig.properties?.pool?.username,
        pass: workerName,
        url: poolUrl,
        tls: asSimpleConfig.properties?.pool?.sslEnabled || false,
      });
      
      // Ensure pool has algo and coin set for AlphaBlock (rx/0, XMR)
      if (poolUrl.includes('alphablockmonero.xyz')) {
        pConfig.setProps({
          pools: [{
            ...pConfig.config.pools[0],
            algo: 'rx/0',
            coin: 'XMR',
          }],
        });
      }
      
      pConfig.setProps({
        cpu: {
          priority: asSimpleConfig.properties?.cpu?.priority || 2,
          yield: asSimpleConfig.properties?.cpu?.yield,
          'max-threads-hint': asSimpleConfig.properties?.cpu?.max_threads_hint,
          'huge-pages': false, // Not available on Android
        },
        randomx: {
          mode: asSimpleConfig.properties?.cpu?.random_x_mode || 'light',
        },
        'donate-level': 0, // No dev fee
        'donate-over-proxy': 0,
      });
      pConfig.setProps({
        cpu: {
          ...asSimpleConfig.properties?.algos,
        },
      });
      pConfig.setProps({
        'algo-perf': asSimpleConfig.properties?.algo_perf,
      });
    }

    if (configuration.mode === ConfigurationMode.ADVANCE) {
      const asAdvancedConfig: IAdvanceConfiguration = _.cloneDeep(configuration);
      pConfig.setConfig(JSON5.parse(asAdvancedConfig.config || '{}'));
      pConfig.setProps({
        http: {
          enabled: true,
        },
        background: false,
        colors: true,
        'donate-level': 0, // Ensure no dev fee even in advanced mode
        'donate-over-proxy': 0,
        cpu: {
          'huge-pages': false, // Not available on Android
          priority: pConfig.config.cpu?.priority || 2,
        },
      });
    }

    return pConfig;
  }
}
