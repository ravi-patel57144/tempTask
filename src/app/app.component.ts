import { Component, Renderer2, AfterViewInit, ElementRef } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  title = 'tempTask';

  constructor(private renderer: Renderer2, private el: ElementRef) {}

  ngAfterViewInit(): void {
    this.highlightOnSearch();

    // this.setupSearchInput();
  }

  highlightOnSearch(): void {
    const observer = new MutationObserver(() => {
      this.checkHighlight();
    });

    const config = { characterData: true, subtree: true, childList: true };
    observer.observe(document.body, config);

    document.addEventListener('selectionchange', () => {
      this.checkHighlight();
    });
  }

  checkHighlight(): void {
    const hiddenTexts = this.el.nativeElement.querySelectorAll('.hidden-text');
    hiddenTexts.forEach((text: HTMLElement) => {
      const iconName = text.textContent?.trim();
      if (iconName) {
        const icon = this.el.nativeElement.querySelector(`[data-name="${iconName}"]`);
        if (icon) {
          if (this.isTextHighlighted(text)) {
            this.renderer.addClass(icon, 'highlight');
          } else {
            this.renderer.removeClass(icon, 'highlight');
          }
        }
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

  // setupSearchInput(): void {
  //   const searchInput = this.el.nativeElement.querySelector('#search-input');

  //   searchInput.addEventListener('input', (event: any) => {
  //     const searchText = event.target.value.trim().toLowerCase();
  //     this.highlightIcons(searchText);
  //   });
  // }

  // highlightIcons(searchText: string): void {
  //   const icons = this.el.nativeElement.querySelectorAll('.icon-container i');
  //   icons.forEach((icon: HTMLElement) => {
  //     const iconName = icon.getAttribute('data-name');
  //     if (iconName && iconName.toLowerCase().includes(searchText)) {
  //       this.renderer.addClass(icon, 'highlight');
  //     } else {
  //       this.renderer.removeClass(icon, 'highlight');
  //     }
  //   });
  // }
}
