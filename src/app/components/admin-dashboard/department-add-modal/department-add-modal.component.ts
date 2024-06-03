import { Component, Input, Output, EventEmitter } from '@angular/core';
import Swal from 'sweetalert2';
import { IDepartment } from '../../../models/admin-models/idepartment';
import { DepartmentService } from '../../../services/admin-services/department.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-department-add-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './department-add-modal.component.html',
  styleUrls: ['./department-add-modal.component.css']
})
export class DepartmentAddModalComponent {
  @Input() selectedDepartment: IDepartment = { id: 0, name: '' };
  @Input() departments: IDepartment[] = [];
  @Output() departmentSaved = new EventEmitter<IDepartment>();

  constructor(private departmentService: DepartmentService) {}

  saveDepartment() {
    if (this.selectedDepartment.id === 0) {
      this.departmentService.createDepartment(this.selectedDepartment).subscribe({
        next: () => {
          Swal.fire('Success!', 'Department created successfully.', 'success');
          this.departmentSaved.emit(this.selectedDepartment);
          this.hideModal();
        },
        error: (error) => {
          Swal.fire('Error!', error.message, 'error');
        },
      });
    } else {
      this.departmentService.updateDepartment(this.selectedDepartment.id, this.selectedDepartment).subscribe({
        next: () => {
          Swal.fire('Success!', 'Department updated successfully.', 'success');
          this.departmentSaved.emit(this.selectedDepartment);
          this.hideModal();
        },
        error: (error) => {
          Swal.fire('Error!', error.message, 'error');
        },
      });
    }
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
