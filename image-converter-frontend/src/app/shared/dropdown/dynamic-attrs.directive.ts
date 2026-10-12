import { Directive, ElementRef, Input, OnChanges, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appDynamicAttrs]',
  standalone: true,
})
export class DynamicAttrsDirective implements OnChanges {
  @Input('appDynamicAttrs')
  attrs: Record<string, string | number | null | undefined> | null = null;

  private applied: string[] = [];

  constructor(
    private readonly el: ElementRef<HTMLElement>,
    private readonly renderer: Renderer2
  ) {}

  ngOnChanges(): void {
    this.applied.forEach((attr) =>
      this.renderer.removeAttribute(this.el.nativeElement, attr)
    );
    this.applied = [];

    if (!this.attrs) return;

    Object.entries(this.attrs).forEach(([key, value]) => {
      if (value === null || value === undefined || value === '') return;
      this.renderer.setAttribute(this.el.nativeElement, key, String(value));
      this.applied.push(key);
    });
  }
}