import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ChangeDetectorRef,
  ViewChild
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { UploadedFile } from './file-uploader.types';
import { Button } from '../button/button';

@Component({
  selector: 'app-file-uploader',
  standalone: true,
  imports: [CommonModule, Button],
  templateUrl: './file-uploader.html',
  styleUrl: './file-uploader.css'
})
export class FileUploader {

  // ===== Inputs =====
  @Input() title: string = 'Anexo';
  @Input() maxSize: number = 16;
  @Input() accept: string = 'image/*';
  @Input() required: boolean = false;
  @Input() editable: boolean = false;
  @Input() isThumb: boolean = false;
  @Input() uploadedFile: UploadedFile | null = null;

  // ===== Outputs =====
  @Output() fileSelected = new EventEmitter<File>();
  @Output() fileDeleted = new EventEmitter<string>();

  // ===== Referência ao input nativo =====
  @ViewChild('fileInput') fileInput?: ElementRef<HTMLInputElement>;

  // ===== Estado interno =====
  selectedFile: File | null = null;
  previewUrl: string | null = null;
  isModalDeleteOpen = false;

  constructor(private cdr: ChangeDetectorRef) {}

  // ===== Escolher arquivo =====
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];

    if (this.maxSize && file.size > this.maxSize * 1024 * 1024) {
      alert(`Arquivo maior que ${this.maxSize}MB.`);
      input.value = '';
      return;
    }

    this.revokePreview();
    this.selectedFile = file;
    this.previewUrl = URL.createObjectURL(file);
    this.fileSelected.emit(file);
    this.cdr.detectChanges();
  }

  // ===== Deleção =====
  openDeleteModal(): void {
    this.isModalDeleteOpen = true;
  }

  closeDeleteModal(): void {
    this.isModalDeleteOpen = false;
  }

  confirmDelete(): void {
    // Guarda o id antes de limpar o estado, pois resetUploader() zera uploadedFile.
    const uploadedId = this.uploadedFile?.id;

    // Sempre limpa a seleção local (selectedFile / preview / input nativo).
    this.resetUploader();

    // Só avisa o pai se havia um arquivo já enviado.
    if (uploadedId) {
      this.fileDeleted.emit(uploadedId);
    }
  }

  resetUploader(): void {
    this.revokePreview();
    this.selectedFile = null;
    this.previewUrl = null;
    this.uploadedFile = null;
    this.isModalDeleteOpen = false;

    // Permite selecionar o mesmo arquivo novamente (o change não dispara se o value não mudar).
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }

    this.cdr.detectChanges();
  }

  private revokePreview(): void {
    if (this.previewUrl) {
      URL.revokeObjectURL(this.previewUrl);
      this.previewUrl = null;
    }
  }

  // ===== Helpers para o template =====
  get extension(): string {
    const source = this.selectedFile?.name ?? this.uploadedFile?.name ?? '';
    return source.split('.').pop()?.toLowerCase() ?? '';
  }

  get isImage(): boolean {
    return ['svg', 'jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp'].includes(this.extension);
  }

  get fileKind(): 'image' | 'video' | 'pdf' | 'file' | 'certificado' | 'AI' | 'CDR' | 'notFound' | 'unknown' {
    if (this.uploadedFile?.missing) return 'notFound';

    const map: Record<string, any> = {
      svg: 'image', jpg: 'image', jpeg: 'image', png: 'image', gif: 'image', webp: 'image', bmp: 'image',
      pdf: 'pdf',
      mp4: 'video', mov: 'video', avi: 'video', webm: 'video',
      ai: 'AI', cdr: 'CDR',
      doc: 'file', docx: 'file', xml: 'file', csv: 'file', txt: 'file', xls: 'file', xlsx: 'file',
      pfx: 'certificado', p12: 'certificado'
    };

    return map[this.extension] ?? 'unknown';
  }

  formatBytes(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  get humanSize(): string {
    if (this.selectedFile) return this.formatBytes(this.selectedFile.size);
    if (this.uploadedFile) return this.formatBytes(this.uploadedFile.size);
    return '';
  }

  get fileName(): string {
    return this.selectedFile?.name ?? this.uploadedFile?.name ?? '';
  }

  // ===== Botões de ação =====
  openInNewTab(): void {
    const url = this.uploadedFile?.url ?? this.previewUrl;
    if (url) window.open(url, '_blank');
  }

  openPreview(): void {
    this.openInNewTab();
  }

  download(): void {
    const url = this.uploadedFile?.url ?? this.previewUrl;
    if (!url) return;
    const a = document.createElement('a');
    a.href = url;
    a.download = this.fileName;
    a.click();
  }
}