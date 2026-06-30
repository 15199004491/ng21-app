// src/app/layouts/sidebar/sidebar.component.ts
import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { MenuService } from '@/app/services/menu.service';
import { convertFlatToTree, TreeItem } from '@/app/utils/tree-utils';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <aside class="bg-gray-800 text-white w-64 min-h-screen fixed left-0 top-16">
      <!-- Logo -->
      <div class="h-16 flex items-center justify-center border-b border-gray-700">
        <span class="text-xl font-bold text-blue-400">Admin</span>
      </div>
      
      <!-- Navigation Menu -->
      <nav class="p-4">
        <ul class="space-y-1">
          <!-- Define recursive template for menu items -->
          <ng-template #menuRecursive let-items>
            @for (item of items; track item.id) {
              <li>
                <!-- Item with children (expandable) -->
                @if (item.children?.length) {
                  <div class="menu-item">
                    <button 
                      class="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-700 transition-colors text-left"
                      (click)="toggleExpand(item.id)"
                    >
                      <span class="flex items-center space-x-3">
                        <span class="pi" [ngClass]="item.icon"></span>
                        <span>{{ item.label }}</span>
                      </span>
                      <span 
                        class="pi pi-chevron-down transition-transform duration-200"
                        [class.rotate-180]="expandedItems.has(item.id)"
                      ></span>
                    </button>
                    <!-- Submenu -->
                    @if (expandedItems.has(item.id)) {
                      <ul class="ml-4 mt-1 space-y-1">
                        <ng-container *ngTemplateOutlet="menuRecursive; context: { $implicit: item.children }"></ng-container>
                      </ul>
                    }
                  </div>
                }
                
                <!-- Item without children (link) -->
                @if (!item.children?.length) {
                  <a 
                    [routerLink]="item.route || '#'" 
                    class="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-700 transition-colors block"
                    [class.bg-blue-600]="isActiveRoute(item.route)"
                  >
                    <span class="pi" [ngClass]="item.icon"></span>
                    <span>{{ item.label }}</span>
                  </a>
                }
              </li>
            }
          </ng-template>
          
          <!-- Render the recursive menu template -->
          <ng-container *ngTemplateOutlet="menuRecursive; context: { $implicit: menuItems }"></ng-container>
        </ul>
      </nav>
    </aside>
  `,
  styles: [`
    aside {
      top: 64px;
      max-height: calc(100vh - 64px);
      overflow-y: auto;
    }
    
    aside::-webkit-scrollbar {
      width: 6px;
    }
    
    aside::-webkit-scrollbar-track {
      background: #1f2937;
    }
    
    aside::-webkit-scrollbar-thumb {
      background: #4b5563;
      border-radius: 3px;
    }
    
    aside::-webkit-scrollbar-thumb:hover {
      background: #6b7280;
    }
    
    .rotate-180 {
      transform: rotate(180deg);
    }
  `]
})
export class SidebarComponent implements OnInit, OnDestroy {
  menuItems: TreeItem[] = [];
  expandedItems = new Set<string>();
  currentRoute = '/';
  private routerSubscription: Subscription | null = null;

  constructor(
    private menuService: MenuService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadMenu();
    this.setupRouteListener();
  }

  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  async loadMenu(): Promise<void> {
    const flatData = await this.menuService.getFlatMenuData();
    this.menuItems = convertFlatToTree(flatData);
    
    this.currentRoute = this.router.url;
    this.expandParentMenu(this.currentRoute);
    
    this.cdr.detectChanges();
  }

  setupRouteListener(): void {
    this.routerSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.currentRoute = event.urlAfterRedirects;
        this.expandParentMenu(this.currentRoute);
        this.cdr.detectChanges();
      }
    });
  }

  isActiveRoute(route: string | undefined): boolean {
    if (!route) return false;
    return this.currentRoute === route;
  }

  expandParentMenu(currentRoute: string): void {
    this.expandedItems.clear();
    
    const findAndExpandParent = (items: TreeItem[], targetRoute: string): boolean => {
      for (const item of items) {
        if (item.route === targetRoute) {
          return true;
        }
        if (item.children && item.children.length > 0) {
          const found = findAndExpandParent(item.children, targetRoute);
          if (found) {
            this.expandedItems.add(item.id);
            return true;
          }
        }
      }
      return false;
    };
    
    findAndExpandParent(this.menuItems, currentRoute);
  }

  toggleExpand(itemId: string): void {
    if (this.expandedItems.has(itemId)) {
      this.expandedItems.delete(itemId);
    } else {
      this.expandedItems.add(itemId);
    }
  }
}