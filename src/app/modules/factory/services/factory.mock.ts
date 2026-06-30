import { Factory } from '@/app/modules/factory/models/factory.model';
import { factoryMockData } from '@/app/modules/factory/mock/factory.mock';

export const factoryMock = {
    getFactories: (params?: { name?: string; location?: string; status?: string }): Promise<Factory[]> => {
        return new Promise(resolve => {
            setTimeout(() => {
                let result = [...factoryMockData];
                if (params?.name) {
                    const name = params.name.toLowerCase();
                    result = result.filter(f => f.name.toLowerCase().includes(name));
                }
                if (params?.location) {
                    result = result.filter(f => f.location === params.location);
                }
                if (params?.status) {
                    result = result.filter(f => f.status === params.status);
                }
                resolve(result);
            }, 300);
        });
    },

    getFactoryById: (params: { id: number }): Promise<Factory | undefined> => {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve(factoryMockData.find(f => f.id === params.id));
            }, 200);
        });
    },

    createFactory: (params: Omit<Factory, 'id' | 'verified'>): Promise<Factory> => {
        return new Promise(resolve => {
            setTimeout(() => {
                const maxId = Math.max(...factoryMockData.map(f => f.id));
                const newFactory: Factory = {
                    ...params,
                    id: maxId + 1,
                    verified: false
                };
                factoryMockData.push(newFactory);
                resolve(newFactory);
            }, 200);
        });
    },

    updateFactory: (params: { id: number; data: Partial<Factory> }): Promise<Factory | undefined> => {
        return new Promise(resolve => {
            setTimeout(() => {
                const index = factoryMockData.findIndex(f => f.id === params.id);
                if (index === -1) {
                    resolve(undefined);
                } else {
                    factoryMockData[index] = { ...factoryMockData[index], ...params.data };
                    resolve(factoryMockData[index]);
                }
            }, 200);
        });
    },

    deleteFactory: (params: { id: number }): Promise<boolean> => {
        return new Promise(resolve => {
            setTimeout(() => {
                const index = factoryMockData.findIndex(f => f.id === params.id);
                if (index === -1) {
                    resolve(false);
                } else {
                    factoryMockData.splice(index, 1);
                    resolve(true);
                }
            }, 200);
        });
    },
};