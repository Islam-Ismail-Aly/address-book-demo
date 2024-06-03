import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { IJob } from '../../../models/admin-models/ijob';
import { JobService } from '../../../services/admin-services/job.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { JobAddModalComponent } from '../job-add-modal/job-add-modal.component';

@Component({
  selector: 'app-job',
  standalone: true,
  imports: [CommonModule, FormsModule, JobAddModalComponent],
  templateUrl: './job.component.html',
  styleUrls: ['./job.component.css']
})
export class JobComponent implements OnInit, OnDestroy {

  jobs: IJob[] = [];
  private jobSubscription!: Subscription;
  selectedJob: IJob = this.initializeJob();

  constructor(private jobService: JobService, private router: Router) {}

  ngOnInit() {
    this.loadJobs();
  }

  ngOnDestroy(): void {
    if (this.jobSubscription) {
      this.jobSubscription.unsubscribe();
    }
  }

  protected initializeJob(): IJob {
    return {
      id: 0,
      title: '',
    };
  }

  loadJobs():void {
    this.jobSubscription = this.jobService.getAllJobs().subscribe({
      next: (response: any) => {
        if (response.success && Array.isArray(response.data)) {
          this.jobs = response.data;
          console.log('Jobs loaded:', this.jobs);
        } else {
          console.error('Failed to load jobs:', response.message);
        }
      },
      error: (error) => {
        Swal.fire(
          'Error!',
          error.message,
          'error'
        );
      },
    });
  }

  addJob() {
    this.selectedJob = this.initializeJob();
    this.showModal();
  }

  editJob(job: IJob) {
    this.selectedJob = { ...job };
    this.showModal();
  }

  saveJob(job: IJob) {
    if (job.id === 0) {
      this.jobService.createJob(job).subscribe({
        next: () => {
          Swal.fire('Success!', 'Job created successfully.', 'success');
          this.loadJobs();
        },
        error: (error) => {
          Swal.fire('Error!', error.message, 'error');
        },
      });
    } else {
      this.jobService.updateJob(job.id, job).subscribe({
        next: () => {
          Swal.fire('Success!', 'Job updated successfully.', 'success');
          this.loadJobs();
        },
        error: (error) => {
          Swal.fire('Error!', error.message, 'error');
        },
      });
    }
  }

  deleteJob(id: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this job entry!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.isConfirmed) {
        this.jobService.deleteJob(id).subscribe({
          next: () => {
            Swal.fire('Deleted!', 'Job entry has been deleted.', 'success');
            this.loadJobs();
          },
          error: (error) => {
            Swal.fire('Error!', error.message, 'error');
          },
        });
      }
    });
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
