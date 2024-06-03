import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import { AddressBookService } from '../../../services/admin-services/address-book.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { IAddressBook } from '../../../models/admin-models/iaddress-book';
import { IDepartment } from '../../../models/admin-models/idepartment';
import { IJob } from '../../../models/admin-models/ijob';
import { DepartmentService } from '../../../services/admin-services/department.service';
import { JobService } from '../../../services/admin-services/job.service';
import { Cloudinary } from 'cloudinary-core';

@Component({
  selector: 'app-address-book',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './address-book.component.html',
  styleUrls: ['./address-book.component.css']
})
export class AddressBookComponent implements OnInit, OnDestroy {
  addressBooks: IAddressBook[] = [];
  departments: IDepartment[] = [];
  jobs: IJob[] = [];
  addressBookForm: FormGroup;
  private userSubscription!: Subscription;

  startDate: any;
  endDate: any;

  selectedAddressBook: IAddressBook = this.initializeAddressBook();

  constructor(
    private addressBookService: AddressBookService,
    private departmentService: DepartmentService,
    private jobService: JobService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.startDate = null;
    this.endDate = null;

    this.addressBookForm = this.fb.group({
      id: [0],
      fullName: ['', Validators.required],
      jobTitle: ['', Validators.required],
      department: ['', Validators.required],
      mobileNumber: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      dateOfBirth: [new Date().toISOString(), Validators.required],
      address: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      photo: [''],
      age: [0],
      createdOn: [new Date().toISOString()],
      imageUrl: [''] // Add this line
    });
  }

  ngOnInit() {
    this.loadAddressBooks();
    this.loadDepartments();
    this.loadJobs();
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  protected initializeAddressBook(): IAddressBook {
    return {
      id: 0,
      fullName: '',
      jobTitle: '',
      department: '',
      mobileNumber: '',
      dateOfBirth: new Date().toISOString(),
      address: '',
      email: '',
      photo: '',
      age: 0,
      createdOn: new Date().toISOString()
    };
  }

  applyDateFilter() {
    if (this.startDate && this.endDate) {
      this.userSubscription = this.addressBookService.getAllAddressBooks(this.startDate, this.endDate).subscribe({
        next: (response: any) => {
          this.addressBooks = response.data;
        },
        error: (error) => {
          console.error('Failed to load filtered address books:', error);
        },
      });
    } else {
      console.warn('Start date and end date must be set');
    }
  }

  loadAddressBooks() {
    this.userSubscription = this.addressBookService.getAllAddressBooks().subscribe({
      next: (response: any) => {
        if (response.success && Array.isArray(response.data)) {
          this.addressBooks = response.data;
          console.log('addressBooks loaded:', this.addressBooks);
        } else {
          console.error('Failed to load address books:', response.message);
        }
      },
      error: (error) => {
        Swal.fire('Error!', error.message, 'error');
      },
    });
  }

  loadDepartments() {
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

  loadJobs() {
    this.userSubscription = this.jobService.getAllJobs().subscribe({
      next: (response: any) => {
        if (response.success && Array.isArray(response.data)) {
          this.jobs = response.data;
          console.log('jobs loaded:', this.jobs);
        } else {
          console.error('Failed to load jobs:', response.message);
        }
      },
      error: (error) => {
        Swal.fire('Error!', error.message, 'error');
      },
    });
  }

  addAddressBook() {
    this.selectedAddressBook = this.initializeAddressBook();
    this.addressBookForm.reset(this.selectedAddressBook);
    this.showModal();
  }

  editAddressBook(addressBook: IAddressBook) {
    this.selectedAddressBook = { ...addressBook };
    this.addressBookForm.patchValue(this.selectedAddressBook);
    this.showModal();
  }

  saveAddressBook() {
    if (this.addressBookForm.valid) {
      const formValue = this.addressBookForm.value;

      if (formValue.id === 0) {
        this.addressBookService.createAddressBook(formValue).subscribe({
          next: () => {
            Swal.fire('Success!', 'Address book entry created successfully.', 'success');
            this.loadAddressBooks();
          },
          error: (error) => {
            Swal.fire('Error!', error.message, 'error');
          },
        });
      } else {
        this.addressBookService.updateAddressBook(formValue.id, formValue).subscribe({
          next: () => {
            Swal.fire('Success!', 'Address book entry updated successfully.', 'success');
            this.loadAddressBooks();
          },
          error: (error) => {
            Swal.fire('Error!', error.message, 'error');
          },
        });
      }
      this.hideModal();
      this.selectedAddressBook = this.initializeAddressBook();
      this.addressBookForm.reset(this.selectedAddressBook); // Reset form after saving
    } else {
      Swal.fire('Error!', 'Please fill all required fields correctly.', 'error');
    }
  }

  deleteAddressBook(id: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this address book entry!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.isConfirmed) {
        this.addressBookService.deleteAddressBook(id).subscribe({
          next: () => {
            Swal.fire('Deleted!', 'Address book entry has been deleted.', 'success');
            this.loadAddressBooks();
          },
          error: (error) => {
            Swal.fire('Error!', error.message, 'error');
          },
        });
      }
    });
  }

  exportToExcel(): void {
    // Assuming addressBooks is the array you want to export
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.addressBooks);
  
    // Create a new workbook and add the worksheet
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'AddressBooks');
  
    // Save to file
    XLSX.writeFile(wb, 'AddressBookData.xlsx');
  }
  
  onFileChange(event: any) {
    const file = event.target.files[0];
    console.log('file', file);
    console.log('file name', file.name);

    if (file) {
      this.uploadImageToCloudinary(file);
    }
  }

  private uploadImageToCloudinary(file: File) {
    const cloudinary = new Cloudinary({
      cloud: {
        cloudName: 'dxvxieh27',
        apiKey: '572837555842738',
        apiSecret: 'TNfVVaCRee5GWx4k_kP4uYFOsQE'
      }
    });
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'IslamCloudy');
  
    fetch(`https://api.cloudinary.com/v1_1/dxvxieh27/image/upload`, {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          console.error('Cloudinary error:', data.error.message);
        } else {
          this.addressBookForm.get('imageUrl')?.setValue(data.secure_url);
          console.log('Cloudinary response', JSON.stringify(data, null, 2));
        }
      })
      .catch((error) => {
        console.error('Error uploading image:', error);
      });
  }

  showModal() {
    const modal = document.getElementById('addressBookModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
      modal.setAttribute('aria-modal', 'true');
      modal.removeAttribute('aria-hidden');
    }
  }

  hideModal() {
    const modal = document.getElementById('addressBookModal');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
      modal.setAttribute('aria-hidden', 'true');
      modal.removeAttribute('aria-modal');
    }
  }
}
