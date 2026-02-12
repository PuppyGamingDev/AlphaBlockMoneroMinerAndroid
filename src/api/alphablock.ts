/**
 * AlphaBlock Pool API Client
 * Base URL: https://api.alphablockmonero.xyz
 */

const API_BASE = 'https://api.alphablockmonero.xyz';

export interface PoolStats {
  pool_statistics: {
    hashRate: number;
    miners: number;
    totalHashes: number;
    totalBlocksFound: number;
  };
}

export interface PoolConfig {
  pplns_fee: number;
  min_wallet_payout: number;
  ports: Array<{
    port: number;
    difficulty: number;
    description?: string;
  }>;
}

export interface Block {
  height: number;
  hash: string;
  time: number;
  reward: number;
  shares: number;
}

export interface MinerStats {
  hash: number | false;
  totalHashes: number | false;
  validShares: number | false;
  invalidShares: number | false;
  amtDue: number | false; // atomic units
  amtPaid: number | false; // atomic units
}

export interface WorkerStats {
  [workerName: string]: {
    hash: number | false;
    totalHashes: number | false;
    validShares: number | false;
    invalidShares: number | false;
  };
}

/**
 * Convert atomic units to XMR
 */
export function formatXMR(atomicUnits: number | false): string {
  if (atomicUnits === false || atomicUnits === 0) {
    return '0.0000 XMR';
  }
  return (atomicUnits / 1000000000000).toFixed(4) + ' XMR';
}

/**
 * Get pool statistics
 */
export async function getPoolStats(): Promise<PoolStats> {
  const response = await fetch(`${API_BASE}/pool/stats`);
  if (!response.ok) {
    throw new Error(`Failed to fetch pool stats: ${response.statusText}`);
  }
  return response.json();
}

/**
 * Get pool configuration
 */
export async function getPoolConfig(): Promise<PoolConfig> {
  const response = await fetch(`${API_BASE}/config`);
  if (!response.ok) {
    throw new Error(`Failed to fetch pool config: ${response.statusText}`);
  }
  return response.json();
}

/**
 * Get recent blocks
 */
export async function getRecentBlocks(limit: number = 10): Promise<Block[]> {
  const response = await fetch(`${API_BASE}/pool/blocks/pplns?limit=${limit}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch recent blocks: ${response.statusText}`);
  }
  return response.json();
}

/**
 * Get miner statistics
 */
export async function getMinerStats(walletAddress: string): Promise<MinerStats> {
  const response = await fetch(`${API_BASE}/miner/${walletAddress}/stats`);
  if (!response.ok) {
    throw new Error(`Failed to fetch miner stats: ${response.statusText}`);
  }
  return response.json();
}

/**
 * Get all workers for a miner
 */
export async function getMinerWorkers(walletAddress: string): Promise<WorkerStats> {
  const response = await fetch(`${API_BASE}/miner/${walletAddress}/stats/allWorkers`);
  if (!response.ok) {
    throw new Error(`Failed to fetch miner workers: ${response.statusText}`);
  }
  return response.json();
}

/**
 * Get available mining ports
 */
export async function getPoolPorts(): Promise<Array<{ port: number; difficulty: number }>> {
  const response = await fetch(`${API_BASE}/pool/ports`);
  if (!response.ok) {
    throw new Error(`Failed to fetch pool ports: ${response.statusText}`);
  }
  return response.json();
}
