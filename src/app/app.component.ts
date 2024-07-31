import { Component, Renderer2, AfterViewInit, ElementRef } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  title = 'tempTask';

  private observer!: MutationObserver;

  constructor(private renderer: Renderer2, private el: ElementRef) {}

  ngAfterViewInit(): void {
    console.log('ngAfterViewInit executed');
    this.initHighlighting();
  }

  initHighlighting(): void {
    this.createObserver();
    this.setupSelectionChangeListener();
  }

  createObserver(): void {
    this.observer = new MutationObserver(() => {
      this.checkHighlight();
    });

    const config = { characterData: true, subtree: true, childList: true, attributes: false };
    this.observer.observe(this.el.nativeElement, config);
  }

  setupSelectionChangeListener(): void {
    document.addEventListener('selectionchange', () => {
      this.checkHighlight();
    });
  }

  checkHighlight(): void {
    const hiddenTexts = this.el.nativeElement.querySelectorAll('.hidden-text') as NodeListOf<HTMLElement>;
    
    const icons = this.el.nativeElement.querySelectorAll('.icon-container i') as NodeListOf<HTMLElement>;
    icons.forEach((icon: HTMLElement) => this.renderer.removeClass(icon, 'highlight'));

    hiddenTexts.forEach((text: HTMLElement) => {
      const iconName = text.textContent?.trim();
      if (iconName) {
        const iconsToHighlight = this.el.nativeElement.querySelectorAll(`[data-name="${iconName}"]`) as NodeListOf<HTMLElement>;
        iconsToHighlight.forEach((icon: HTMLElement) => {
          if (this.isTextHighlighted(text)) {
            this.renderer.addClass(icon, 'highlight');
            console.log("Icon highlighted:", iconName);
          }
        });
      }
    });
  }

  isTextHighlighted(element: HTMLElement): boolean {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      for (let i = 0; i < selection.rangeCount; i++) {
        const range = selection.getRangeAt(i);
        if (range.intersectsNode(element)) {
          return true;
        }
      }
    }
    return false;
  }
}
