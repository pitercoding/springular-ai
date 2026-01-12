import { ChangeDetectionStrategy, Component, computed, effect, ElementRef, inject, signal, viewChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';
import { ChatService } from '../chat-service';
import { catchError, of, throwError } from 'rxjs';
import { ChatResponse } from '../chat-response';
import { LoggingService } from '../../shared/logging.service';

const MAX_MESSAGE_LENGTH = 2000;

@Component({
  standalone: true,
  selector: 'app-simple-chat',
  imports: [MatCardModule, MatToolbarModule, MatInputModule, MatButtonModule, MatIconModule, FormsModule],
  templateUrl: './simple-chat.html',
  styleUrl: './simple-chat.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SimpleChat {

  private readonly chatHistory = viewChild.required<ElementRef>('chatHistory');

  private readonly chatService = inject(ChatService);
  private readonly logger = inject(LoggingService);

  private readonly local = false;

  readonly MAX_LENGTH = MAX_MESSAGE_LENGTH;

  userPrompt =  signal('');
  isLoading = false;

  messages = signal<ChatResponse[]>([
    { message: 'Hello, how can I help you today?', isBot: true },
  ]);

  // Computed validation state
  readonly validationError = computed(() => {
    const input = this.userPrompt().trim();
    if (input.length === 0) {
      return null; // No error for empty input
    }
    if (input.length > MAX_MESSAGE_LENGTH) {
      return `Message is too long (${input.length}/${MAX_MESSAGE_LENGTH} characters)`;
    }
    return null;
  });

  readonly canSend = computed(() => {
    const input = this.userPrompt().trim();
    return input.length > 0 &&
          input.length <= MAX_MESSAGE_LENGTH &&
          !this.isLoading;
  });

  // Effect to auto-scroll when messages change
  private readonly autoScrollEffect = effect(() => {
    this.messages(); // Read the signal to track changes
    setTimeout(() => this.scrollToBottom(), 0); // Use setTimeout to ensure DOM is updated
  });

  sendMessage(): void {
    if (!this.canSend()) {
      return;
    }

    const sanitizedInput = this.sanitizeInput(this.userPrompt().trim());

    this.updateMessages(sanitizedInput);
    this.isLoading = true;

    if (this.local) {
      this.simulateResponse();
    } else {
      this.sendChatMessage(sanitizedInput);
    }
  }  private sanitizeInput(input: string): string {
    // Remove any potential script tags and sanitize the input
    return input
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<[^>]+>/g, '')
      .trim();
  }

  private updateMessages(message: string, isBot = false): void {
    this.messages.update(messages => [...messages, { message, isBot }]);
  }

  private getResponse(): void {
    setTimeout(() => {
      const response = 'This is a simulated response from the AI model.';
      this.updateMessages(response, true);
      this.isLoading = false;
    }, 2000);
  }

  private simulateResponse(): void {
    this.getResponse();
    this.userPrompt.set('');
  }

  private scrollToBottom(): void {
    try {
      const chatElement = this.chatHistory();
      if (chatElement?.nativeElement) {
        chatElement.nativeElement.scrollTop = chatElement.nativeElement.scrollHeight;
      }
    } catch (err) {
      this.logger.error('Failed to scroll chat history', err);
    }
  }

  private sendChatMessage(message: string): void {
    this.chatService.sendChatMessage(message)
    .pipe(
      catchError(() => {
        this.updateMessages('Sorry, I am unable to process your request at the moment.', true);
        this.isLoading = false;
        return of();
      })
    )
    .subscribe((response: ChatResponse) => {
      if (response) {
        this.updateMessages(response.message, true);
      }
      this.userPrompt.set('');
      this.isLoading = false;
    });
  }
}
