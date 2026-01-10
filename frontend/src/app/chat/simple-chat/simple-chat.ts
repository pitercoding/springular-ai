import { Component, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';
import { ChatService } from '../chat-service';
import { catchError, throwError } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-simple-chat',
  imports: [MatCardModule, MatToolbarModule, MatInputModule, MatButtonModule, MatIconModule, FormsModule, NgClass],
  templateUrl: './simple-chat.html',
  styleUrl: './simple-chat.scss',
})
export class SimpleChat {

  @ViewChild('chatHistory')
  private chatHistory!: ElementRef;

  private chatService = inject(ChatService);

  userPrompt = '';
  isLoading = false;

  local = false;

  messages = signal([
    { text: 'Hello, how can I help you today?', isBot: true }
  ]);

  sendMessage(){
    this.trimUserPrompt();
    if (this.userPrompt !== '' && !this.isLoading) {
      this.updateMessages(this.userPrompt);
      this.isLoading = true;
      if (this.local) {
        this.simulateResponse();
      } else {
        this.sendChatMessage();
      }
    }
  }

  private sendChatMessage() {
    this.chatService.sendChatMessage(this.userPrompt)
    .pipe(catchError(() => {
      this.updateMessages("Sorry, I am unable to process your request at the moment.", true);
      this.isLoading = false;
      return throwError(() => new Error("Error occurred while sending message"));
    }))
    .subscribe(response => {
      this.updateMessages(response.message, true);
      this.userPrompt = '';
      this.isLoading = false;
    });
  }

  private updateMessages(text: string, isBot = false) {
    this.messages.update(messages => [...messages, {text: text, isBot: isBot }]);
    this.scrollToBottom();
  }

  private trimUserPrompt(): void {
    this.userPrompt = this.userPrompt.trim();
  }

  private simulateResponse(): void {
    setTimeout(() => {
      const response = 'This is a simulated response from Springular AI';
      this.updateMessages(response, true);
      this.userPrompt = '';
      this.isLoading =  false;
    }, 2000)
  }

  private scrollToBottom(): void {
    try {
      this.chatHistory.nativeElement.scrollTop = this.chatHistory.nativeElement.scrollHeight;
    } catch (error) {

    }
  }

}
