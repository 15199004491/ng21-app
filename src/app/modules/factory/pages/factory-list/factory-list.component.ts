import { Component, OnInit, inject } from '@angular/core';
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
import { FactoryService } from '../../services/factory.service';
import { Factory } from '../../models/factory.model';
import { FactoryAddDialogComponent } from './factory-add-dialog.component';

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
                        <th style="width:25%">Factory Name</th>
                        <th style="width:15%">Location</th>
                        <th style="width:15%">Status</th>
                        <th style="width:15%">Employees</th>
                        <th style="width:15%">Established</th>
                        <th style="width:10%">Verified</th>
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
                            <p-tag [value]="factory.status" [severity]="factory.status === 'active' ? 'success' : factory.status === 'maintenance' ? 'warn' : 'danger'" />
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
                    </tr>
                </ng-template>
                <ng-template #emptymessage>
                    <tr>
                        <td colspan="8">No factories found.</td>
                    </tr>
                </ng-template>
            </p-table>
        </div>

        <factory-add-dialog 
            [(visible)]="addDialogVisible" 
            [factory]="newFactory"
            (confirmed)="handleAddFactory($event)"
        ></factory-add-dialog>
    `,
    standalone: true,
    imports: [CommonModule, SelectModule, IconFieldModule, InputIconModule, TableModule, TagModule, InputTextModule, FormsModule, ButtonModule, CheckboxModule, FactoryAddDialogComponent],
    providers: [FactoryService, MessageService]
})
export class FactoryListComponent implements OnInit {
    private factoryService = inject(FactoryService);
    private messageService = inject(MessageService);
    factories!: Factory[];
    loading: boolean = true;
    searchKeyword: string = '';
    searchField: string = '';
    selectedFactories: Factory[] = [];
    addDialogVisible: boolean = false;

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
        this.factoryService.getFactories().then((factories) => {
            this.factories = factories;
            this.loading = false;
        });
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

    handleAddFactory(event: any) {
        const factory = event as Factory;
        const maxId = Math.max(...this.factories.map(f => f.id));
        factory.id = maxId + 1;
        this.factories.unshift(factory);
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Factory added successfully!' });
    }
}