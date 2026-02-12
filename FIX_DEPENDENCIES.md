# Fix: npm install dependency conflict

## Quick Fix

Run this command instead of `npm install`:

```bash
npm install --legacy-peer-deps
```

## Why?

The error occurs because:
- Your project uses `react-native@0.68.0`
- `@brightlayer-ui/react-native-progress-icons@1.0.2` expects `react-native@^0.63.0`
- npm's strict peer dependency checking blocks the install

## Solution

Using `--legacy-peer-deps` tells npm to use the old (more lenient) peer dependency resolution. The Battery component from that package works fine with React Native 0.68, so this is safe.

## Alternative: Update package.json

You can also add this to your `package.json` to make it permanent:

```json
{
  "overrides": {
    "@brightlayer-ui/react-native-progress-icons": {
      "react-native": "^0.68.0"
    }
  }
}
```

Or use `.npmrc` file in the project root:

```
legacy-peer-deps=true
```

## After fixing

Once dependencies are installed, continue with the build:

```bash
cd android
.\gradlew.bat assembleDebug
```
