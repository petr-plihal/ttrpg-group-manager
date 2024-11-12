import { Component, Input } from '@angular/core';
import { Group } from '../group';

@Component({
  selector: 'app-group-item',
  standalone: true,
  imports: [],
  templateUrl: './group-item.component.html',
  styleUrl: './group-item.component.css'
})
export class GroupItemComponent {
  @Input() group!: Group;
}
