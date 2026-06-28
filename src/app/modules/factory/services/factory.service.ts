import { Injectable } from '@angular/core';
import { Factory, Region } from '../models/factory.model';

@Injectable({
    providedIn: 'root'
})
export class FactoryService {
    private factories: Factory[] = [
        { id: 1, name: 'Beijing No.1 Factory', location: 'Beijing', status: 'active', employeeCount: 500, establishedYear: 2000, verified: true },
        { id: 2, name: 'Shanghai Precision Manufacturing', location: 'Shanghai', status: 'active', employeeCount: 800, establishedYear: 1995, verified: true },
        { id: 3, name: 'Guangzhou Assembly Plant', location: 'Guangzhou', status: 'maintenance', employeeCount: 300, establishedYear: 2010, verified: true },
        { id: 4, name: 'Shenzhen R&D Center', location: 'Shenzhen', status: 'active', employeeCount: 1200, establishedYear: 2005, verified: true },
        { id: 5, name: 'Hangzhou Production Factory', location: 'Hangzhou', status: 'inactive', employeeCount: 200, establishedYear: 2008, verified: false },
        { id: 6, name: 'Chengdu Branch Factory', location: 'Chengdu', status: 'active', employeeCount: 450, establishedYear: 2012, verified: true },
        { id: 7, name: 'Wuhan Manufacturing Base', location: 'Wuhan', status: 'active', employeeCount: 600, establishedYear: 2003, verified: true },
        { id: 8, name: 'Nanjing Parts Factory', location: 'Nanjing', status: 'maintenance', employeeCount: 280, establishedYear: 2006, verified: false },
        { id: 9, name: 'Suzhou Assembly Factory', location: 'Suzhou', status: 'active', employeeCount: 350, establishedYear: 2009, verified: true },
        { id: 10, name: 'Tianjin Processing Plant', location: 'Tianjin', status: 'inactive', employeeCount: 150, establishedYear: 2001, verified: false },
        { id: 11, name: 'Chongqing Heavy Industry', location: 'Chongqing', status: 'active', employeeCount: 700, establishedYear: 1998, verified: true },
        { id: 12, name: "Xi'an Electronics Factory", location: "Xi'an", status: 'active', employeeCount: 400, establishedYear: 2007, verified: true },
        { id: 13, name: 'Qingdao Shipyard', location: 'Qingdao', status: 'maintenance', employeeCount: 550, establishedYear: 1990, verified: true },
        { id: 14, name: 'Dalian Petrochemical', location: 'Dalian', status: 'active', employeeCount: 850, establishedYear: 1985, verified: true },
        { id: 15, name: 'Xiamen Electronics Base', location: 'Xiamen', status: 'active', employeeCount: 320, establishedYear: 2011, verified: true }
    ];

    private regions: Region[] = [
        { name: 'Beijing', code: 'bj' },
        { name: 'Shanghai', code: 'sh' },
        { name: 'Guangzhou', code: 'gz' },
        { name: 'Shenzhen', code: 'sz' },
        { name: 'Hangzhou', code: 'hz' },
        { name: 'Chengdu', code: 'cd' },
        { name: 'Wuhan', code: 'wh' },
        { name: 'Nanjing', code: 'nj' },
        { name: 'Suzhou', code: 'sz' },
        { name: 'Tianjin', code: 'tj' },
        { name: 'Chongqing', code: 'cq' },
        { name: "Xi'an", code: 'xa' },
        { name: 'Qingdao', code: 'qd' },
        { name: 'Dalian', code: 'dl' },
        { name: 'Xiamen', code: 'xm' }
    ];

    getFactories(): Promise<Factory[]> {
        return Promise.resolve(this.factories);
    }

    getFactoryById(id: number): Promise<Factory | undefined> {
        return Promise.resolve(this.factories.find(f => f.id === id));
    }

    getRegions(): Region[] {
        return this.regions;
    }

    getFactoryStatuses(): { label: string; value: string }[] {
        return [
            { label: 'Active', value: 'active' },
            { label: 'Maintenance', value: 'maintenance' },
            { label: 'Inactive', value: 'inactive' }
        ];
    }
}