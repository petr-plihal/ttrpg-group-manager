import { Component, inject, Input } from '@angular/core';
import { User } from '../user';
import { Tag } from '../tag';
import { TagsService } from '../tags.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-player-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './player-item.component.html',
  styleUrl: './player-item.component.css'
})
export class PlayerItemComponent {
  @Input() user!: User;
  
    avoidTags: Tag[] = []
    lookingTags: Tag[] = []
  
    description?: string = ''
    profPic:string = './crow.jpg'
  
    tagService: TagsService = inject(TagsService);
    ngOnInit() {
      this.description = this.user.description?.substring(0,50)
      this.profPic = this.user.profilepicture!.replace('<URL>','.')
      console.log(this.user.profilepicture)
      if(this.description?.length ?? 0 >= 49){
        this.description?.concat('...')
      }
      this.tagService.getUserLookingTags(this.user.id).subscribe(tags => {
        for(let i = 0; i < tags.data.length; i++){
            this.lookingTags.push({
              name: tags.data[i].fields.name
            }
          )
        }
      })
      this.tagService.getUserAvoidTags(this.user.id).subscribe(tags => {
        for(let i = 0; i < tags.data.length; i++){
            this.avoidTags.push({
              name: tags.data[i].fields.name
            }
          )
        }
      }) 
    }
}
