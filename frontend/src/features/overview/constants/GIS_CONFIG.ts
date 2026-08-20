/**
 * Cấu hình ArcGIS Web Scene (portal + scene id + auth).
 * Điền các trường tĩnh bên dưới. `VITE_ARCGIS_*` trong `.env` sẽ ghi đè nếu có giá trị.
 *
 * Scene id: ArcGIS Online → Content → Web Scene → copy Item ID (chuỗi 32 ký tự).
 * Auth (chọn 1):
 * 1. Scene public / shared với Everyone → chỉ cần portalUrl + sceneId.
 * 2. OAuth (khuyến nghị): tạo Application trên portal, điền clientId.
 * 3. Username/password: chỉ dùng local debug — mật khẩu trên frontend không phải production.
 */
export interface IGisSceneConfig {
  /** Ví dụ: https://onecadvietnam.maps.arcgis.com */
  portalUrl: string;
  /** Item ID của Web Scene */
  sceneId: string;
  /** OAuth Client ID (Application trên portal). Để trống nếu dùng user/pass hoặc scene public. */
  clientId: string;
  /** Tài khoản portal — chỉ debug local */
  username: string;
  /** Mật khẩu portal — chỉ debug local */
  password: string;
}

export const GIS_SCENE_STATIC: IGisSceneConfig = {
  portalUrl: "https://onecadvietnam.maps.arcgis.com",
  sceneId: "",
  clientId: "",
  username: "",
  password: "",
};

function readEnvOverride(key: string): string {
  const value = import.meta.env[key];
  return typeof value === "string" ? value.trim() : "";
}

function pickValue(envKey: string, staticValue: string): string {
  const fromEnv = readEnvOverride(envKey);
  return fromEnv.length > 0 ? fromEnv : staticValue.trim();
}

/**
 * Config runtime: env ghi đè file tĩnh.
 */
export function getGisSceneConfig(): IGisSceneConfig {
  return {
    portalUrl: pickValue(
      "VITE_ARCGIS_PORTAL_URL",
      GIS_SCENE_STATIC.portalUrl,
    ).replace(/\/$/, ""),
    sceneId: pickValue("VITE_ARCGIS_SCENE_ID", GIS_SCENE_STATIC.sceneId),
    clientId: pickValue("VITE_ARCGIS_CLIENT_ID", GIS_SCENE_STATIC.clientId),
    username: pickValue("VITE_ARCGIS_USERNAME", GIS_SCENE_STATIC.username),
    password: pickValue("VITE_ARCGIS_PASSWORD", GIS_SCENE_STATIC.password),
  };
}

/**
 * Đủ portal + scene id thì widget chuyển sang ArcGIS SceneView.
 */
export function isGisSceneConfigured(
  config: IGisSceneConfig = getGisSceneConfig(),
): boolean {
  return config.portalUrl.length > 0 && config.sceneId.length > 0;
}
