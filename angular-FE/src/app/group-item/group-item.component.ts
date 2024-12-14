import { Component, Input } from '@angular/core';
import { Group } from '../group';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-group-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './group-item.component.html',
  styleUrl: './group-item.component.css'
})
export class GroupItemComponent {
  @Input() group!: Group;
}
