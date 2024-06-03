import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SidebarService } from '../../../services/sidebar.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit {

  isSidebarOpen: boolean = false;

  constructor(private sidebarService: SidebarService) {}

  ngOnInit(): void {
    // this.sidebarService.sidebarOpen$.subscribe(isOpen => {
    //   this.isSidebarOpen = isOpen;
    // });
  }
}
