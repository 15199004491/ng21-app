import { http } from '@/app/core/services/api.service';
import { Factory } from '@/app/modules/factory/models/factory.model';

export default {
    getFactories: (params?: { name?: string; location?: string; status?: string }) => http.request<Factory[]>('GET', 'factories', undefined, params),//获取工厂列表
    getFactoryById: (params: { id: number }) => http.request<Factory>('GET', `factories/${params.id}`),//获取单个工厂
    createFactory: (params: Omit<Factory, 'id' | 'verified'>) => http.request<Factory>('POST', 'factories', params),//创建工厂
    updateFactory: (params: { id: number; data: Partial<Factory> }) => http.request<Factory>('PUT', `factories/${params.id}`, params.data),//更新工厂
    deleteFactory: (params: { id: number }) => http.request<boolean>('DELETE', `factories/${params.id}`),//删除工厂
};