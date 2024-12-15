import { Component } from '@angular/core';
import { MenuComponent } from '../menu/menu.component';
import { Comment } from '@angular/compiler';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-application-detail',
  standalone: true,
  imports: [MenuComponent, CommonModule],
  templateUrl: './application-detail.component.html',
  styleUrl: './application-detail.component.css'
})
export class ApplicationDetailComponent {

}
