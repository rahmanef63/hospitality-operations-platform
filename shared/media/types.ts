export type MediaVariant = {
  src: string;
  width: number;
};

export type MediaAsset = {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption: string;
  variants?: readonly MediaVariant[];
};
