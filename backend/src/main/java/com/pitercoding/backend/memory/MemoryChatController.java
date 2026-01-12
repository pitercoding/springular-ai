package com.pitercoding.backend.memory;

import com.pitercoding.backend.chat.ChatRequest;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chat-memory")
public class MemoryChatController {

    private final MemoryChatService memoryChatService;

    // ------ Constructor ------ //
    public  MemoryChatController(MemoryChatService chatService) {
        this.memoryChatService = chatService;
    }

    // ------ Endpoints ------ //

    // Returns all chats (conversation ids and descriptions) for the default user
    @GetMapping
    public List<Chat> getAllChats() {
        return this.memoryChatService.getAllChats();
    }

    // Returns all messages of a specific chat ordered by time
    @GetMapping("/{chatId}")
    public List<ChatMessage> getChatMessages(@PathVariable String chatId) {
        return this.memoryChatService.getChatMessages(chatId);
    }

    // Starts a new chat:
    // - generates a description
    // - creates a new chat id
    // - sends the first message and returns the AI response
    @PostMapping("/start")
    public ChatStartResponse startNewChat(@RequestBody ChatRequest request) {
        return this.memoryChatService.createChatWithResponse(request.message());
    }

    // Sends a message to an existing chat and returns the assistant response
    @PostMapping("/{chatId}")
    public ChatMessage chatMemory(@PathVariable String chatId, @RequestBody ChatRequest request) {
        return new ChatMessage(this.memoryChatService.chat(chatId, request.message()), "ASSISTANT");
    }
}
