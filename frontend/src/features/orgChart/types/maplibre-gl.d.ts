import 'maplibre-gl';

declare module 'maplibre-gl' {
  interface MapOptions {
    /**
     * Một số build/tài liệu MapLibre dùng `preserveDrawingBuffer` để tránh mất nội dung buffer khi render.
     * Type definition hiện tại trong project có thể chưa khai báo.
     */
    preserveDrawingBuffer?: boolean;
  }
}

