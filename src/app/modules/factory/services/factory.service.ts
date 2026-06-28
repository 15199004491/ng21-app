import { Injectable } from '@angular/core';

export interface Factory {
  id: string;
  name: string;
  code: string;
  regionId: string;
  regionName: string;
  address: string;
  contact: string;
  phone: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface FactoryOrder {
  id: string;
  orderNumber: string;
  factoryId: string;
  factoryName: string;
  productName: string;
  quantity: number;
  unit: string;
  totalAmount: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  createdAt: string;
  details: OrderDetail[];
}

export interface OrderDetail {
  id: string;
  productId: string;
  productName: string;
  specification: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export interface Region {
  id: string;
  name: string;
  code: string;
  factoryCount: number;
  factories: Factory[];
}

@Injectable({ providedIn: 'root' })
export class FactoryService {
  private factories: Factory[] = [
    { id: '1', name: 'East China Factory', code: 'HD-001', regionId: '1', regionName: 'East China', address: 'Zhangjiang High-Tech Park, Pudong New Area, Shanghai', contact: 'Zhang San', phone: '13800138001', status: 'active', createdAt: '2024-01-15', updatedAt: '2024-01-15' },
    { id: '2', name: 'South China Factory', code: 'HN-001', regionId: '2', regionName: 'South China', address: 'Science and Technology Park, Nanshan District, Shenzhen', contact: 'Li Si', phone: '13800138002', status: 'active', createdAt: '2024-02-20', updatedAt: '2024-02-20' },
    { id: '3', name: 'North China Factory', code: 'HB-001', regionId: '3', regionName: 'North China', address: 'Wangjing SOHO, Chaoyang District, Beijing', contact: 'Wang Wu', phone: '13800138003', status: 'inactive', createdAt: '2024-03-10', updatedAt: '2024-03-15' },
    { id: '4', name: 'Central China Factory', code: 'HZ-001', regionId: '4', regionName: 'Central China', address: 'East Lake High-Tech Development Zone, Wuhan', contact: 'Zhao Liu', phone: '13800138004', status: 'active', createdAt: '2024-04-05', updatedAt: '2024-04-05' },
    { id: '5', name: 'Southwest Factory', code: 'XN-001', regionId: '5', regionName: 'Southwest', address: 'High-Tech Zone, Chengdu, Sichuan', contact: 'Qian Qi', phone: '13800138005', status: 'active', createdAt: '2024-05-20', updatedAt: '2024-05-20' },
    { id: '6', name: 'South China Factory II', code: 'HN-002', regionId: '2', regionName: 'South China', address: 'Tianhe District, Guangzhou', contact: 'Sun Ba', phone: '13800138006', status: 'active', createdAt: '2024-06-01', updatedAt: '2024-06-01' }
  ];

  private orders: FactoryOrder[] = [
    { id: '1', orderNumber: 'PO-2024-0001', factoryId: '1', factoryName: 'East China Factory', productName: 'Electronic Product A', quantity: 1000, unit: 'pcs', totalAmount: 50000, status: 'completed', createdAt: '2024-01-20', details: [
      { id: '1-1', productId: 'P001', productName: 'Electronic Product A', specification: 'Model X1', quantity: 500, unitPrice: 50, amount: 25000 },
      { id: '1-2', productId: 'P002', productName: 'Electronic Product A', specification: 'Model X2', quantity: 500, unitPrice: 50, amount: 25000 }
    ]},
    { id: '2', orderNumber: 'PO-2024-0002', factoryId: '2', factoryName: 'South China Factory', productName: 'Mechanical Equipment B', quantity: 50, unit: 'units', totalAmount: 150000, status: 'processing', createdAt: '2024-02-25', details: [
      { id: '2-1', productId: 'P003', productName: 'Mechanical Equipment B', specification: 'Standard', quantity: 50, unitPrice: 3000, amount: 150000 }
    ]},
    { id: '3', orderNumber: 'PO-2024-0003', factoryId: '4', factoryName: 'Central China Factory', productName: 'Raw Material C', quantity: 2000, unit: 'kg', totalAmount: 20000, status: 'pending', createdAt: '2024-03-10', details: [
      { id: '3-1', productId: 'P004', productName: 'Raw Material C', specification: 'Grade A', quantity: 1000, unitPrice: 10, amount: 10000 },
      { id: '3-2', productId: 'P005', productName: 'Raw Material C', specification: 'Grade B', quantity: 1000, unitPrice: 10, amount: 10000 }
    ]},
    { id: '4', orderNumber: 'PO-2024-0004', factoryId: '5', factoryName: 'Southwest Factory', productName: 'Packaging Material D', quantity: 5000, unit: 'pcs', totalAmount: 5000, status: 'completed', createdAt: '2024-04-15', details: [
      { id: '4-1', productId: 'P006', productName: 'Packaging Material D', specification: '30*40', quantity: 5000, unitPrice: 1, amount: 5000 }
    ]},
    { id: '5', orderNumber: 'PO-2024-0005', factoryId: '2', factoryName: 'South China Factory', productName: 'Electronic Product E', quantity: 800, unit: 'pcs', totalAmount: 40000, status: 'processing', createdAt: '2024-05-20', details: [
      { id: '5-1', productId: 'P007', productName: 'Electronic Product E', specification: 'Model Y1', quantity: 800, unitPrice: 50, amount: 40000 }
    ]},
    { id: '6', orderNumber: 'PO-2024-0006', factoryId: '6', factoryName: 'South China Factory II', productName: 'Parts F', quantity: 200, unit: 'sets', totalAmount: 30000, status: 'pending', createdAt: '2024-06-01', details: [
      { id: '6-1', productId: 'P008', productName: 'Parts F', specification: 'Complete Set', quantity: 200, unitPrice: 150, amount: 30000 }
    ]}
  ];

