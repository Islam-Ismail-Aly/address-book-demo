import { Routes } from '@angular/router';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { authRouteGuard } from './Authentication/auth-route.guard';
import { DashboardContentComponent } from './components/admin-dashboard/dashboard-content/dashboard-content.component';
import { UsersComponent } from './components/admin-dashboard/users/users.component';
import { NotfoundComponent } from './components/admin-dashboard/notfound/notfound.component';
import { LoginComponent } from './components/admin-dashboard/login/login.component';
import { RegisterComponent } from './components/admin-dashboard/register/register.component';
import { DepartmentComponent } from './components/admin-dashboard/department/department.component';
import { JobComponent } from './components/admin-dashboard/job/job.component';
import { AddressBookComponent } from './components/admin-dashboard/address-book/address-book.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent,
    title: 'Login',
    canActivate: [authRouteGuard]
  },
  {
    path: 'register',
    component: RegisterComponent,
    title: 'Register',
    canActivate: [authRouteGuard]
  },
  {
    path: 'admin',
    component: AdminDashboardComponent,
    title: 'Admin Dashboard',
    // canActivate: [authRouteGuard], // Uncomment if you want to protect the admin route
    // data: { admin: true },
    children: [
      // Admin routes
      // { path: '', redirectTo: 'dashboard', pathMatch: 'full' }, // Redirect to dashboard by default
      { path: 'dashboard', component: DashboardContentComponent, title: 'Dashboard' },
      { path: 'users', component: UsersComponent, title: 'Users' },
      { path: 'addressBook', component: AddressBookComponent, title: 'Address Book' },
      { path: 'departments', component: DepartmentComponent, title: 'Departments' },
      { path: 'jobs', component: JobComponent, title: 'Jobs' }
    ]
  },
  { path: '**', component: NotfoundComponent, title: 'NotFound' }
];
