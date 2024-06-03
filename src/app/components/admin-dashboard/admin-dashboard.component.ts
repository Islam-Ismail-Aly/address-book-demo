import { Component, OnDestroy } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { FooterComponent } from './footer/footer.component';
import { DashboardContentComponent } from './dashboard-content/dashboard-content.component';
import { RouterOutlet } from '@angular/router';
import { UsersComponent } from './users/users.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [SidebarComponent,HeaderComponent,FooterComponent, RouterOutlet],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent {
  

}
