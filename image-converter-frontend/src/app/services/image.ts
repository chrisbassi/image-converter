import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ConvertOptions {
  format: string;
  quality: number;
  maxWidth?: number;
  maxHeight?: number;
  rotation?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  private apiUrl = 'http://localhost:8080/api/images/convert';

  constructor(private http: HttpClient) { }

convertImage(file: File, options: ConvertOptions): Observable<Blob> {
  return new Observable(observer => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);

      let targetWidth  = img.width;
      let targetHeight = img.height;

      const w = options.maxWidth  && options.maxWidth  > 0 ? Number(options.maxWidth)  : null;
      const h = options.maxHeight && options.maxHeight > 0 ? Number(options.maxHeight) : null;

      if (w && h) {
        // Ambos preenchidos → usa os dois exatos
        targetWidth  = w;
        targetHeight = h;
      } else if (w) {
        // Só largura → espelha pra altura também
        targetWidth  = w;
        targetHeight = w;
      } else if (h) {
        // Só altura → espelha pra largura também
        targetWidth  = h;
        targetHeight = h;
      }
      // Se nenhum dos dois → mantém original (img.width × img.height)

      // Rotação (inverte as dimensões do canvas em 90° / 270°)
      const rotation = options.rotation ?? 0;
      const rotated  = rotation === 90 || rotation === 270;
      const canvasW  = rotated ? targetHeight : targetWidth;
      const canvasH  = rotated ? targetWidth  : targetHeight;

      const canvas = document.createElement('canvas');
      canvas.width  = canvasW;
      canvas.height = canvasH;

      const ctx = canvas.getContext('2d')!;
      ctx.translate(canvasW / 2, canvasH / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.drawImage(img, -targetWidth / 2, -targetHeight / 2, targetWidth, targetHeight);

      canvas.toBlob(
        blob => {
          if (!blob) {
            observer.error(new Error('Falha ao gerar blob'));
            return;
          }
          observer.next(blob);
          observer.complete();
        },
        `image/${options.format}`,
        options.quality
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      observer.error(new Error('Falha ao carregar imagem'));
    };

    img.src = url;
  });
}
}