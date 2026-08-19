import type { ReactElement } from 'react'
import { useEffect, useMemo, useRef, useState } from 'react'

import * as maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'

import { useTranslation } from 'react-i18next'

import type { TStatusLevel } from '@/shared/types/common.types'
import { getStatusColor } from '@/shared/utils/getStatusColor'
import { formatCurrency } from '@/shared/utils/formatCurrency'
import { formatDate } from '@/shared/utils/formatDate'

import { useAppSelector } from '@/app/hooks'

import type { IProjectInfo } from '@/features/overview/types/overview.types'
import type { IApiResponse } from '@/shared/types/api.types'

import overviewMockRaw from '@/mocks/overview.json'
import alignmentMockRaw from '@/mocks/gis/alignment.json'

type TMapRenderMode = 'fallback' | 'map'

type TAlignmentSpiStatus = TStatusLevel

interface IAlignmentFeatureProperties {
  segmentId: string
  kmFrom: number
  kmTo: number
  spi: number
  spiStatus: TAlignmentSpiStatus
}

type TAlignmentFeatureCollection = GeoJSON.FeatureCollection<
  GeoJSON.LineString,
  IAlignmentFeatureProperties
>

const MAP_DARK_STYLE_URL =
  // Voyager style có độ tương phản đường/label tốt hơn dark-matter cho UI TV.
  'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json'

const MAP_PADDING_PX = 24

const BACKGROUND_RASTER_SOURCE_ID = 'background-osm-raster'
const BACKGROUND_RASTER_LAYER_ID = 'background-osm-raster-layer'
const BACKGROUND_RASTER_TILE_URL_TEMPLATE = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
const BACKGROUND_RASTER_OPACITY = 0.78

const FALLBACK_STATIC_MAP_BASE_URL = 'https://staticmap.openstreetmap.de/staticmap.php'

const TERRAIN_DEM_SOURCE_ID = 'terrain-dem'
const TERRAIN_DEM_TILE_SIZE = 256
const TERRAIN_DEM_TILE_URL_TEMPLATE =
  'https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png'
const TERRAIN_EXAGGERATION = 1.7
const TERRAIN_HILLSHADE_LAYER_ID = 'terrain-hillshade'
const TERRAIN_PITCH_DEG = 52
const TERRAIN_BEARING_DEG = -25

export interface IProjectMapWidgetProps {
  /**
   * Kiosk mode = TV mode: tắt pan/zoom để tránh thao tác.
   * Nếu không truyền prop, component sẽ ưu tiên đọc từ `kioskSlice.isKioskMode`.
   */
  isKiosk?: boolean
}

function isWebGLAvailable(): boolean {
  try {
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
    return gl !== null
  } catch {
    return false
  }
}

/**
 * Widget bản đồ tuyến (ProjectMapWidget) — MVP mock-first.
 *
 * - MapLibre: dark basemap + alignment segments colored theo SPI.
 * - Fallback: SVG polyline + markers nếu MapLibre/WebGL fail.
 * - Overlay: "Thông tin dự án" glass nhẹ đặt góc dưới-trái.
 */
