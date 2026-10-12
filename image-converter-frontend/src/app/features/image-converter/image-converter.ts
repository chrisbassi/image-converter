import { Component, viewChild, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ImageService } from '../../services/image';
import { FileUploader } from '../../shared/file-uploader/file-uploader';
import { Button } from '../../shared/button/button';
import { AppInput } from '../../shared/input/input';
import { DropdownComponent } from '../../shared/dropdown/dropdown';

@Component({
  selector: 'app-image-converter',
  standalone: true,
  imports: [CommonModule, FormsModule, FileUploader, Button, AppInput, DropdownComponent],
  templateUrl: './image-converter.html',
  styleUrl: './image-converter.css'
})
export class ImageConverter {
  private imageService = inject(ImageService);

  // Estado reativo (signals)
  selectedFile = signal<File | null>(null);
  convertedImageUrl = signal<string | null>(null);
  originalSize = signal(0);
  convertedSize = signal(0);
  isLoading = signal(false);
  errorMessage = signal('');

  // Campos do formulário (ngModel dispara a atualização por evento, pode ficar normal)
  selectedFormat = 'jpg';
  quality = 80;
  maxWidth: number | null = null;
  maxHeight: number | null = null;
  rotation = 0;

  readonly loadingDuration = 1200; // ms que a barra do botão leva pra encher

  btnConverter = viewChild.required<Button>('btnConverter');

  reductionPercentage = computed(() => {
    const original = this.originalSize();
    const converted = this.convertedSize();
    if (original === 0 || converted === 0) return 0;
    return Math.round((1 - converted / original) * 100);
  });

  onFileSelected(file: File): void {
    const allowedTypes = ['image/gif', 'image/jpeg', 'image/png', 'image/webp'];

    if (!allowedTypes.includes(file.type)) {
      this.errorMessage.set('Formato inválido. Use GIF, JPG, PNG ou WEBP.');
      this.selectedFile.set(null);
      return;
    }

    this.revokeCurrentUrl();
    this.selectedFile.set(file);
    this.originalSize.set(file.size);
    this.convertedSize.set(0);

    this.errorMessage.set(
      file.type === 'image/gif'
        ? '⚠️ Atenção: GIFs animados perdem a animação (apenas o primeiro frame é usado).'
        : ''
    );
  }

  convert(): void {
    const file = this.selectedFile();
    if (!file || this.isLoading()) return;

    this.isLoading.set(true);
    this.revokeCurrentUrl();
    this.convertedSize.set(0);
    this.errorMessage.set('');

    const startedAt = Date.now();
    this.btnConverter().startLoading();

    this.imageService.convertImage(file, {
      format: this.selectedFormat,
      quality: this.quality / 100,
      maxWidth: this.maxWidth ? Number(this.maxWidth) : undefined,
      maxHeight: this.maxHeight ? Number(this.maxHeight) : undefined,
      rotation: this.rotation ? Number(this.rotation) : undefined
    }).subscribe({
      next: (blob) => {
        const remaining = Math.max(0, this.loadingDuration - (Date.now() - startedAt));

        setTimeout(() => {
          this.convertedImageUrl.set(URL.createObjectURL(blob));
          this.convertedSize.set(blob.size);
          this.isLoading.set(false);
          this.btnConverter().stopLoading();
        }, remaining);
      },
      error: async (err) => {
        this.errorMessage.set('Erro ao converter a imagem. Tente novamente.');
        this.isLoading.set(false);
        this.btnConverter().stopLoading();

        if (err.error instanceof Blob) {
          const text = await err.error.text();
          console.error('🔴 Erro do backend:', text);
        }
      }
    });
  }

  formatBytes(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // Evita vazamento de memória com object URLs antigas
  private revokeCurrentUrl(): void {
    const url = this.convertedImageUrl();
    if (url) URL.revokeObjectURL(url);
    this.convertedImageUrl.set(null);
  }
}