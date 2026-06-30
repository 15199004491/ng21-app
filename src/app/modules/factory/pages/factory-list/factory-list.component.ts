import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { Table, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { MessageService } from 'primeng/api';
import { Factory } from '@/app/modules/factory/models/factory.model';
import { FactoryAddDialogComponent } from './factory-add-dialog.component';
import { FactoryEditDialogComponent } from './factory-edit-dialog.component';
import { FactoryDetailDialogComponent } from './factory-detail-dialog.component';
import { factoryMock } from '@/app/modules/factory/services/factory.mock';

@Component({
    template: `
        <div class="card">
            <p-table
                #dt2
                [value]="factories"
                dataKey="id"
                [rows]="10"
                [rowsPerPageOptions]="[10, 25, 50]"
                [loading]="loading"
                [paginator]="true"
                [globalFilterFields]="['name', 'location', 'status']"
                [tableStyle]="{ 'min-width': '75rem' }"
                selectionMode="multiple"
                [(selection)]="selectedFactories"
            >
                <ng-template #caption>
                    <div class="flex justify-between items-center py-4">
                        <div class="flex items-center gap-2">
                            <p-select [(ngModel)]="searchField" [options]="searchFields" placeholder="Select field" style="min-width: 12rem">
                            </p-select>
                            <p-iconfield iconPosition="left">
                                <p-inputicon>
                                    <i class="pi pi-search"></i>
                                </p-inputicon>
                                <input pInputText type="text" [(ngModel)]="searchKeyword" placeholder="Search keyword" />
                            </p-iconfield>
                            <p-button label="Search" icon="pi pi-search" (click)="search(dt2)" />
                        </div>
                        <div class="flex items-center gap-2">
                            <p-button 
                                label="Add Factory" 
                                icon="pi pi-plus" 
                                severity="success" 
                                (click)="showAddDialog()" 
                            />
                            <p-button 
                                label="Delete Selected" 
                                icon="pi pi-trash" 
                                severity="danger" 
                                [disabled]="selectedFactories.length === 0"
                                (click)="deleteSelected()" 
                            />
                        </div>
                    </div>
                </ng-template>
                <ng-template #header>
                    <tr>
                        <th style="width:3rem">
                            <p-tableHeaderCheckbox></p-tableHeaderCheckbox>
                        </th>
                        <th style="width:3rem">ID</th>
                        <th style="width:20%">Factory Name</th>
                        <th style="width:12%">Location</th>
                        <th style="width:12%">Status</th>
                        <th style="width:12%">Employees</th>
                        <th style="width:12%">Established</th>
                        <th style="width:8%">Verified</th>
                        <th style="width:10%">Actions</th>
                    </tr>
                </ng-template>
                <ng-template #body let-factory>
                    <tr>
                        <td>
                            <p-tableCheckbox [value]="factory"></p-tableCheckbox>
                        </td>
                        <td>{{ factory.id }}</td>
                        <td>{{ factory.name }}</td>
                        <td>{{ factory.location }}</td>
                        <td>
                            <p-tag 
                                [value]="factory.status" 
                                [severity]="factory.status === 'active' ? 'success' : factory.status === 'maintenance' ? 'warn' : 'danger'"
                                [style]="factory.status === 'active' ? { color: '#10b981', backgroundColor: '#d1fae5' } : {}"
                            />
                        </td>
                        <td>{{ factory.employeeCount.toLocaleString() }}</td>
                        <td>{{ factory.establishedYear }}</td>
                        <td>
                            <i
                                class="pi"
                                [ngClass]="{
                                    'text-green-500 pi-check-circle': factory.verified,
                                    'text-red-500 pi-times-circle': !factory.verified
                                }"
                            ></i>
                        </td>
                        <td>
                            <div class="flex gap-2">
                                <p-button 
                                    label="Edit" 
                                    icon="pi pi-file-edit"
                                    [rounded]="true" 
                                    severity="success"
                                    size="small"
                                    (click)="showEditDialog(factory)"
                                    [style]="{ backgroundColor: '#f0fdf4', color: '#16a34a', borderColor: '#bbf7d0' }"
                                ></p-button>
                                <p-button 
                                    label="Detail" 
                                    icon="pi pi-file"
                                    [rounded]="true" 
                                    severity="secondary"
                                    size="small"
                                    (click)="showDetailDialog(factory)"
                                    [style]="{ backgroundColor: '#f9fafb', color: '#374151', borderColor: '#e5e7eb' }"
                                ></p-button>
                            </div>
                        </td>
                    </tr>
                </ng-template>
                <ng-template #emptymessage>
                    <tr>
                        <td colspan="9">No factories found.</td>
                    </tr>
                </ng-template>
            </p-table>
        </div>

        <factory-add-dialog 
            [(visible)]="addDialogVisible" 
            [factory]="newFactory"
            (confirmed)="handleAddFactory($event)"
        ></factory-add-dialog>

        <factory-edit-dialog 
            [(visible)]="editDialogVisible" 
            [factory]="selectedFactory"
            (confirmed)="handleEditFactory($event)"
        ></factory-edit-dialog>

        <factory-detail-dialog 
            [(visible)]="detailDialogVisible" 
            [factory]="selectedFactory"
        ></factory-detail-dialog>
    `,
    standalone: true,
    imports: [CommonModule, SelectModule, IconFieldModule, InputIconModule, TableModule, TagModule, InputTextModule, FormsModule, ButtonModule, CheckboxModule, FactoryAddDialogComponent, FactoryEditDialogComponent, FactoryDetailDialogComponent],
    providers: [MessageService]
})
export class FactoryListComponent implements OnInit {
    private messageService = inject(MessageService);
    private cdr = inject(ChangeDetectorRef);
    factories: Factory[] = [];
    loading: boolean = true;
    searchKeyword: string = '';
    searchField: string = '';
    selectedFactories: Factory[] = [];
    
    addDialogVisible: boolean = false;
    editDialogVisible: boolean = false;
    detailDialogVisible: boolean = false;
    selectedFactory: Factory | null = null;

    newFactory: Factory = {
        id: 0,
        name: '',
        location: '',
        status: '',
        employeeCount: 0,
        establishedYear: new Date().getFullYear(),
        verified: false
    };

    searchFields = [
        { label: 'All Fields', value: '' },
        { label: 'Factory Name', value: 'name' },
        { label: 'Location', value: 'location' },
        { label: 'Status', value: 'status' },
        { label: 'ID', value: 'id' }
    ];

    ngOnInit() {
        this.loadFactories();
    }

    async loadFactories(): Promise<void> {
        this.loading = true;
        this.factories = await factoryMock.getFactories();
        this.loading = false;
        this.cdr.detectChanges();
    }

    search(table: Table) {
        if (this.searchField) {
            table.filter(this.searchKeyword, this.searchField, 'contains');
        } else {
            table.filterGlobal(this.searchKeyword, 'contains');
        }
    }

    clearFilters(table: Table) {
        table.clear();
        this.searchKeyword = '';
        this.searchField = '';
    }

    deleteSelected() {
        if (this.selectedFactories.length > 0) {
            const selectedIds = this.selectedFactories.map(f => f.id);
            this.factories = this.factories.filter(f => !selectedIds.includes(f.id));
            this.selectedFactories = [];
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Selected factories deleted successfully!' });
        }
    }

    showAddDialog() {
        this.newFactory = {
            id: 0,
            name: '',
            location: '',
            status: '',
            employeeCount: 0,
            establishedYear: new Date().getFullYear(),
            verified: false
        };
        this.addDialogVisible = true;
    }

    showEditDialog(factory: Factory) {
        this.selectedFactory = factory;
        this.editDialogVisible = true;
    }

    showDetailDialog(factory: Factory) {
        this.selectedFactory = factory;
        this.detailDialogVisible = true;
    }

    async handleAddFactory(event: any) {
        const factory = event as Factory;
        const newFactory = await factoryMock.createFactory(factory);
        this.factories.unshift(newFactory);
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Factory added successfully!' });
    }

    async handleEditFactory(event: any) {
        const updatedFactory = event as Factory;
        await factoryMock.updateFactory({ id: updatedFactory.id, data: updatedFactory });
        const index = this.factories.findIndex(f => f.id === updatedFactory.id);
        if (index !== -1) {
            this.factories[index] = updatedFactory;
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Factory updated successfully!' });
        }
    }
}