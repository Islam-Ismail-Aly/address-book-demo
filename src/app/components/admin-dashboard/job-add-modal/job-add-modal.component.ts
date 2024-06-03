import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IJob } from '../../../models/admin-models/ijob';
import { JobService } from '../../../services/admin-services/job.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-job-add-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './job-add-modal.component.html',
  styleUrl: './job-add-modal.component.css'
})
export class JobAddModalComponent {
  @Input() selectedJob : IJob = { id: 0, title: '' };
  @Input() jobs: IJob[] = [];
  @Output() JobSaved = new EventEmitter<IJob>();

  constructor(private jobService: JobService) {}


  saveJob() {
    if (this.selectedJob.id === 0) {
      this.jobService.createJob(this.selectedJob).subscribe({
        next: () => {
          Swal.fire('Success!', 'Job Title created successfully.', 'success');
          this.JobSaved.emit(this.selectedJob);
          this.hideModal();
        },
        error: (error) => {
          Swal.fire('Error!', error.message, 'error');
        },
      });
    } else {
      this.jobService.updateJob(this.selectedJob.id, this.selectedJob).subscribe({
        next: () => {
          Swal.fire('Success!', 'Department updated successfully.', 'success');
          this.JobSaved.emit(this.selectedJob);
          this.hideModal();
        },
        error: (error) => {
          Swal.fire('Error!', error.message, 'error');
        },
      });
    }
  }

  showModal() {
    const modal = document.getElementById('jobModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
      modal.setAttribute('aria-modal', 'true');
      modal.removeAttribute('aria-hidden');
    }
  }

  hideModal() {
    const modal = document.getElementById('jobModal');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
      modal.removeAttribute('aria-modal');
      modal.setAttribute('aria-hidden', 'true');
    }
  }
}
