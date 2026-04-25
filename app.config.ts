import "./scripts/load-env.js";
import type { ExpoConfig } from "expo/config";

const rawBundleId = "space.manus.modelo.app.t20260422204201";
const bundleId =
  rawBundleId
    .replace(/[-_]/g, ".")
    .replace(/[^a-zA-Z0-9.]/g, "")
    .replace(/\.+/g, ".")
    .replace(/^\.+|\.+$/g, "")
    .toLowerCase()
    .split(".")
    .map((segment) => {
      return /^[a-zA-Z]/.test(segment) ? segment : "x" + segment;
    })
    .join(".") || "space.manus.app";

const timestamp = bundleId.split(".").pop()?.replace(/^t/, "") ?? "";
const schemeFromBundleId = `manus${timestamp}`;

const config: ExpoConfig = {
  name: "CafeHot",
  slug: "cafehot",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  scheme: schemeFromBundleId,
  userInterfaceStyle: "light",
  newArchEnabled: true,
  extra: {
    eas: {
      projectId: "16635971-0720-4970-8062-52b8edd29e43"
    }
  },
  ios: {
    supportsTablet: true,
    bundleIdentifier: bundleId,
  },
  android: {
    adaptiveIcon: {
      backgroundColor: "#FFFFFF",
      foregroundImage: "./assets/images/android-icon-foreground.png",
    },
    package: bundleId,
    permissions: ["READ_EXTERNAL_STORAGE", "WRITE_EXTERNAL_STORAGE", "CAMERA"],
  },
  plugins: [
    "expo-router",
    [
      "expo-image-picker",
      {
        photosPermission: "La app necesita acceso a tus fotos para que puedas subirlas al perfil."
      }
    ],
    "expo-file-system",
    [
      "expo-build-properties",
      {
        android: {
          minSdkVersion: 24,
        },
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
    reactCompiler: true,
  },
};

export default config;
