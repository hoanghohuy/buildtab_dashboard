import esriConfig from '@arcgis/core/config.js';
import WebScene from '@arcgis/core/WebScene.js';
import SceneView from '@arcgis/core/views/SceneView.js';
import identityManager from '@arcgis/core/identity/IdentityManager.js';
import OAuthInfo from '@arcgis/core/identity/OAuthInfo.js';
import ServerInfo from '@arcgis/core/identity/ServerInfo.js';

import type { IGisSceneConfig } from '@/features/overview/constants/GIS_CONFIG';

import '@arcgis/core/assets/esri/themes/dark/main.css';

const ARCGIS_ASSETS_CDN = 'https://js.arcgis.com/5.1/@arcgis/core/assets';

let didConfigureAssets = false;

function ensureEsriAssets(): void {
  if (didConfigureAssets) return;
  esriConfig.assetsPath = ARCGIS_ASSETS_CDN;
  didConfigureAssets = true;
}

function portalSharingUrl(portalUrl: string): string {
  return `${portalUrl}/sharing`;
}

function portalRestUrl(portalUrl: string): string {
  return `${portalUrl}/sharing/rest`;
}

/**
 * Đăng nhập portal trước khi load Web Scene (OAuth, hoặc token user/pass).
 */
export async function authenticateArcGisPortal(config: IGisSceneConfig): Promise<void> {
  ensureEsriAssets();
  esriConfig.portalUrl = config.portalUrl;

  if (config.clientId.length > 0) {
    const oauthInfo = new OAuthInfo({
      appId: config.clientId,
      portalUrl: config.portalUrl,
      popup: true,
      flowType: 'auto',
    });
    identityManager.registerOAuthInfos([oauthInfo]);

    const sharingUrl = portalSharingUrl(config.portalUrl);
    try {
      await identityManager.checkSignInStatus(sharingUrl);
    } catch {
      await identityManager.getCredential(sharingUrl);
    }
    return;
  }

  if (config.username.length > 0 && config.password.length > 0) {
    const restUrl = portalRestUrl(config.portalUrl);
    const serverInfo = new ServerInfo({
      server: restUrl,
      tokenServiceUrl: `${restUrl}/generateToken`,
      hasPortal: true,
    });
    identityManager.registerServers([serverInfo]);

    const tokenInfo = await identityManager.generateToken(serverInfo, {
      username: config.username,
      password: config.password,
    });

    identityManager.registerToken({
      server: restUrl,
      token: tokenInfo.token,
      expires: tokenInfo.expires,
      ssl: tokenInfo.ssl ?? true,
      userId: config.username,
    });
  }
}

export interface ICreateArcGisSceneViewOptions {
  interactive: boolean;
}

/**
 * Tạo SceneView load Web Scene từ portal item id.
 */
export async function createArcGisSceneView(
  container: HTMLDivElement,
  config: IGisSceneConfig,
  options: ICreateArcGisSceneViewOptions,
): Promise<SceneView> {
  await authenticateArcGisPortal(config);

  const webScene = new WebScene({
    portalItem: {
      id: config.sceneId,
      portal: {
        url: config.portalUrl,
      },
    },
  });

  const view = new SceneView({
    container,
    map: webScene,
    popupEnabled: false,
    qualityProfile: 'medium',
  });

  // TV kiosk có thể khóa kéo/zoom; debug / họp giao ban thì để tương tác.
  if (!options.interactive) {
    const stop = (event: { stopPropagation: () => void }): void => {
      event.stopPropagation();
    };
    view.on('mouse-wheel', stop);
    view.on('double-click', stop);
    view.on('drag', stop);
    view.on('key-down', stop);
  }

  await view.when();
  return view;
}

/**
 * Hủy SceneView khi unmount widget.
 */
export function destroyArcGisSceneView(view: SceneView | null): void {
  if (!view) return;
  try {
    view.destroy();
  } catch {
    // ignore
  }
}
