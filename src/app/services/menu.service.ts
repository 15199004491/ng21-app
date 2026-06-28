import { Injectable } from '@angular/core';
import { FlatItem } from '../utils/tree-utils';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private flatMenuData: FlatItem[] = [
    { id: '1', parentId: null, label: 'Dashboard', icon: 'pi pi-home', route: '/' },
    { id: '2', parentId: null, label: 'Factory', icon: 'pi pi-box', route: '/factory/list' },
    { id: '3', parentId: null, label: 'New House', icon: 'pi pi-building' },
    { id: '4', parentId: null, label: 'Second House', icon: 'pi pi-search', route: '/reports' },
    { id: '5', parentId: null, label: 'Rent House', icon: 'pi pi-users', route: '/settings' },
    { id: '6', parentId: null, label: 'Advertising', icon: 'pi pi-volume-up', route: '/settings' },
    { id: '7', parentId: null, label: 'Analyse', icon: 'pi pi-chart-bar', route: '/settings' },

    { id: '2-1', parentId: '2', label: 'Factory List', route: '/factory/list' },
    { id: '2-2', parentId: '2', label: 'Factory Orders', route: '/factory/orders' },
    { id: '2-3', parentId: '2', label: 'Regional', route: '/factory/regions' },

    { id: '3-1', parentId: '3', label: 'Property Developers', route: '/products' },
    { id: '3-2', parentId: '3', label: 'Real Estate', route: '/products/categories' },
    
    { id: '3-2-1', parentId: '3-2', label: 'Regional', route: '/products/categories/electronics' },
    { id: '3-2-2', parentId: '3-2', label: 'Housing Resource', route: '/products/categories/clothing' },
    { id: '3-2-3', parentId: '3-2', label: 'Unoccupied', route: '/products/categories/unoccupied' },

    { id: '4-1', parentId: '4', label: 'Real Estate', route: '/products' },
    { id: '4-2', parentId: '4', label: 'Regional', route: '/products/categories' },

    { id: '5-1', parentId: '5', label: 'Real Estate', route: '/products' },
    { id: '5-2', parentId: '5', label: 'Regional', route: '/products/categories' },

  ];

  getFlatMenuData(): Promise<FlatItem[]> {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve([...this.flatMenuData]);
      }, 500);
    });
  }
}