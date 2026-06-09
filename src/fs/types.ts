export type FileType =
  | 'documento'
  | 'musica'
  | 'immagine'
  | 'codice'
  | 'video'
  | 'archivio'
  | 'cartella';

export interface FsNode {
  id: string;
  name: string;
  type: FileType;
  /** Unità astratte di dimensione. Per le cartelle si deriva dai figli. */
  size: number;
  /** Presente se e solo se type === 'cartella'. */
  children?: FsNode[];
}
