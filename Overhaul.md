# AlphaBlock Miner — Android App Implementation Plan

## Overview

Fork and rebrand [XMRig-for-Android](https://github.com/XMRig-for-Android/xmrig-for-android) (MIT licensed, 222 stars, React Native + XMRig native binary) into a dedicated **AlphaBlock Mining Pool** Android app. The app will be pre-configured for the AlphaBlock pool, branded with the purple/cyan cyberpunk aesthetic, and distributed as a direct APK download from alphablockmonero.xyz.

**Base Repository:** `https://github.com/XMRig-for-Android/xmrig-for-android` (fork of garrylachman/react-native-xmrig)

---

## Architecture Understanding

The app has two layers:

1. **Native Layer (C++):** XMRig compiled as ARM binaries via Android NDK. Build scripts in `xmrig/lib-builder/script/` compile hwloc, libuv, and xmrig for each ABI (armeabi-v7a, arm64-v8a, x86, x86_64). Output binaries are placed in the Android project's `jniLibs` folder as `.so` files (`libxmrig.so`, `libxmrig-mo.so` for MoneroOcean fork).

2. **UI Layer (React Native + TypeScript):** The user interface that spawns the XMRig process, feeds it config.json, reads stdout for stats, and displays hashrate/pool info. Uses React Native with Android native modules for process management.

**Key directories:**
- `src/` — React Native TypeScript source (UI components, screens, state management)
- `android/` — Android native project (Java/Kotlin native modules, gradle config, manifest)
- `xmrig/lib-builder/` — NDK cross-compile scripts for building XMRig binaries
- `assets/` — App icons and images
- `app.json` — React Native app config
- `package.json` — Node dependencies and scripts

---

## Phase 1: Repository Setup & Identity

### 1.1 Fork and Rename

```bash
# Fork https://github.com/XMRig-for-Android/xmrig-for-android
# Clone your fork locally
git clone https://github.com/YOUR_USERNAME/alphablock-miner-android.git
cd alphablock-miner-android
```

### 1.2 Update package.json

Change the app identity:

```json
{
  "name": "alphablock-miner",
  "version": "1.0.0",
  "description": "AlphaBlock Monero Mining Pool - Android Miner",
  "author": {
    "name": "AlphaBlock",
    "url": "https://alphablockmonero.xyz"
  },
  "displayName": "AlphaBlock Miner",
  "homepage": "https://alphablockmonero.xyz",
  "repository": {
    "url": "https://github.com/YOUR_USERNAME/alphablock-miner-android",
    "type": "git"
  },
  "license": "MIT"
}
```

### 1.3 Update app.json

```json
{
  "name": "AlphaBlockMiner",
  "displayName": "AlphaBlock Miner"
}
```

### 1.4 Update Android Package ID

In `android/app/build.gradle`, change the applicationId:

```
- applicationId "com.alphablockminer"
+ applicationId "xyz.alphablockmonero.miner"
```

Also rename the Java/Kotlin package directories under `android/app/src/main/java/` from `com/xmrigforandroid/` to `xyz/alphablockmonero/miner/`. Update all Java/Kotlin files that reference the old package name. Update `android/app/src/main/AndroidManifest.xml` with the new package.

### 1.5 Update version.properties

```properties
majorVersion=1
minorVersion=0
patchVersion=0
```

---

## Phase 2: Branding & Theming

### 2.1 Color Scheme

Apply the AlphaBlock cyberpunk aesthetic throughout. These are the exact brand colors from the AlphaBlock web frontend:

```
Primary Purple:    #8B5CF6  (--alpha-purple)
Primary Cyan:      #06B6D4  (--alpha-cyan)
Dark Background:   #0A0E27  (--alpha-dark)
Darker Background: #050816  (--alpha-darker)
Accent Pink:       #EC4899  (--alpha-accent)
Purple Glow:       rgba(139, 92, 246, 0.3)
Cyan Glow:         rgba(6, 182, 212, 0.3)
Text Primary:      #E5E7EB
Text Secondary:    #6B7280
```

**Where to apply these colors:**

Search the `src/` directory for all theme/color definitions. The app likely has a theme file or uses React Native Paper/styled-components. Replace:
- All primary/accent colors with `#8B5CF6` (purple) and `#06B6D4` (cyan)
- Background colors with `#0A0E27` / `#050816`
- Any existing teal/green accent colors with the AlphaBlock cyan
- Error/warning colors can stay red/orange but adjust pink accent to `#EC4899`

Specific files to look for and modify:
- `src/theme.ts` or `src/styles/theme.ts` (or similar)
- Any `colors.ts` or `constants.ts` file
- React Native Paper theme configuration if used
- Dark mode theme definitions (this app should ONLY use dark mode)

### 2.2 Typography

The AlphaBlock brand uses:
- **Orbitron** (headings, logo text) — bold, futuristic
- **JetBrains Mono** (body, stats, monospace data)

For React Native, install and configure these custom fonts:
- Download Orbitron from Google Fonts, place in `assets/fonts/`
- JetBrains Mono is likely already available or install it
- Update `react-native.config.js` to link fonts
- Run `npx react-native-asset` to link

### 2.3 App Icon & Splash Screen

Create new app icons with AlphaBlock branding:
- Use the AlphaBlock "A" logo / block design with purple-to-cyan gradient
- Generate all required Android sizes using Android Asset Studio or a tool like `@anthropic/icon-gen`
- Replace files in `android/app/src/main/res/mipmap-*/` (mdpi, hdpi, xhdpi, xxhdpi, xxxhdpi)
- Replace `assets/appicons/` contents
- Create a splash screen with AlphaBlock branding (dark background, centered logo, purple glow)

### 2.4 Remove "XMRig for Android" Text References

Global find & replace across all source files:
- `"XMRig for Android"` → `"AlphaBlock Miner"`
- `"XMRig"` in user-visible strings → `"AlphaBlock Miner"` (be careful not to change XMRig binary/process references)
- `"xmrigforandroid"` → `"alphablockminer"`
- Update any about/credits screen to reference AlphaBlock while crediting XMRig as the mining engine

---

## Phase 3: Pool Configuration (CRITICAL)

### 3.1 Default Pool Configuration

The app currently allows users to select from preset pools (MoneroOcean, etc.) and add custom pools. We need to:

1. **Set AlphaBlock as the default and primary pool**
2. **Remove or deprioritize other pool presets** (optionally keep custom pool ability for power users)

Search `src/` for pool-related configuration. Look for:
- Pool preset lists/arrays (likely in a constants or config file)
- Pool configuration form/screen components
- Default config.json generation logic

**AlphaBlock Pool Presets to add:**

```json
{
  "pools": [
    {
      "name": "AlphaBlock - Low Diff (Phones)",
      "url": "stratum+tcp://alphablockmonero.xyz:5555",
      "algo": "rx/0",
      "coin": "XMR",
      "difficulty": 10000,
      "description": "Recommended for mobile devices"
    },
    {
      "name": "AlphaBlock - Medium Diff",
      "url": "stratum+tcp://alphablockmonero.xyz:7777",
      "algo": "rx/0", 
      "coin": "XMR",
      "difficulty": 50000,
      "description": "For powerful devices / tablets"
    },
    {
      "name": "AlphaBlock - Standard",
      "url": "stratum+tcp://alphablockmonero.xyz:3333",
      "algo": "rx/0",
      "coin": "XMR",
      "description": "Auto-adjusting difficulty"
    }
  ]
}
```

The default selection for new users should be port 5555 (10,000 difficulty) since phones are low hashrate devices.

### 3.2 XMRig config.json Generation

The app generates a `config.json` that gets passed to the XMRig binary. Find the config generation logic (likely in `src/` — search for `config.json`, `generateConfig`, or `buildConfig`). Ensure the generated config includes:

```json
{
  "autosave": false,
  "donate-level": 0,
  "donate-over-proxy": 0,
  "cpu": {
    "enabled": true,
    "huge-pages": false,
    "priority": 2
  },
  "pools": [
    {
      "algo": "rx/0",
      "coin": "XMR",
      "url": "stratum+tcp://alphablockmonero.xyz:5555",
      "user": "<WALLET_ADDRESS>",
      "pass": "AlphaBlockMiner",
      "keepalive": true,
      "tls": false
    }
  ]
}
```

**Important settings for mobile:**
- `"donate-level": 0` — Remove all XMRig dev fees (the original app had a 3% dev fee, remove this)
- `"huge-pages": false` — Not available on Android
- `"priority": 2` — Lower priority to not kill the phone
- `"pass": "AlphaBlockMiner"` — Worker identifier so you can see app users on the pool

### 3.3 Remove Dev Fee

The original app (garrylachman's) had a dev fee mechanism where it would mine to the developer's wallet for a percentage of time. Search all source code for:
- `"donate"` or `"dev-fee"` or `"devFee"`
- `"donate-level"` 
- Any hardcoded wallet addresses (Monero addresses start with `4` or `8`)
- Any timer/interval logic that switches mining config periodically
- References to "rewards" or "reward system"

Remove ALL dev fee logic. Set `donate-level` to `0` in any XMRig config generation.

### 3.4 Remove MoneroOcean Fork Option

The fork version supports selecting between "Original XMRig" and "MoneroOcean XMRig fork". Since AlphaBlock uses standard RandomX mining (rx/0), we only need the original XMRig binary.

- Remove the XMRig fork selection dropdown from the configuration UI
- Remove `libxmrig-mo.so` (MoneroOcean binary) from the build if present
- Hardcode the app to use the original XMRig binary only
- Remove any MoneroOcean-specific algo-switching logic

---

## Phase 4: AlphaBlock Pool Stats Integration

### 4.1 Pool Stats API

The app currently pulls stats from MoneroOcean's API. Replace this with calls to the AlphaBlock nodejs-pool API.

**AlphaBlock API Base URL:** `https://api.alphablockmonero.xyz`

**Available Endpoints (nodejs-pool API):**

| Endpoint | Description |
|----------|-------------|
| `GET /pool/stats` | Pool hashrate, miners count, totalHashes, totalBlocksFound |
| `GET /config` | Pool config (pplns_fee, min_wallet_payout, ports, etc.) |
| `GET /pool/blocks/pplns?limit=10` | Recent blocks found |
| `GET /miner/{address}/stats` | Individual miner stats (hash, totalHashes, validShares, invalidShares, amtDue, amtPaid) |
| `GET /miner/{address}/stats/allWorkers` | All workers for a miner |
| `GET /pool/ports` | Available mining ports and their difficulty |

**Important API notes:**
- Timestamps are in seconds (not milliseconds)
- Inactive miners return `false` values for some fields
- XMR amounts are in atomic units (divide by 1,000,000,000,000 for XMR)
- Responses include: `totalHashes`, `validShares`, `invalidShares`, `amtDue`, `amtPaid`

### 4.2 Replace Pool Stats Screen

Find the Pool Stats tab/screen in `src/`. It currently pulls from MoneroOcean's API. Replace with AlphaBlock API calls:

```typescript
const API_BASE = 'https://api.alphablockmonero.xyz';

// Pool overview
const poolStats = await fetch(`${API_BASE}/pool/stats`).then(r => r.json());
// poolStats.pool_statistics.hashRate
// poolStats.pool_statistics.miners
// poolStats.pool_statistics.totalHashes
// poolStats.pool_statistics.totalBlocksFound

// Miner personal stats (using their wallet address)
const minerStats = await fetch(`${API_BASE}/miner/${walletAddress}/stats`).then(r => r.json());
// minerStats.hash (current hashrate)
// minerStats.totalHashes
// minerStats.amtDue (pending balance, atomic units)
// minerStats.amtPaid (total paid, atomic units)
// minerStats.validShares
// minerStats.invalidShares

// Workers
const workers = await fetch(`${API_BASE}/miner/${walletAddress}/stats/allWorkers`).then(r => r.json());
// Object with worker names as keys, stats objects as values
```

### 4.3 Add Pool Dashboard Tab

Consider adding an "AlphaBlock Pool" tab that shows:
- Pool hashrate (from `/pool/stats`)
- Active miners count
- Total blocks found
- Recent blocks list (from `/pool/blocks/pplns`)
- Pool fee info (from `/config`)

This gives users a sense of community and pool activity.

### 4.4 Miner Stats Display

Replace the existing pool-specific stats display with AlphaBlock-relevant data:
- **Current Hashrate** — from miner stats API
- **Pending Balance** — `amtDue` converted to XMR
- **Total Paid** — `amtPaid` converted to XMR
- **Valid Shares** — `validShares`
- **Active Workers** — from `/miner/{address}/stats/allWorkers`

Format XMR values:
```typescript
function formatXMR(atomicUnits: number): string {
  return (atomicUnits / 1000000000000).toFixed(4) + ' XMR';
}
```

---

## Phase 5: UI Simplification & UX

### 5.1 Simplify the Configuration Flow

The current app has complex configuration with multiple profiles, fork selection, algo management, and advanced JSON editing. For AlphaBlock, simplify to:

**Simple Setup Screen:**
1. Enter wallet address (Monero address starting with `4` or `8`)
2. Select difficulty port (auto-select port 5555 for phones)
3. Set CPU thread count (default: device cores / 2, with slider)
4. Start mining button

**Remove or hide:**
- Multiple configuration profiles (just have one)
- XMRig fork selection (always use original)
- Algorithm management screen (we only mine rx/0)
- Benchmark feature (not needed for a single-pool app)
- Advanced config.json editor (hide behind a "developer mode" toggle)

### 5.2 Main Mining Screen Layout

The main screen should show:
1. **AlphaBlock logo** at the top
2. **Big START/STOP button** (green/red, glowing)
3. **Live hashrate** — large number with `H/s` unit
4. **Hashrate chart** — keep the existing histogram
5. **Quick stats row:** Shares accepted | Uptime | Difficulty
6. **Pool stats row:** Your balance | Total paid

### 5.3 Bottom Navigation Tabs

Simplify to:
1. **Mine** — Main mining screen with start/stop and live stats
2. **Stats** — Detailed personal stats from AlphaBlock API (balance, shares, workers, payment history)
3. **Pool** — AlphaBlock pool overview (pool hashrate, miners, recent blocks)
4. **Settings** — Wallet address, thread count, difficulty port, theme, about

### 5.4 Worker Name

When generating the XMRig config, use a worker name that helps identify mobile miners:
```
"pass": "AlphaBlockMiner:<device_model>"
```
The password field in stratum is often used for worker identification. This lets Mike see on the pool dashboard which connections are from the Android app.

---

## Phase 6: Mobile-Specific Features

### 6.1 Battery & Performance Controls

Add controls that the original app may not have:
- **Mining intensity slider** — Maps to XMRig thread count (1 to device max cores)
- **Battery saver mode** — Reduces to 1 thread, lowers priority
- **Mine only when charging** — Toggle to auto-start/stop based on power state
- **Temperature warning** — Show warning if device gets too hot (use Android thermal API if available)

### 6.2 Background Mining

The app should continue mining when backgrounded using an Android Foreground Service with a persistent notification showing:
- "AlphaBlock Miner running"
- Current hashrate
- Stop button in the notification

This is likely already implemented in the original app's Android native module (`MiningService` or similar in `android/` directory). Verify it works and update the notification text/icon to AlphaBlock branding.

### 6.3 Auto-Start Option

Add a setting to auto-start mining when the app opens (off by default).

---

## Phase 7: Build System

### 7.1 XMRig Binary Build

The build scripts are in `xmrig/lib-builder/script/`. Key script is `xmrig-build.sh` which:
1. Downloads XMRig source
2. Patches CMakeLists.txt for Android (replaces `pthread rt dl log` with `dl`)
3. Uses Android NDK toolchain to cross-compile for each ABI
4. Outputs binaries to `android/app/src/main/jniLibs/{ABI}/libxmrig.so`

**Prerequisites for building XMRig binaries:**
- Android SDK installed (`$ANDROID_HOME` set)
- Android NDK (check which version the script expects — likely NDK 21+)
- CMake 3.18.1+ (installed via Android SDK manager)

To build:
```bash
cd xmrig/lib-builder/script
chmod +x *.sh
./xmrig-build.sh   # Also run hwloc-build.sh and libuv-build.sh first
```

### 7.2 React Native App Build

```bash
# Install Node dependencies
npm install   # or yarn install

# Build debug APK
cd android
./gradlew assembleDebug

# Build release APK
./gradlew assembleRelease
```

The release APK needs to be signed. Create a keystore:
```bash
keytool -genkeypair -v -storetype PKCS12 -keystore alphablock-miner.keystore \
  -alias alphablock -keyalg RSA -keysize 2048 -validity 10000
```

Configure signing in `android/app/build.gradle`:
```groovy
signingConfigs {
    release {
        storeFile file('alphablock-miner.keystore')
        storePassword 'YOUR_STORE_PASSWORD'
        keyAlias 'alphablock'
        keyPassword 'YOUR_KEY_PASSWORD'
    }
}
```

### 7.3 Minimum SDK Version

The app currently targets a minimum SDK of 29 (Android 10). This is a limitation of React Native native modules. Keep this as-is — Android 10+ covers the vast majority of active Android devices.

---

## Phase 8: Distribution

### 8.1 NOT on Google Play

Google Play bans cryptocurrency mining apps. The React Native XMRig app was removed from the Play Store in February 2025. Distribute via:

1. **Direct APK download from alphablockmonero.xyz** — Add a "Download Android Miner" button on the pool website with the signed APK
2. **GitHub Releases** — Attach the APK to GitHub release tags
3. **Discord** — Pin download link in the AlphaBlock Discord

### 8.2 Website Download Page

Add a download section to the AlphaBlock pool website with:
- APK download button
- QR code linking to the download
- SHA256 hash of the APK for verification
- Installation guide (enable "Install from unknown sources")
- Version number and changelog

### 8.3 Update Mechanism

Since we can't use Play Store auto-update, add an in-app update checker:
- On app launch, fetch version info from `https://alphablockmonero.xyz/app/version.json`
- Compare with installed version
- Show "Update available" notification with download link
- Version JSON format:
```json
{
  "version": "1.0.0",
  "versionCode": 1,
  "downloadUrl": "https://alphablockmonero.xyz/app/alphablock-miner-v1.0.0.apk",
  "changelog": "Initial release"
}
```

---

## File-by-File Change Summary

### Files to MODIFY:

| File | Changes |
|------|---------|
| `package.json` | App name, author, description, homepage, repo URL |
| `app.json` | App name and display name |
| `android/app/build.gradle` | applicationId → `xyz.alphablockmonero.miner`, signing config, versionName |
| `android/app/src/main/AndroidManifest.xml` | Package name |
| `android/app/src/main/java/**` | Rename package directories and all Java/Kotlin package declarations |
| `version.properties` | Reset to 1.0.0 |
| `src/` (theme/colors files) | Replace all colors with AlphaBlock brand palette |
| `src/` (pool config/presets) | Replace pool presets with AlphaBlock pools |
| `src/` (API service files) | Replace MoneroOcean API URLs with `api.alphablockmonero.xyz` endpoints |
| `src/` (config generation) | Set donate-level to 0, default pool to AlphaBlock, default algo to rx/0 |
| `src/` (all screens) | Replace "XMRig for Android" text with "AlphaBlock Miner" |
| `src/` (navigation) | Simplify tabs to Mine/Stats/Pool/Settings |
| `assets/appicons/` | Replace with AlphaBlock branded icons |
| `android/app/src/main/res/mipmap-*/` | Replace launcher icons |

### Files to ADD:

| File | Purpose |
|------|---------|
| `src/api/alphablock.ts` | AlphaBlock pool API client (`api.alphablockmonero.xyz` endpoints) |
| `src/screens/PoolDashboard.tsx` | Pool overview screen (hashrate, miners, blocks) |
| `src/utils/updateChecker.ts` | In-app update checker |
| `assets/fonts/Orbitron-*.ttf` | Brand font files |
| `assets/fonts/JetBrainsMono-*.ttf` | Brand font files |
| `assets/images/alphablock-logo.png` | App logo asset |
| `assets/images/splash.png` | Splash screen image |

### Files to REMOVE or DISABLE:

| File/Feature | Reason |
|------|---------|
| Dev fee logic (wherever it exists) | No dev fee for AlphaBlock app |
| MoneroOcean fork binary (`libxmrig-mo.so`) | Not needed, only use original XMRig |
| Benchmark feature/screen | Not needed for single-pool dedicated app |
| Multiple profile management | Simplify to single config |
| Algorithm management screen | Only rx/0 needed |

---

## Development Environment Setup

```bash
# Prerequisites
# - Node.js 16+ (check .nvmrc in the repo)
# - Java 11 (for React Native Android builds)
# - Android Studio with SDK 29+ and NDK
# - React Native CLI

# Clone your fork
git clone https://github.com/YOUR_USERNAME/alphablock-miner-android.git
cd alphablock-miner-android

# Install dependencies
npm install   # or yarn

# If XMRig binaries are not already in jniLibs, build them:
cd xmrig/lib-builder/script
./libuv-build.sh
./hwloc-build.sh
./xmrig-build.sh
cd ../../..

# Start Metro bundler
npx react-native start

# Build and run on connected device
npx react-native run-android
```

**Note:** Check `.nvmrc` for the expected Node version and use `nvm use` if needed. The project uses `--openssl-legacy-provider` flag in the start script, indicating it may use an older Node version.

---

## Priority Order for Implementation

1. **Fork repo, rename package, update identity** (Phase 1) — Get it building under the new name first
2. **Remove dev fees and MoneroOcean fork** (Phase 3.3, 3.4) — Clean the codebase
3. **Configure AlphaBlock pool as default** (Phase 3.1, 3.2) — Core functionality
4. **Branding: colors, icons, text** (Phase 2) — Visual identity
5. **Replace API integration** (Phase 4) — Pool stats from AlphaBlock API
6. **Simplify UI** (Phase 5) — Streamline for AlphaBlock-only use
7. **Mobile optimizations** (Phase 6) — Battery controls, background mining
8. **Build, sign, distribute** (Phase 7, 8) — Ship it
9. **In-app update checker** (Phase 8.3) — For future updates

---

## Testing Checklist

- [ ] App installs on Android 10+ device
- [ ] Wallet address validation works (Monero addresses: starts with `4` or `8`, correct length)
- [ ] Mining starts and connects to `alphablockmonero.xyz:5555`
- [ ] Hashrate displays and updates in real-time
- [ ] Pool stats load from `api.alphablockmonero.xyz`
- [ ] Miner personal stats load correctly
- [ ] Mining continues in background with notification
- [ ] Stop button works cleanly
- [ ] Thread count slider works
- [ ] No dev fee mining detected (monitor pool for unexpected wallet addresses)
- [ ] App branding is consistent (colors, fonts, icons, text)
- [ ] APK size is reasonable (< 50MB)
- [ ] No crashes on various Android devices (test arm64 and arm32)