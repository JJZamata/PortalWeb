declare module 'mapbox-gl' {
  interface MapboxOptions {
    container: HTMLElement | string;
    style: string;
    center?: [number, number];
    zoom?: number;
    [key: string]: any;
  }
}