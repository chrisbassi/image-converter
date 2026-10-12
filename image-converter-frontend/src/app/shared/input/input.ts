import { Component, EventEmitter, Input, Output, forwardRef, HostBinding } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Button } from '../button/button';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule, FormsModule, Button],
  templateUrl: './input.html',
  styleUrl: './input.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AppInput),
      multi: true
    }
  ]
})
export class AppInput implements ControlValueAccessor {
  // ===== Inputs =====
  @Input() label: string | null = null;
  @Input() icon: string | null = null;
  @Input() id: string | null = null;
  @Input() name: string | null = null;
  @Input() classes = '';
  @Input() size: string = '100%';
  @Input() type: 'input' | 'password' | 'hidden' | 'search' | 'message' | 'color' | 'textarea' | 'number' = 'input';
  @Input() searchMenu = false;
  @Input() datamask: string | null = null;
  @Input() centered = false;
  @Input() disabled = false;
  @Input() required = false;
  @Input() readOnly = false;
  @Input() multiValue: number | null = null;
  @Input() suggestions = false;
  @Input() file: string | null = null;

  // ===== Host bindings (aplicam no <app-input> em si) =====
  @HostBinding('style.width')
  get hostWidth(): string {
    if (this.type === 'hidden') return '0px';
    if (this.size === '100%') return '100%';
    if (this.size === 'fitContent') return 'fit-content';
    return this.size;
  }

  @HostBinding('style.max-width')
  get hostMaxWidth(): string | null {
    return this.size === '100%' ? '100%' : null;
  }

  @HostBinding('style.display')
  get hostDisplay(): string {
    return this.type === 'hidden' ? 'none' : 'block';
  }

  // ===== Outputs (eventos dos botões internos) =====
  @Output() valueChange = new EventEmitter<string>();
  @Output() filterClick = new EventEmitter<void>();
  @Output() refreshClick = new EventEmitter<void>();
  @Output() clearClick = new EventEmitter<void>();
  @Output() attachClick = new EventEmitter<void>();
  @Output() screencastClick = new EventEmitter<void>();

  // ===== Estado interno =====
  value = '';
  showPassword = false;

  // ===== ControlValueAccessor (integração com ngModel / reactive forms) =====
  onChange = (_: string) => {};
  onTouched = () => {};

  writeValue(value: any): void {
    this.value = value ?? '';
  }
  registerOnChange(fn: any): void { this.onChange = fn; }
  registerOnTouched(fn: any): void { this.onTouched = fn; }
  setDisabledState(isDisabled: boolean): void { this.disabled = isDisabled; }

  // ===== Eventos do input =====
  onInput(event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    this.value = val;
    this.onChange(val);
    this.onTouched();
    this.valueChange.emit(val);
  }
  

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  // ===== Helpers para o template =====
  get inputId(): string {
    return `${this.id ?? 'input'}_input`;
  }

  get hiddenInputId(): string {
    return `${this.id ?? 'input'}_hiddenInput`;
  }

  get hiddenName(): string {
    return this.name ?? this.id ?? '';
  }

get inputType(): string {
  if (this.type === 'password') return this.showPassword ? 'text' : 'password';
  if (this.type === 'number') return 'number';
  if (this.type === 'input' || this.type === 'search' || this.type === 'message') return 'text';
  return this.type;
}

get isRealInput(): boolean {
  return ['input', 'password', 'hidden', 'search', 'message', 'color', 'number'].includes(this.type);
}
  get isTextarea(): boolean {
    return this.type === 'textarea';
  }

  get containerClasses(): string {
    return `form-${this.type}`;
  }

  get containerId(): string {
    return this.id?.includes('valueInput') ? `${this.id}_container` : (this.id ?? '');
  }

  get containerStyles(): Record<string, string> {
    const styles: Record<string, string> = {};
    if (this.size === '100%') {
      styles['width'] = '100%';
      styles['max-width'] = '100%';
    } else if (this.size === 'fitContent') {
      styles['width'] = 'fit-content';
    } else {
      styles['width'] = this.size;
    }
    if (this.type === 'hidden') styles['display'] = 'none';
    return styles;
  }

  get inputStyles(): Record<string, string> {
    const styles: Record<string, string> = {};
    if (this.type === 'color') styles['padding'] = '0';

    // ✅ Adicionar else para outros valores de size
    if (this.size === '100%') {
      styles['width'] = '100%';
      styles['max-width'] = '100%';
    } else if (this.size === 'fitContent') {
      styles['width'] = 'fit-content';
    } else if (this.size) {
      styles['width'] = this.size;
    }

    if (this.icon && !this.centered) styles['padding-left'] = '40px';
    if (this.readOnly) styles['pointer-events'] = 'none';
    if (this.centered) styles['text-align'] = 'center';
    return styles;
  }

  get labelClasses(): string {
    const parts: string[] = [];
    if (this.centered && this.value) parts.push('centered', 'active');
    else if (this.centered) parts.push('centered');
    else if (this.value) parts.push('active');
    return parts.join(' ');
  }

  get labelStyles(): Record<string, string> {
    if (this.icon && this.multiValue) {
      return { left: '22px', 'max-width': 'calc(100% - 24px - 8px)' };
    }
    if (this.icon) return { left: '24px' };
    return { 'max-width': '100%' };
  }

  get displayLabel(): string {
    return this.required ? `${this.label ?? ''} *` : (this.label ?? '');
  }

  get iconUrl(): string | null {
    return this.icon ? `assets/icons/${this.icon}.svg` : null;
  }
}