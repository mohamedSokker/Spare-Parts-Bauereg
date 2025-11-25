export default {
  expo: {
    name: "BauerEg Spare Parts",
    slug: "Bauereg",
    version: "3.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      requireFullScreen: true,
      supportsTablet: true,
      bundleIdentifier: "com.mohamedsokker.BaueregMobile",
      googleServicesFile: process.env.appleConfig,
      infoPlist: {
        UIBackgroundModes: ["fetch", "remote-notification"],
      },
    },
    android: {
      versionCode: 3,
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      package: "com.mohamed_sokker.BaueregMobile",
      googleServicesFile: process.env.androidConfig,
    },
    plugins: [
      "expo-asset",
      "expo-font",
      "@react-native-firebase/app",
      [
        "expo-build-properties",
        {
          ios: {
            useFrameworks: "static",
          },
        },
      ],
      [
        "expo-screen-orientation",
        {
          initialOrientation: "DEFAULT",
        },
      ],
      [
        "expo-av",
        {
          microphonePermission:
            "Allow $(PRODUCT_NAME) to access your microphone.",
        },
      ],
    ],
    web: {
      favicon: "./assets/favicon.png",
    },
    extra: {
      eas: {
        projectId: "598948b7-26a0-4ebd-ad02-09af25649e03",
      },
    },
  },
};
