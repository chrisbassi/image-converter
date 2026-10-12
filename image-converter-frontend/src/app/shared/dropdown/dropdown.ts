import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  CUSTOM_ELEMENTS_SCHEMA,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicAttrsDirective } from './dynamic-attrs.directive';

/**
 * Equivalente ao parseCsvString() do PHP.
 * Aceita array ou string separada por vírgulas.
 */
function parseCsvString(value: string[] | string | null | undefined): string[] {
  if (value === null || value === undefined) return [];
  if (Array.isArray(value)) return value.map((v) => String(v));

  const trimmed = value.trim();
  if (trimmed === '') return [];

  return trimmed.split(',').map((v) => v.trim());
}

@Component({
  selector: 'dropdown',
  standalone: true,
  imports: [CommonModule, DynamicAttrsDirective],
  templateUrl: './dropdown.html',   // ✅
  styleUrls: ['./dropdown.css'],    // ✅
  host: {
    class: 'form-dropdown',
    '[class.multiValue]': 'isMultiValue',
    '[attr.id]': 'resolvedId',
    '[style]': 'hostStyles',
  },
})
export class DropdownComponent implements OnChanges {
  /* ------------------------- Inputs (mesma ordem do PHP) ------------------ */
  @Input() label = '';
  @Input() optionValues: string[] | string | null = null;
  @Input() optionTexts: string[] | string | null = null;
  @Input() selectedValue: string | null = null;
  @Input() id = '';
  @Input() name = '';
  @Input() classes = '';
  @Input() size = 'fit-content';
  @Input() centered = false;
  @Input() icon: string | null = null;
  @Input() disabled = false;
  @Input() multiValue: number | null = null;
  @Input() data: Record<string, string | number> | null = null;

  /** Caminho base dos ícones (equivale a ROOT + "assets/icons/") */
  @Input() iconsPath = 'assets/icons';
  @Input() root = '';

  /* -------------------------------- Outputs ------------------------------- */
  @Output() selectedValueChange = new EventEmitter<string>();
  @Output() addValue = new EventEmitter<number>();

  /* ----------------------------- Estado interno --------------------------- */
  values: string[] = [];
  texts: string[] = [];

  ngOnChanges(_changes: SimpleChanges): void {
    this.values = parseCsvString(this.optionValues);
    this.texts = parseCsvString(this.optionTexts);
  }

  /* -------------------------------- Getters ------------------------------- */
  get isMultiValue(): boolean {
    return this.multiValue !== null && this.multiValue !== undefined;
  }

  /** id do wrapper (no multiValue vira `valueInput_N`) */
  get resolvedId(): string {
    return this.isMultiValue ? `valueInput_${this.multiValue}` : this.id;
  }

  get selectId(): string {
    return `${this.resolvedId}_select`;
  }

  /** `classes` do PHP: vírgulas viram espaços */
  get classList(): string {
    return this.classes.replace(/,/g, ' ').trim();
  }

  /** count(values) !== count(texts) && texts > 0 */
  get hasMismatch(): boolean {
    return this.values.length !== this.texts.length && this.texts.length > 0;
  }

  get hostStyles(): Record<string, string> {
    const styles: Record<string, string> = {};

    if (this.size === '100%') {
      styles['width'] = '100%';
      styles['max-width'] = '100%';
    } else {
      styles['width'] = this.size;
    }

    if (this.centered) styles['text-align'] = 'center';

    return styles;
  }

  get selectStyles(): Record<string, string> {
    const styles: Record<string, string> = {};
    if (this.centered) styles['text-align'] = 'center';
    if (this.icon) styles['padding-left'] = '42px';
    return styles;
  }

  get labelStyles(): Record<string, string> {
    return this.icon ? { left: '24px' } : {};
  }

  get iconBackground(): string {
    return `url('${this.root}${this.iconsPath}/${this.icon}.svg') no-repeat center / contain`;
  }

  /* -------------------------------- Eventos ------------------------------- */
  onSelectChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.selectedValue = value;
    this.selectedValueChange.emit(value);
  }

  onAddValue(): void {
    if (this.isMultiValue) {
      this.addValue.emit(this.multiValue as number);
    }
  }
}