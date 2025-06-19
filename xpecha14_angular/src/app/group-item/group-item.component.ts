import { Component, inject, Input } from '@angular/core';
import { Group } from '../group';
import { CommonModule } from '@angular/common';
import { Tag } from '../tag';
import { TagsService } from '../tags.service';

@Component({
  selector: 'app-group-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './group-item.component.html',
  styleUrl: './group-item.component.css'
})
export class GroupItemComponent {
  @Input() group!: Group;

  tags: Tag[] = []

  description?: string = ''

  tagService: TagsService = inject(TagsService);
  ngOnInit() {
    this.description = this.group.description?.substring(0,50)
    if(this.description?.length ?? 0 >= 49){
      this.description?.concat('...')
    }
    this.tagService.getGroupTags(this.group.id).subscribe(tags => {
      for(let i = 0; i < tags.data.length; i++){
          this.tags.push({
            name: tags.data[i].fields.name
          }
        )
      }
    })  
  }
}
