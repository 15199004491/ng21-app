// src/app/components/layout/layout/layout.component.ts
import { Component } from '@angular/core';
import { HeaderComponent } from '@/app/layouts/header/header.component';
import { SidebarComponent } from '@/app/layouts/sidebar/sidebar.component';
import { MainContentComponent } from '@/app/layouts/main-content/main-content.component';
import { FooterComponent } from '@/app/layouts/footer/footer.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [HeaderComponent, SidebarComponent, MainContentComponent, FooterComponent],
  template: `
    <div class="min-h-screen">
      <app-header></app-header>
      <app-sidebar></app-sidebar>
      <app-main-content>
        <ng-content></ng-content>
      </app-main-content>
      <app-footer></app-footer>
    </div>
  `,
  styles: []
})
export class LayoutComponent { }