  private regions: Region[] = [
    { id: '1', name: 'East China', code: 'HD', factoryCount: 1, factories: [this.factories[0]] },
    { id: '2', name: 'South China', code: 'HN', factoryCount: 2, factories: [this.factories[1], this.factories[5]] },
    { id: '3', name: 'North China', code: 'HB', factoryCount: 1, factories: [this.factories[2]] },
    { id: '4', name: 'Central China', code: 'HZ', factoryCount: 1, factories: [this.factories[3]] },
    { id: '5', name: 'Southwest', code: 'XN', factoryCount: 1, factories: [this.factories[4]] },
    { id: '6', name: 'Northwest', code: 'XB', factoryCount: 0, factories: [] },
    { id: '7', name: 'Northeast', code: 'DB', factoryCount: 0, factories: [] },
    { id: '8', name: 'Southeast', code: 'DN', factoryCount: 0, factories: [] }
  ];

  getFactories(params?: { name?: string; regionId?: string; status?: string }): Promise<Factory[]> {
    let result = [...this.factories];
    if (params?.name) {
      const name = params.name.toLowerCase();
      result = result.filter(f => f.name.toLowerCase().includes(name));
    }
    if (params?.regionId) {
      result = result.filter(f => f.regionId === params.regionId);
    }
    if (params?.status) {
      result = result.filter(f => f.status === params.status);
    }
    return Promise.resolve(result);
  }

  getFactoryById(id: string): Promise<Factory | undefined> {
    return Promise.resolve(this.factories.find(f => f.id === id));
  }

  createFactory(factory: Omit<Factory, 'id' | 'createdAt' | 'updatedAt'>): Promise<Factory> {
    const newFactory: Factory = {
      ...factory,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };
    this.factories.push(newFactory);
    const region = this.regions.find(r => r.id === factory.regionId);
    if (region) {
      region.factoryCount++;
      region.factories.push(newFactory);
    }
    return Promise.resolve(newFactory);
  }

  updateFactory(id: string, factory: Partial<Factory>): Promise<Factory | undefined> {
    const index = this.factories.findIndex(f => f.id === id);
    if (index === -1) return Promise.resolve(undefined);
    
    const oldRegionId = this.factories[index].regionId;
    const newRegionId = factory.regionId || oldRegionId;
    
    if (oldRegionId !== newRegionId) {
      const oldRegion = this.regions.find(r => r.id === oldRegionId);
      if (oldRegion) {
        oldRegion.factoryCount--;
        oldRegion.factories = oldRegion.factories.filter(f => f.id !== id);
      }
      const newRegion = this.regions.find(r => r.id === newRegionId);
      if (newRegion) {
        newRegion.factoryCount++;
      }
    }
    
    this.factories[index] = {
      ...this.factories[index],
      ...factory,
      updatedAt: new Date().toISOString().split('T')[0]
    };
    
    const updatedFactory = this.factories[index];
    if (oldRegionId !== newRegionId) {
      const newRegion = this.regions.find(r => r.id === newRegionId);
      if (newRegion) {
        newRegion.factories.push(updatedFactory);
      }
    }
    
    return Promise.resolve(updatedFactory);
  }

  deleteFactory(id: string): Promise<boolean> {
    const index = this.factories.findIndex(f => f.id === id);
    if (index === -1) return Promise.resolve(false);
    
    const factory = this.factories[index];
    const region = this.regions.find(r => r.id === factory.regionId);
    if (region) {
      region.factoryCount--;
      region.factories = region.factories.filter(f => f.id !== id);
    }
    
    this.factories.splice(index, 1);
    return Promise.resolve(true);
  }

  getOrders(params?: { orderNumber?: string; factoryId?: string; status?: string }): Promise<FactoryOrder[]> {
    let result = [...this.orders];
    if (params?.orderNumber) {
      const orderNumber = params.orderNumber.toLowerCase();
      result = result.filter(o => o.orderNumber.toLowerCase().includes(orderNumber));
    }
    if (params?.factoryId) {
      result = result.filter(o => o.factoryId === params.factoryId);
    }
    if (params?.status) {
      result = result.filter(o => o.status === params.status);
    }
    return Promise.resolve(result);
  }

  getOrderById(id: string): Promise<FactoryOrder | undefined> {
    return Promise.resolve(this.orders.find(o => o.id === id));
  }

  getRegions(params?: { name?: string; hasFactory?: boolean }): Promise<Region[]> {
    let result = [...this.regions];
    if (params?.name) {
      const name = params.name.toLowerCase();
      result = result.filter(r => r.name.toLowerCase().includes(name));
    }
    if (params?.hasFactory !== undefined) {
      result = result.filter(r => params.hasFactory ? r.factoryCount > 0 : r.factoryCount === 0);
    }
    return Promise.resolve(result);
  }

  getRegionById(id: string): Promise<Region | undefined> {
    return Promise.resolve(this.regions.find(r => r.id === id));
  }
}