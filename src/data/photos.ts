import raw from './photos.json';

export type PhotoCollection = 'qingdao' | 'painting' | 'mine';

export interface Photo {
    id: string;
    collection: PhotoCollection;
    title: string;
    subtitle: string;
    alt: string;
    src: string;
    thumb: string;
    width: number;
    height: number;
    credit: string;
    license: string;
    licenseUrl: string;
    source: string;
}

export const photos = raw as Photo[];

/** public/ 下的资源要拼上部署 base，GitHub Pages 子路径才不会 404 */
export const photoAsset = (path: string) => `${import.meta.env.BASE_URL}${path}`;
