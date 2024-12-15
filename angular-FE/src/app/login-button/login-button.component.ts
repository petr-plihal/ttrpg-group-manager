import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginButton } from '../login-button';

@Component({
  selector: 'app-login-button',
  standalone: true,
  imports: [],
  templateUrl: './login-button.component.html',
  styleUrl: './login-button.component.css'
})
export class LoginButtonComponent {
  @Input() loginButton!: LoginButton;

  imageUrl:string = '';

  ngOnInit(){
    this.imageUrl = this.loginButton.imageurl?.replace('<URL>','.') ?? '';
  }
}
