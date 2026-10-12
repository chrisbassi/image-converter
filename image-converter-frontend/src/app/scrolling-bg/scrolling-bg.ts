import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnDestroy,
  NgZone
} from '@angular/core';

@Component({
  selector: 'app-scrolling-bg',
  standalone: true,
  templateUrl: './scrolling-bg.html',
  styleUrls: ['./scrolling-bg.css']
})
export class ScrollingBg implements AfterViewInit, OnDestroy {

  @ViewChild('scrollingBg', { static: true }) bgRef!: ElementRef<HTMLDivElement>;

  private xPos = 0;
  private yPos = 0;
  private animationId!: number;
  private running = false;

  constructor(private ngZone: NgZone) {}

  ngAfterViewInit(): void {
    this.ngZone.runOutsideAngular(() => {
      this.running = true;
      this.scrollBackground();
    });
  }

  ngOnDestroy(): void {
    this.running = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }

  private scrollBackground = (): void => {
    if (!this.running) return;

    this.xPos -= 0.24;
    this.yPos -= 0.24;

    const el = this.bgRef.nativeElement;
    el.style.backgroundPosition = `${this.xPos}px ${this.yPos}px`;

    this.animationId = requestAnimationFrame(this.scrollBackground);
  };
}