import { Component, Input, Output, EventEmitter, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { Factory } from './factory.model';
import { FactoryService } from './factory.service';

@Component({
    selector: 'factory-add-dialog',
    template: `
        <p-dialog header="Add New Factory" [(visible)]="visible" [modal]="true" [style]="{ width: '35%' }">
            <form #addForm="ngForm" class="p-fluid">
                <div class="field flex items-center gap-4">
                    <label for="factoryName" class="w-44">* Factory Name</label>
                    <input 
                        id="factoryName" 
                        pInputText 
                        [(ngModel)]="factory.name" 
                        name="name" 
                        required
                        maxlength="50"
                        pattern="[a-zA-Z0-9\s]+"
                        #name="ngModel"
                        class="flex-1"
                    />
                </div>
                <div class="mt-1 ml-[196px]">
                    <small *ngIf="name.invalid && (name.dirty || name.touched)" style="color: red; display: block; font-size: 14px;">
                        <span *ngIf="name.errors?.['required']">Factory name is required.</span>
                        <span *ngIf="name.errors?.['maxlength']">Factory name cannot exceed 50 characters.</span>
                        <span *ngIf="name.errors?.['pattern']">Factory name can only contain letters, numbers, and spaces.</span>
                    </small>
                </div>

                <div class="field mt-4 flex items-center gap-4">
                    <label for="location" class="w-44">* Location</label>
                    <p-select 
                        id="location" 
                        [(ngModel)]="factory.location" 
                        name="location" 
                        required
                        #location="ngModel"
                        [options]="locations"
                        placeholder="Select location"
                        class="flex-1"
                    >
                    </p-select>
                </div>
                <div class="mt-1 ml-[196px]">
                    <small *ngIf="location.invalid && (location.dirty || location.touched)" style="color: red; display: block; font-size: 14px;">
                        <span *ngIf="location.errors?.['required']">Location is required.</span>
                    </small>
                </div>

                <div class="field mt-4 flex items-center gap-4">
                    <label for="status" class="w-44">* Status</label>
                    <p-select 
                        id="status" 
                        [(ngModel)]="factory.status" 
                        name="status" 
                        required
                        #status="ngModel"
                        [options]="statusOptions"
                        placeholder="Select status"
                        class="flex-1"
                    >
                    </p-select>
                </div>
                <div class="mt-1 ml-[196px]">
                    <small *ngIf="status.invalid && (status.dirty || status.touched)" style="color: red; display: block; font-size: 14px;">
                        <span *ngIf="status.errors?.['required']">Status is required.</span>
                    </small>
                </div>

                <div class="field mt-4 flex items-center gap-4">
                    <label for="employeeCount" class="w-44">* Employee Count</label>
                    <p-inputNumber 
                        id="employeeCount" 
                        [(ngModel)]="factory.employeeCount" 
                        name="employeeCount" 
                        required
                        [min]="1"
                        [max]="10000"
                        #employeeCount="ngModel"
                        class="flex-1"
                    />
                </div>
                <div class="mt-1 ml-[196px]">
                    <small *ngIf="employeeCount.invalid && (employeeCount.dirty || employeeCount.touched)" style="color: red; display: block; font-size: 14px;">
                        <span *ngIf="employeeCount.errors?.['required']">Employee count is required.</span>
                        <span *ngIf="employeeCount.errors?.['min']">Employee count must be at least 1.</span>
                        <span *ngIf="employeeCount.errors?.['max']">Employee count cannot exceed 10000.</span>
                    </small>
                </div>

                <div class="field mt-4 flex items-center gap-4">
                    <label for="establishedYear" class="w-44">* Established Year</label>
                    <p-inputNumber 
                        id="establishedYear" 
                        [(ngModel)]="factory.establishedYear" 
                        name="establishedYear" 
                        required
                        [min]="1900"
                        [max]="2026"
                        #establishedYear="ngModel"
                        class="flex-1"
                    />
                </div>
                <div class="mt-1 ml-[196px]">
                    <small *ngIf="establishedYear.invalid && (establishedYear.dirty || establishedYear.touched)" style="color: red; display: block; font-size: 14px;">
                        <span *ngIf="establishedYear.errors?.['required']">Established year is required.</span>
                        <span *ngIf="establishedYear.errors?.['min']">Year must be 1900 or later.</span>
                        <span *ngIf="establishedYear.errors?.['max']">Year cannot exceed 2026.</span>
                    </small>
                </div>

            </form>

            <ng-template pTemplate="footer">
                <p-button label="Cancel" icon="pi pi-times" (click)="close()" />
                <p-button label="Confirm" icon="pi pi-check" (click)="confirm()" [disabled]="!addForm.form.valid" />
            </ng-template>
        </p-dialog>
    `,
    standalone: true,
    imports: [CommonModule, SelectModule, InputTextModule, FormsModule, ButtonModule, DialogModule, InputNumberModule]
})
export class FactoryAddDialogComponent implements OnInit {
    private factoryService = inject(FactoryService);
    
    @Input() visible: boolean = false;
    @Input() factory: Factory = {
        id: 0,
        name: '',
        location: '',
        status: '',
        employeeCount: 0,
        establishedYear: new Date().getFullYear(),
        verified: false
    };
    
    @Output() visibleChange = new EventEmitter<boolean>();
    @Output() confirmed = new EventEmitter<Factory>();

    locations: { label: string; value: string }[] = [];
    statusOptions = [
        { label: 'Active', value: 'active' },
        { label: 'Maintenance', value: 'maintenance' },
        { label: 'Inactive', value: 'inactive' }
    ];

    ngOnInit() {
        this.locations = this.factoryService.getRegions().map(r => ({ label: r.name, value: r.name }));
    }

    close() {
        this.visibleChange.emit(false);
    }

    confirm() {
        this.confirmed.emit({ ...this.factory });
        this.visibleChange.emit(false);
    }
}