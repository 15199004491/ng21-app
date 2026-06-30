// src/app/pages/dashboard/dashboard.component.ts
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService, StatCard, Order } from '@/app/services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  providers: [DashboardService],
  template: `
    <div class="space-y-6">
      <div class="pt-6">
        <h1 class="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p class="text-gray-600 mt-1">Welcome to your admin panel</p>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        @for (stat of stats; track stat.id) {
          <div class="bg-white rounded-lg shadow-sm p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-500">{{ stat.title }}</p>
                <p class="text-2xl font-bold text-gray-800 mt-1">{{ stat.value }}</p>
              </div>
              <div [class]="['w-12 h-12', stat.bgColor, 'rounded-lg flex items-center justify-center']">
                <span [class]="['pi', stat.icon, stat.iconColor, 'text-xl']"></span>
              </div>
            </div>
          </div>
        }
      </div>
      
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2 bg-white rounded-lg shadow-sm p-6">
          <h2 class="text-lg font-semibold text-gray-800 mb-4">Sales Overview</h2>
          <div class="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
            <span class="text-gray-400">Chart Placeholder</span>
          </div>
        </div>
        
        <div class="bg-white rounded-lg shadow-sm p-6">
          <h2 class="text-lg font-semibold text-gray-800 mb-4">Recent Orders</h2>
          <div class="space-y-4">
            @for (order of recentOrders; track order.id) {
              <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p class="font-medium text-gray-800">{{ order.orderNumber }}</p>
                  <p class="text-sm text-gray-500">{{ order.amount }}</p>
                </div>
                <span [class]="['px-2 py-1 text-xs font-medium', order.statusColor, 'rounded-full']">
                  {{ order.status }}
                </span>
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class DashboardComponent implements OnInit {
  stats: StatCard[] = [];
  recentOrders: Order[] = [];

  constructor(
    private dashboardService: DashboardService,
    private cdr: ChangeDetectorRef
  ) { }

  async ngOnInit() {
    this.stats = await this.dashboardService.getStats();
    this.recentOrders = await this.dashboardService.getRecentOrders();
    this.cdr.detectChanges();
  }
}