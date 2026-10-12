import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button.html',
  styleUrl: './button.css'
})
export class Button implements OnChanges {
  @Input() label = '';
  @Input() icon: string | null = null;
  @Input() id: string | null = null;
  @Input() classes = '';
  @Input() size: string = 'fitContainer';
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() centered = false;
  @Input() position: 'relative' | 'absolute' | 'fixed' | 'sticky' | 'static' = 'relative';
  @Input() arrow = false;
  @Input() counter: number | null = null;
  @Input() color: string | null = null;
  @Input() fontColor: string | null = null;
  @Input() loading = false;
  /** Tempo (ms) que a barra leva pra ir de 0% a 100% quando loading = true */
  @Input() loadingDuration = 1200;

  @Output() clicked = new EventEmitter<MouseEvent>();

  // ===== Controle do ícone (fallback icons → logos → question_mark) =====
  iconSrc: string | null = null;
  private iconAttempt = 0;

  ngOnChanges(): void {
    if (this.icon) {
      this.iconAttempt = 0;
      this.iconSrc = `assets/icons/${this.icon}.svg`;
    } else {
      this.iconSrc = null;
    }
  }

  onIconError(): void {
    this.iconAttempt++;
    if (this.iconAttempt === 1) {
      this.iconSrc = `assets/logos/${this.icon}.svg`;
    } else if (this.iconAttempt === 2) {
      this.iconSrc = `assets/icons/question_mark.svg`;
    } else {
      this.iconSrc = null;
    }
  }

  // ===== Clique =====
  onClick(event: MouseEvent): void {
    if (this.loading || this.spinnerActive) return;   // 👈 adicionado
    this.clicked.emit(event);
  }

  // ===== Estilos dinâmicos =====
  get buttonStyles(): Record<string, string> {
    const styles: Record<string, string> = {};
    const size = this.size;

    if (size === '100%') {
      styles['width'] = '100%';
      styles['max-width'] = '100%';
    } else if (size === 'fitContent') {
      styles['width'] = 'fit-content';
    } else if (size.includes(',')) {
      const [width, height] = size.split(',');
      if (width && height) {
        styles['width'] = width.trim();
        styles['height'] = height.trim();
      }
    } else if (size && size !== 'fitContainer') {
      styles['width'] = size;
    }

    if (this.arrow) styles['padding-right'] = '32px';
    if (this.color) {
      styles['background-color'] = this.color;
      styles['color'] = '#fff';
    }
    if (this.centered) styles['justify-content'] = 'center';
    if (this.icon && !this.centered) styles['padding-left'] = '10px';
    styles['position'] = this.position;

    return styles;
  }

  get contentStyles(): Record<string, string> {
    const styles: Record<string, string> = {};
    const hasIconClass = this.classes.includes('icon');
    const c = this.counter ?? 0;

    if (!hasIconClass && c > 99) styles['margin-right'] = '34px';
    else if (!hasIconClass && c > 0) styles['margin-right'] = '24px';
    else if (c > 99) styles['margin-right'] = '12px';
    else if (c > 0) styles['margin-right'] = '6px';

    if (this.fontColor) styles['color'] = this.fontColor;

    return styles;
  }

  get iconStyles(): Record<string, string> {
    return this.color ? { filter: 'invert(1)' } : {};
  }

  get counterText(): string {
    if (!this.counter || this.counter <= 0) return '';
    return this.counter > 99 ? '99+' : String(this.counter);
  }

  get hasCounter(): boolean {
    return !!this.counter && this.counter > 0;
  }

  spinnerActive = false;

  startLoading(): void {
    if (this.spinnerActive) return;
    this.spinnerActive = true;
  }

  stopLoading(): void {
    if (!this.spinnerActive) return;
    this.spinnerActive = false;
  }

  toggleLoading(force?: boolean): void {
    (force ?? !this.spinnerActive) ? this.startLoading() : this.stopLoading();
  }
}