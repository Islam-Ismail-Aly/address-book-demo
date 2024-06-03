import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../Authentication/auth.service';
import { Router } from '@angular/router';
import { SidebarService } from '../../../services/sidebar.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  userName: string | null = '';
  role: string | null = '';
  isSidebarOpen: boolean = false;

  constructor(private _router: Router, 
              private _authService: AuthService, 
              private _sidebarService: SidebarService)
  {    
  }

  toggleSidebar(): void {
    this._sidebarService.toggleSidebar();
  }

  logout() {
    this._authService.Logout();
    this._router.navigate(['/login']);
    window.location.reload();
  }

}
