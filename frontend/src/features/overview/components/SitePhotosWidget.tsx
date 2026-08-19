import type { ReactElement } from 'react';

import { useEffect, useMemo, useState } from 'react';

import { formatDate, formatRelativeTime } from '@/shared/utils/formatDate';

import type { ISitePhoto } from '@/features/overview/types/overview.types';

export interface ISitePhotosWidgetProps {
  sitePhotos: ISitePhoto[];
}

function isPhotoLive(photo: ISitePhoto): boolean {
  if (photo.isLive) return true;

  const capturedAt = new Date(photo.capturedAt).getTime();
  if (Number.isNaN(capturedAt)) return false;

  const ageMs = Date.now() - capturedAt;
  const twoHoursMs = 2 * 60 * 60 * 1000;
  return ageMs >= 0 && ageMs <= twoHoursMs;
}

function getPhotoBadgeText(photo: ISitePhoto): string {
  if (isPhotoLive(photo)) return 'LIVE';
  return formatRelativeTime(photo.capturedAt);
}

function truncateText(value: string, maxLen: number): string {
  if (value.length <= maxLen) return value;
  return `${value.slice(0, maxLen)}…`;
}

/**
 * Widget W1.7 — Ảnh công trường (mosaic carousel mock).
 */
export function SitePhotosWidget({ sitePhotos }: ISitePhotosWidgetProps): ReactElement {
  const photos = sitePhotos.slice(0, 6);
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const photoCount = photos.length;

  useEffect(() => {
    if (photoCount <= 1) return;

    if (typeof window === 'undefined') return;
    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
    if (reduceMotion) return;

    const id = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % photoCount);
    }, 8000);

    return () => window.clearInterval(id);
  }, [photoCount]);

  const activePhoto = photoCount > 0 ? photos[activeIndex] ?? photos[0] : null;

  const thumbIndices = useMemo(() => {
    if (photoCount === 0) return [];
    const indices: number[] = [];
    for (let i = 1; i <= 4; i += 1) {
      indices.push((activeIndex + i) % photoCount);
    }
    return indices;
  }, [activeIndex, photoCount]);

  if (!activePhoto) {
    return (
      <div className="flex h-full items-center justify-center text-body-md text-[var(--text-tertiary)]">
        Chưa có ảnh.
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 w-full gap-3 overflow-hidden">
      <div className="relative flex-[0.6] min-w-0 overflow-hidden rounded-lg">
        <img
          src={activePhoto.thumbnailUrl}
          alt={activePhoto.location}
          className="h-full w-full object-cover"
          draggable={false}
        />

        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/70 to-transparent" />

        <div className="absolute right-2 top-2">
          <div className="rounded-full bg-black/55 px-3 py-1 text-caption text-white/95">{getPhotoBadgeText(activePhoto)}</div>
        </div>

        <div className="absolute inset-x-0 bottom-0 p-3">
          <div className="min-w-0 overflow-hidden">
            <div className="truncate text-body-md font-semibold text-white/95">
              {activePhoto.packageCode} · {truncateText(activePhoto.location, 30)}
            </div>
            <div className="mt-1 truncate text-caption text-white/70">
              {formatDate(activePhoto.capturedAt)}
            </div>
          </div>
        </div>
      </div>

      <div className="flex-[0.4] min-w-0 overflow-hidden">
        <div className="grid h-full grid-cols-2 gap-2">
          {thumbIndices.map((idx) => {
            const photo = photos[idx];
            const selected = idx === activeIndex;
            return (
              <button
                key={photo.id}
                type="button"
                className={[
                  'relative overflow-hidden rounded-lg border transition-colors',
                  selected ? 'border-[#22D3EE]/70' : 'border-white/10',
                ].join(' ')}
                onClick={() => setActiveIndex(idx)}
                aria-label={`Chọn ảnh: ${photo.location}`}
              >
                <img src={photo.thumbnailUrl} alt={photo.location} className="h-full w-full object-cover" draggable={false} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent opacity-0 transition-opacity hover:opacity-100" />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

