export const VIDEO_MAX_SECONDS = 30;
export const VIDEO_MAX_BYTES = 20 * 1024 * 1024;

export type VideoClip = {
  uri: string;
  name: string;
  seconds: number | null;
  bytes: number | null;
};

export function toSeconds(duration: number | null | undefined, fromMilliseconds: boolean): number | null {
  if (duration == null || !Number.isFinite(duration) || duration <= 0) return null;
  const seconds = fromMilliseconds ? duration / 1000 : duration;
  return seconds > 0 ? seconds : null;
}

export function formatBytes(bytes: number): string {
  const mb = bytes / (1024 * 1024);
  if (mb >= 1) return `${mb.toFixed(1).replace('.', ',')} MB`;
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

export function formatSeconds(seconds: number): string {
  return `${Math.round(seconds)} s`;
}

export async function readBytes(uri: string): Promise<number | null> {
  try {
    const response = await fetch(uri);
    const blob = await response.blob();
    return blob.size > 0 ? blob.size : null;
  } catch {
    return null;
  }
}

type WebVideo = {
  preload: string;
  duration: number;
  currentTime: number;
  src: string;
  onloadedmetadata: (() => void) | null;
  onerror: (() => void) | null;
  onseeked: (() => void) | null;
  load: () => void;
  removeAttribute: (name: string) => void;
};

export function readWebDuration(uri: string): Promise<number | null> {
  const document = (globalThis as { document?: { createElement: (tag: string) => WebVideo } }).document;
  if (!document) return Promise.resolve(null);
  return new Promise((resolve) => {
    const video = document.createElement('video');
    let settled = false;
    const done = (value: number | null) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      video.onloadedmetadata = null;
      video.onerror = null;
      video.onseeked = null;
      video.removeAttribute('src');
      video.load();
      resolve(value);
    };
    const timer = setTimeout(() => done(null), 2500);
    const accept = (value: number) => {
      if (Number.isFinite(value) && value > 0) done(value);
    };
    video.preload = 'metadata';
    video.onloadedmetadata = () => {
      if (Number.isFinite(video.duration) && video.duration > 0) {
        done(video.duration);
        return;
      }
      video.onseeked = () => accept(video.duration);
      try {
        video.currentTime = 1e101;
      } catch {
        done(null);
      }
    };
    video.onerror = () => done(null);
    video.src = uri;
  });
}
