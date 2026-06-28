import { Component, Input, Output, EventEmitter, OnInit, OnChanges, inject, ViewChild, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { Factory } from '../../models/factory.model';
import { FactoryService } from '../../services/factory.service';

@Component({
    selector: 'factory-add-dialog',
    standalone: true,
    imports: [CommonModule, SelectModule, InputTextModule, FormsModule, ButtonModule, DialogModule, InputNumberModule],
    template: `
        <p-dialog header="Add New Factory" [(visible)]="visible" [modal]="true" [style]="{ width: '35%' }" [focusTrap]="false">
            <form #addForm="ngForm" class="p-fluid">
                <div class="field">
                    <label for="factoryName" class="block mb-2">* Factory Name</label>
                    <input 
                        id="factoryName" 
                        pInputText 
                        [(ngModel)]="factory.name" 
                        name="name" 
                        required
                        maxlength="50"
                        pattern="[a-zA-Z0-9\\s]+"
                        #name="ngModel"
                        class="w-full"
                    />
                    @if (name.invalid && (name.dirty || name.touched)) {
                        <small class="error-text">
                            @if (name.errors?.['required']) {<span>Factory name is required.</span>}
                            @if (name.errors?.['maxlength']) {<span>Factory name cannot exceed 50 characters.</span>}
                            @if (name.errors?.['pattern']) {<span>Factory name can only contain letters, numbers, and spaces.</span>}
                        </small>
                    }
                </div>

                <div class="field mt-4">
                    <label for="location" class="block mb-2">* Location</label>
                    <p-select 
                        id="location" 
                        [(ngModel)]="factory.location" 
                        name="location" 
                        required
                        #location="ngModel"
                        [options]="locations"
                        placeholder="Select location"
                        class="w-full"
                    />
                    @if (location.invalid && (location.dirty || location.touched)) {
                        <small class="error-text">
                            @if (location.errors?.['required']) {<span>Location is required.</span>}
                        </small>
                    }
                </div>

                <div class="field mt-4">
                    <label for="status" class="block mb-2">* Status</label>
                    <p-select 
                        id="status" 
                        [(ngModel)]="factory.status" 
                        name="status" 
                        required
                        #status="ngModel"
                        [options]="statusOptions"
                        placeholder="Select status"
                        class="w-full"
                    />
                    @if (status.invalid && (status.dirty || status.touched)) {
                        <small class="error-text">
                            @if (status.errors?.['required']) {<span>Status is required.</span>}
                        </small>
                    }
                </div>

                <div class="field mt-4">
                    <label for="employeeCount" class="block mb-2">* Employee Count</label>
                    <p-inputNumber 
                        id="employeeCount" 
                        [(ngModel)]="factory.employeeCount" 
                        name="employeeCount" 
                        required
                        [min]="1"
                        [max]="10000"
                        #employeeCount="ngModel"
                        class="w-full"
                    />
                    @if (employeeCount.invalid && (employeeCount.dirty || employeeCount.touched)) {
                        <small class="error-text">
                            @if (employeeCount.errors?.['required']) {<span>Employee count is required.</span>}
                            @if (employeeCount.errors?.['min']) {<span>Employee count must be at least 1.</span>}
                            @if (employeeCount.errors?.['max']) {<span>Employee count cannot exceed 10000.</span>}
                        </small>
                    }
                </div>

                <div class="field mt-4">
                    <label for="establishedYear" class="block mb-2">* Established Year</label>
                    <p-inputNumber 
                        id="establishedYear" 
                        [(ngModel)]="factory.establishedYear" 
                        name="establishedYear" 
                        required
                        [min]="1900"
                        [max]="2026"
                        #establishedYear="ngModel"
                        class="w-full"
                    />
                    @if (establishedYear.invalid && (establishedYear.dirty || establishedYear.touched)) {
                        <small class="error-text">
                            @if (establishedYear.errors?.['required']) {<span>Established year is required.</span>}
                            @if (establishedYear.errors?.['min']) {<span>Year must be 1900 or later.</span>}
                            @if (establishedYear.errors?.['max']) {<span>Year cannot exceed 2026.</span>}
                        </small>
                    }
                </div>

            </form>

            <ng-template pTemplate="footer">
                <p-button label="Cancel" icon="pi pi-times" (click)="close()" />
                <p-button label="Confirm" icon="pi pi-check" (click)="confirm()" [disabled]="!addForm.form.valid" />
            </ng-template>
        </p-dialog>
    `
})
export class FactoryAddDialogComponent implements OnInit, OnChanges {
    private factoryService = inject(FactoryService);
    
    @Input() visible: boolean = false;
    @ViewChild('addForm') addForm: any;
    @Input() factory: Factory = this.createEmptyFactory();
    
    @Output() visibleChange = new EventEmitter<boolean>();
    @Output() confirmed = new EventEmitter<Factory>();

    locations: { label: string; value: string }[] = [];
    statusOptions = [
        { label: 'Active', value: 'active' },
        { label: 'Maintenance', value: 'maintenance' },
        { label: 'Inactive', value: 'inactive' }
    ];

    private createEmptyFactory(): Factory {
        return {
            id: 0,
            name: '',
            location: '',
            status: '',
            employeeCount: 0,
            establishedYear: new Date().getFullYear(),
            verified: false
        };
    }

    ngOnInit() {
        this.locations = this.factoryService.getRegions().map(r => ({ label: r.name, value: r.name }));
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['visible']?.currentValue) {
            this.resetForm();
        }
    }

    private resetForm() {
        this.factory = this.createEmptyFactory();
        Promise.resolve().then(() => {
            if (this.addForm) {
                this.addForm.reset();
            }
        });
    }

    close() {
        this.visibleChange.emit(false);
    }

    confirm() {
        this.confirmed.emit({ ...this.factory });
        this.visibleChange.emit(false);
    }
}