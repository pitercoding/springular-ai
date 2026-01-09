import { Component, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-simple-chat',
  imports: [MatCardModule, MatToolbarModule, MatInputModule, MatButtonModule, MatIconModule, FormsModule, NgClass],
  templateUrl: './simple-chat.html',
  styleUrl: './simple-chat.scss',
})
export class SimpleChat {

  userPrompt = '';

  messages = signal([
    { text: 'Hello, how can I help you today?', isBot: true }
  ]);

  sendMessage(){
    this.trimUserPrompt();
    if (this.userPrompt !== '') {
      this.updateMessages(this.userPrompt);
      this.userPrompt = '';
      this.simulateResponse();
    }
  }

  private updateMessages(text: string, isBot = false) {
    this.messages.update(messages => [...messages, {text: text, isBot: isBot }]);
  }

  private trimUserPrompt(): void {
    this.userPrompt = this.userPrompt.trim();
  }

  private simulateResponse(): void {
    setTimeout(() => {
      const response = 'This is a simulated response from Springular AI';
      this.updateMessages(response, true);
    }, 2000)
  }

}
