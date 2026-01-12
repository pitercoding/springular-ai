import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ChatResponse } from './chat-response';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private readonly API = '/api/chat-memory';

  private http = inject(HttpClient);

  sendChatMessage(message: string): Observable<ChatResponse> {
    return this.http.post<ChatResponse>(this.API, { message });
  }
}
