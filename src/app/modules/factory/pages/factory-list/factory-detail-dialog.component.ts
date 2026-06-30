import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { Factory } from '@/app/modules/factory/models/factory.model';

@Component({
    selector: 'factory-detail-dialog',
    standalone: true,
    imports: [CommonModule, ButtonModule, DialogModule],
    template: `
        <p-dialog 
            header="Factory Details" 
            [(visible)]="visible" 
            [modal]="true" 
            [style]="{ width: '40%' }"
            [focusTrap]="false"
        >
            @if (factory) {
                <div class="space-y-4">
                    <div class="flex justify-between p-3 bg-gray-50 rounded-lg">
                        <span class="font-semibold">ID:</span>
                        <span>{{ factory.id }}</span>
                    </div>
                    <div class="flex justify-between p-3 bg-gray-50 rounded-lg">
                        <span class="font-semibold">Factory Name:</span>
                        <span>{{ factory.name }}</span>
                    </div>
                    <div class="flex justify-between p-3 bg-gray-50 rounded-lg">
                        <span class="font-semibold">Location:</span>
                        <span>{{ factory.location }}</span>
                    </div>
                    <div class="flex justify-between p-3 bg-gray-50 rounded-lg">
                        <span class="font-semibold">Status:</span>
                        <span 
                            class="px-2 py-1 rounded-full text-sm"
                            [ngClass]="{
                                'bg-green-100 text-green-800': factory.status === 'active',
                                'bg-yellow-100 text-yellow-800': factory.status === 'maintenance',
                                'bg-red-100 text-red-800': factory.status === 'inactive'
                            }"
                        >
                            {{ factory.status }}
                        </span>
                    </div>
                    <div class="flex justify-between p-3 bg-gray-50 rounded-lg">
                        <span class="font-semibold">Employee Count:</span>
                        <span>{{ factory.employeeCount.toLocaleString() }}</span>
                    </div>
                    <div class="flex justify-between p-3 bg-gray-50 rounded-lg">
                        <span class="font-semibold">Established Year:</span>
                        <span>{{ factory.establishedYear }}</span>
                    </div>
                    <div class="flex justify-between p-3 bg-gray-50 rounded-lg">
                        <span class="font-semibold">Verified:</span>
                        <span>
                            <i 
                                class="pi"
                                [class.text-green-500 pi-check-circle]="factory.verified"
                                [class.text-red-500 pi-times-circle]="!factory.verified"
                            ></i>
                        </span>
                    </div>
                </div>
            }

            <ng-template pTemplate="footer">
                <p-button 
                    label="Close" 
                    icon="pi pi-times" 
                    (click)="close()" 
                />
            </ng-template>
        </p-dialog>
    `
})
export class FactoryDetailDialogComponent {
    @Input() visible: boolean = false;
    @Input() factory: Factory | null = null;
    
    @Output() visibleChange = new EventEmitter<boolean>();

    close(): void {
        this.visibleChange.emit(false);
    }
}