export function ProjectMapWidget({ isKiosk }: IProjectMapWidgetProps): ReactElement {
  const { t } = useTranslation('overview')

  const kioskFromStore = useAppSelector((s) => s.kiosk.isKioskMode)
  const isKioskMode = typeof isKiosk === 'boolean' ? isKiosk : kioskFromStore

  const overviewMock = useMemo(() => overviewMockRaw as IApiResponse<{ projectInfo: IProjectInfo }>, [])
  const projectInfo = overviewMock.data.projectInfo

  const alignmentGeoJson = useMemo(
    () => alignmentMockRaw as TAlignmentFeatureCollection,
    [],
  )

  const alignmentGeoBbox = useMemo(() => {
    let minLon = Number.POSITIVE_INFINITY
    let maxLon = Number.NEGATIVE_INFINITY
    let minLat = Number.POSITIVE_INFINITY
    let maxLat = Number.NEGATIVE_INFINITY

    for (const feature of alignmentGeoJson.features) {
      const coords = feature.geometry.coordinates
      for (const pos of coords) {
        const lon = pos[0]
        const lat = pos[1]
        minLon = Math.min(minLon, lon)
        maxLon = Math.max(maxLon, lon)
        minLat = Math.min(minLat, lat)
        maxLat = Math.max(maxLat, lat)
      }
    }

    if (!Number.isFinite(minLon) || !Number.isFinite(maxLon)) {
      return { minLon: 0, maxLon: 1, minLat: 0, maxLat: 1 }
    }

    return { minLon, maxLon, minLat, maxLat }
  }, [alignmentGeoJson])

  const svgTransform = useMemo(() => {
    const width = 1000
    const height = 560

    const lonSpan = Math.max(1e-9, alignmentGeoBbox.maxLon - alignmentGeoBbox.minLon)
    const latSpan = Math.max(1e-9, alignmentGeoBbox.maxLat - alignmentGeoBbox.minLat)

    const toSvg = (lon: number, lat: number): { x: number; y: number } => {
      const x = ((lon - alignmentGeoBbox.minLon) / lonSpan) * width
      // SVG y tăng xuống dưới, nên đảo trục lat
      const y = (1 - (lat - alignmentGeoBbox.minLat) / latSpan) * height
      return { x, y }
    }

    return { width, height, toSvg }
  }, [alignmentGeoBbox])

  const [mapRenderMode, setMapRenderMode] = useState<TMapRenderMode>('fallback')
  const mapContainerRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<maplibregl.Map | null>(null)

  useEffect(() => {
    const el = mapContainerRef.current
    if (!el) return

    let isAlive = true

    // Cleanup map cũ nếu kiosk mode thay đổi.
    if (mapRef.current) {
      try {
        mapRef.current.remove()
      } catch {
        // ignore cleanup errors
      } finally {
        mapRef.current = null
      }
    }

    try {
      if (!isWebGLAvailable()) {
        setMapRenderMode('fallback')
        return
      }

      let didSetMapMode = false

      const { minLon, maxLon, minLat, maxLat } = alignmentGeoBbox
      const centerLon = (minLon + maxLon) / 2
      const centerLat = (minLat + maxLat) / 2

      const map = new maplibregl.Map({
        container: el,
        style: MAP_DARK_STYLE_URL,
        center: [centerLon, centerLat],
        zoom: 7,
        pitch: TERRAIN_PITCH_DEG,
        bearing: TERRAIN_BEARING_DEG,
        attributionControl: false,
        logoPosition: 'bottom-right',
        interactive: !isKioskMode,
        dragPan: !isKioskMode,
        scrollZoom: !isKioskMode,
        boxZoom: !isKioskMode,
        dragRotate: !isKioskMode,
        keyboard: !isKioskMode,
        doubleClickZoom: !isKioskMode,
      })

      mapRef.current = map

      map.on('error', () => {
        if (!isAlive) return
        // Không ép fallback nếu map đã kịp render xong (tile/DEM có thể lỗi lẻ tẻ vẫn chấp nhận hiển thị nền).
        if (!didSetMapMode) setMapRenderMode('fallback')
      })

      map.on('load', () => {
        if (!isAlive) return

        try {
          // Nhúng bản đồ nền (OSM tiles) để nhìn "có địa hình/đường đi" phía dưới alignment.
          // Route/marker được thêm sau đó nên sẽ luôn nằm ở lớp phía trên.
          try {
            map.addSource(BACKGROUND_RASTER_SOURCE_ID, {
              type: 'raster',
              tiles: [BACKGROUND_RASTER_TILE_URL_TEMPLATE],
              tileSize: 256,
            })

            map.addLayer({
              id: BACKGROUND_RASTER_LAYER_ID,
              type: 'raster',
              source: BACKGROUND_RASTER_SOURCE_ID,
              paint: {
                'raster-opacity': BACKGROUND_RASTER_OPACITY,
              },
            })
          } catch {
            // ignore background errors (vẫn render được alignment)
          }

          // Terrain 3D miễn phí từ DEM (Terrarium) + hillshade để nhìn rõ ở pitch.
          // Nếu DEM/terrain bị lỗi, vẫn render được alignment (2D) để widget không chết.
          try {
            map.addSource(TERRAIN_DEM_SOURCE_ID, {
              type: 'raster-dem',
              tiles: [TERRAIN_DEM_TILE_URL_TEMPLATE],
              tileSize: TERRAIN_DEM_TILE_SIZE,
              encoding: 'terrarium',
            })

            map.setTerrain({
              source: TERRAIN_DEM_SOURCE_ID,
              exaggeration: TERRAIN_EXAGGERATION,
            })

            map.addLayer({
              id: TERRAIN_HILLSHADE_LAYER_ID,
              type: 'hillshade',
              source: TERRAIN_DEM_SOURCE_ID,
              paint: {
                'hillshade-exaggeration': 1,
                // Giảm độ đậm để bản đồ nền (roads/labels) vẫn nhìn thấy phía dưới.
                'hillshade-shadow-color': 'rgba(0,0,0,0.35)',
                'hillshade-highlight-color': 'rgba(255,255,255,0.10)',
                'hillshade-accent-color': 'rgba(255,255,255,0.08)',
              },
            })
          } catch {
            // ignore terrain errors, still try to render alignment
          }

          map.addSource('alignment-route', {
            type: 'geojson',
            data: alignmentGeoJson,
          })

          map.addLayer({
            id: 'alignment-route-line',
            type: 'line',
            source: 'alignment-route',
            layout: {
              'line-cap': 'round',
              'line-join': 'round',
            },
            paint: {
              'line-color': 'rgba(255,255,255,0.40)',
              'line-width': 6,
              'line-opacity': 0.85,
            },
          })

          const statuses: TStatusLevel[] = ['good', 'normal', 'warning', 'danger', 'critical']
          const statusColors: Record<TStatusLevel, ReturnType<typeof getStatusColor>> =
            statuses.reduce((acc, status) => {
              acc[status] = getStatusColor(status)
              return acc
            }, {} as Record<TStatusLevel, ReturnType<typeof getStatusColor>>)

          for (const status of statuses) {
            const statusFeatures = alignmentGeoJson.features.filter(
              (f) => f.properties.spiStatus === status,
            )

            if (statusFeatures.length === 0) continue

            const statusCollection: TAlignmentFeatureCollection = {
              type: 'FeatureCollection',
              features: statusFeatures,
            }

            const sourceId = `alignment-${status}`

            map.addSource(sourceId, {
              type: 'geojson',
              data: statusCollection,
            })

            map.addLayer({
              id: `alignment-${status}-line`,
              type: 'line',
              source: sourceId,
              layout: {
                'line-cap': 'round',
                'line-join': 'round',
              },
              paint: {
                'line-width': 10,
                'line-opacity': 0.95,
                'line-color': statusColors[status].text,
              },
            })
          }

          map.fitBounds(
            [
              [minLon, minLat],
              [maxLon, maxLat],
            ],
            {
              padding: MAP_PADDING_PX,
              duration: 0,
              maxZoom: 13,
            },
          )

          // Đảm bảo camera giữ pitch để nhìn rõ địa hình 3D.
          try {
            map.jumpTo({ pitch: TERRAIN_PITCH_DEG, bearing: TERRAIN_BEARING_DEG })
          } catch {
            // ignore
          }

          if (isKioskMode) {
            // Thêm lần nữa để chắc chắn disable pan/zoom ở mọi phiên bản.
            try {
              map.dragPan.disable()
              map.scrollZoom.disable()
              map.boxZoom.disable()
              map.dragRotate.disable()
              map.keyboard.disable()
              map.doubleClickZoom.disable()
              map.touchZoomRotate.disableRotation()
            } catch {
              // ignore - một số methods có thể không tồn tại tuỳ build
            }
          }

          didSetMapMode = true
          setMapRenderMode('map')
        } catch {
          // Nếu add layer fail (style/source), vẫn đảm bảo demo bằng fallback.
          if (!isAlive) return
          setMapRenderMode('fallback')
        }
      })
    } catch {
      setMapRenderMode('fallback')
    }

    return () => {
      isAlive = false
      if (mapRef.current) {
        try {
          mapRef.current.remove()
        } catch {
          // ignore
        } finally {
          mapRef.current = null
        }
      }
    }
  }, [alignmentGeoBbox, alignmentGeoJson, isKioskMode])

  const svgAlignment = useMemo(() => {
    const { width, height, toSvg } = svgTransform

    if (alignmentGeoJson.features.length === 0) {
      return { width, height, basePolylines: [], markerPoints: [] }
    }

    const basePolylines = alignmentGeoJson.features.map((feature) => {
      const points = feature.geometry.coordinates.map((pos) => {
        const x = toSvg(pos[0], pos[1]).x
        const y = toSvg(pos[0], pos[1]).y
        return `${x},${y}`
      })

      const firstPos = feature.geometry.coordinates[0]
      const lastPos = feature.geometry.coordinates[feature.geometry.coordinates.length - 1]

      return {
        segmentId: feature.properties.segmentId,
        spiStatus: feature.properties.spiStatus,
        points: points.join(' '),
        start: toSvg(firstPos[0], firstPos[1]),
        end: toSvg(lastPos[0], lastPos[1]),
      }
    })

    const markerPoints = basePolylines.flatMap((poly) => [
      {
        key: `${poly.segmentId}-start`,
        x: poly.start.x,
        y: poly.start.y,
        status: poly.spiStatus,
      },
      {
        key: `${poly.segmentId}-end`,
        x: poly.end.x,
        y: poly.end.y,
        status: poly.spiStatus,
      },
    ])

    return { width, height, basePolylines, markerPoints }
  }, [alignmentGeoJson, svgTransform])

  const overlayStats = useMemo(() => {
    const lengthText = `${projectInfo.length.toFixed(1).replace('.', ',')} km`
    const lanesText = `${projectInfo.lanes} làn xe`
    const investmentText = `${formatCurrency(projectInfo.totalInvestment, 'billion')} đ`
    const startText = formatDate(projectInfo.startDate)
    const endText = formatDate(projectInfo.plannedEndDate)
    const progressText = `${projectInfo.progressPercent.toFixed(1).replace('.', ',')}%`
    const remainingText = `D−${projectInfo.daysRemaining}`

    return {
      lengthText,
      lanesText,
      investmentText,
      startText,
      endText,
      progressText,
      remainingText,
      ownerText: projectInfo.owner,
      fundingSourceText: projectInfo.fundingSource,
    }
  }, [projectInfo])

  const progressPercent = Math.max(0, Math.min(100, projectInfo.progressPercent))

  const fallbackStaticMapUrl = useMemo(() => {
    const { minLon, maxLon, minLat, maxLat } = alignmentGeoBbox
    const width = svgAlignment.width
    const height = svgAlignment.height

    const params = new URLSearchParams({
      bbox: `${minLon},${minLat},${maxLon},${maxLat}`,
      size: `${width}x${height}`,
      scale: '1',
      maptype: 'mapnik',
      format: 'png',
    })

    return `${FALLBACK_STATIC_MAP_BASE_URL}?${params.toString()}`
  }, [alignmentGeoBbox, svgAlignment.height, svgAlignment.width])

  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* Map container */}
      <div
        ref={mapContainerRef}
        className="absolute inset-0"
      />

      {/* Fallback */}
      {mapRenderMode !== 'map' ? (
        <>
          <img
            src={fallbackStaticMapUrl}
            alt=""
            className="absolute inset-0 h-full w-full object-fill opacity-60 pointer-events-none"
            draggable={false}
          />
          <svg
            className="absolute inset-0 h-full w-full"
            viewBox={`0 0 ${svgAlignment.width} ${svgAlignment.height}`}
            preserveAspectRatio="none"
            role="img"
            aria-label="Alignment mock (fallback)"
          >
            <defs>
              <filter id="route-glow">
                <feGaussianBlur stdDeviation="2.2" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Route base */}
            {svgAlignment.basePolylines.map((poly) => (
              <polyline
                key={`${poly.segmentId}-base`}
                points={poly.points}
                fill="none"
                stroke="rgba(255,255,255,0.35)"
                strokeWidth={6}
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity={0.9}
              />
            ))}

            {/* Progress segments */}
            {svgAlignment.basePolylines.map((poly) => {
              const statusColor = getStatusColor(poly.spiStatus)
              return (
                <polyline
                  key={`${poly.segmentId}-progress`}
                  points={poly.points}
                  fill="none"
                  stroke={statusColor.text}
                  strokeWidth={10}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity={0.95}
                  filter="url(#route-glow)"
                />
              )
            })}

            {/* Markers */}
            {svgAlignment.markerPoints.map((m) => {
              const statusColor = getStatusColor(m.status)
              return (
                <g key={m.key}>
                  <circle
                    cx={m.x}
                    cy={m.y}
                    r={8}
                    fill={statusColor.text}
                    opacity={0.18}
                  />
                  <circle cx={m.x} cy={m.y} r={5} fill={statusColor.text} opacity={0.9} />
                  <circle
                    cx={m.x}
                    cy={m.y}
                    r={6.5}
                    fill="none"
                    stroke={statusColor.border}
                    strokeWidth={2}
                    opacity={0.9}
                  />
                </g>
              )
            })}
          </svg>
        </>
      ) : null}

      {/* Overlay: Thông tin dự án */}
      <div className="absolute left-4 bottom-4 z-10 w-[30%] min-w-[260px] max-w-[360px] rounded-2xl border border-white/[0.12] bg-white/[0.05] p-4 shadow-glass">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="text-caption text-[var(--text-secondary)]">
              {t('projectInfo.title', 'Thông tin dự án')}
            </div>
            <div className="truncate text-body-lg font-semibold text-[var(--text-primary)]">
              {projectInfo.name}
            </div>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-caption">
          <div className="text-[var(--text-secondary)]">{t('projectInfo.totalLength', 'Tổng chiều dài')}</div>
          <div className="justify-self-end tabular-nums text-[var(--text-primary)]">{overlayStats.lengthText}</div>

          <div className="text-[var(--text-secondary)]">Quy mô</div>
          <div className="justify-self-end tabular-nums text-[var(--text-primary)]">{overlayStats.lanesText}</div>

          <div className="text-[var(--text-secondary)]">{t('projectInfo.totalBudget', 'Tổng mức đầu tư')}</div>
          <div className="justify-self-end tabular-nums text-[var(--text-primary)]">{overlayStats.investmentText}</div>

          <div className="text-[var(--text-secondary)]">Nguồn vốn</div>
          <div className="col-span-2 truncate justify-self-start text-[var(--text-primary)]">
            {overlayStats.fundingSourceText}
          </div>

          <div className="text-[var(--text-secondary)]">{t('projectInfo.startDate', 'Ngày khởi công')}</div>
          <div className="justify-self-end tabular-nums text-[var(--text-primary)]">{overlayStats.startText}</div>

          <div className="text-[var(--text-secondary)]">{t('projectInfo.endDate', 'Ngày hoàn thành')}</div>
          <div className="justify-self-end tabular-nums text-[var(--text-primary)]">{overlayStats.endText}</div>

          <div className="text-[var(--text-secondary)]">{t('projectInfo.owner', 'Chủ đầu tư')}</div>
          <div className="col-span-2 truncate justify-self-start text-[var(--text-primary)]">
            {overlayStats.ownerText}
          </div>
        </div>

        <div className="mt-3">
          <div className="flex items-center justify-between text-caption">
            <span className="text-[var(--text-secondary)]">Tiến độ</span>
            <span className="tabular-nums text-[var(--text-primary)]">
              {overlayStats.progressText} · {overlayStats.remainingText}
            </span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/[0.10]">
            <div
              className="h-full bg-accent"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

