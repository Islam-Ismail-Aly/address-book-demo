import { Component, OnDestroy, OnInit } from '@angular/core';
import { IDepartment } from '../../../models/admin-models/idepartment';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { DepartmentService } from '../../../services/admin-services/department.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DepartmentAddModalComponent } from '../department-add-modal/department-add-modal.component';

@Component({
  selector: 'app-department',
  standalone: true,
  imports: [CommonModule, FormsModule, DepartmentAddModalComponent],
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.css']
})
export class DepartmentComponent implements OnInit, OnDestroy {
  departments: IDepartment[] = [];
  private userSubscription!: Subscription;
  selectedDepartment: IDepartment = this.initializeDepartment();

  constructor(private departmentService: DepartmentService, private router: Router) {}

  ngOnInit() {
    this.loadDepartments();
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  protected initializeDepartment(): IDepartment {
    return { 
      id: 0, 
      name: '' 
    };
  }

  loadDepartments(): void {
    this.userSubscription = this.departmentService.getAllDepartments().subscribe({
      next: (response: any) => {
        if (response.success && Array.isArray(response.data)) {
          this.departments = response.data;
          console.log('departments loaded:', this.departments);
        } else {
          console.error('Failed to load departments:', response.message);
        }
      },
      error: (error) => {
        Swal.fire('Error!', error.message, 'error');
      },
    });
  }

  addDepartment() {
    this.selectedDepartment = this.initializeDepartment();
    this.showModal();
  }

  editDepartment(department: IDepartment) {
    this.selectedDepartment = { ...department };
    this.showModal();
  }

  saveDepartment(department: IDepartment) {
    if (department.id === 0) {
      this.departmentService.createDepartment(department).subscribe({
        next: () => {
          Swal.fire('Success!', 'Department created successfully.', 'success');
          this.loadDepartments();
        },
        error: (error) => {
          Swal.fire('Error!', error.message, 'error');
        },
      });
    } else {
      this.departmentService.updateDepartment(department.id, department).subscribe({
        next: () => {
          Swal.fire('Success!', 'Department updated successfully.', 'success');
          this.loadDepartments();
        },
        error: (error) => {
          Swal.fire('Error!', error.message, 'error');
        },
      });
    }
  }

  deleteDepartment(id: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this department!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.isConfirmed) {
        this.departmentService.deleteDepartment(id).subscribe({
          next: () => {
            Swal.fire('Deleted!', 'Department has been deleted.', 'success');
            this.loadDepartments();
          },
          error: (error) => {
            Swal.fire('Error!', error.message, 'error');
          },
        });
      }
    });
  }

  showModal() {
    const modal = document.getElementById('departmentModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
      modal.setAttribute('aria-modal', 'true');
      modal.removeAttribute('aria-hidden');
    }
  }

  hideModal() {
    const modal = document.getElementById('departmentModal');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
      modal.removeAttribute('aria-modal');
      modal.setAttribute('aria-hidden', 'true');
    }
  }
}
