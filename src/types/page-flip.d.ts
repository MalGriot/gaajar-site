declare module "page-flip" {
  export type PageFlipSettings = Partial<{
    width: number;
    height: number;
    size: "fixed" | "stretch";
    minWidth: number;
    maxWidth: number;
    minHeight: number;
    maxHeight: number;
    maxShadowOpacity: number;
    showCover: boolean;
    usePortrait: boolean;
    mobileScrollSupport: boolean;
    drawShadow: boolean;
    flippingTime: number;
    useMouseEvents: boolean;
    swipeDistance: number;
    showPageCorners: boolean;
    disableFlipByClick: boolean;
  }>;

  export type FlipEventName = "flip" | "changeOrientation" | "changeState" | "init" | "update";

  export interface FlipEvent {
    data: unknown;
    object: PageFlip;
  }

  export class PageFlip {
    constructor(el: HTMLElement, settings: PageFlipSettings);
    loadFromImages(images: string[]): void;
    updateFromImages(images: string[]): void;
    loadFromHTML(items: NodeListOf<HTMLElement> | HTMLElement[]): void;
    turnToNextPage(): void;
    turnToPrevPage(): void;
    turnToPage(page: number): void;
    getPageCount(): number;
    getCurrentPageIndex(): number;
    getOrientation(): string;
    getFlipController(): { getState?: () => string } | undefined;
    getRender(): {
      clear?: () => void;
      ctx?: CanvasRenderingContext2D;
      canvas?: HTMLCanvasElement;
    } | undefined;
    on(event: FlipEventName, handler: (e: FlipEvent) => void): PageFlip;
    off(event: FlipEventName): void;
    destroy(): void;
  }
}
