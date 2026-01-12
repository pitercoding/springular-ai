package com.pitercoding.backend.memory;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.client.advisor.MessageChatMemoryAdvisor;
import org.springframework.ai.chat.client.advisor.SimpleLoggerAdvisor;
import org.springframework.ai.chat.memory.ChatMemory;
import org.springframework.ai.chat.memory.MessageWindowChatMemory;
import org.springframework.ai.chat.memory.repository.jdbc.JdbcChatMemoryRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MemoryChatService {

    private final ChatClient chatClient;
    private MemoryChatRepository memoryChatRepository;

    // Default user ID used to associate chats (temporary / single-user setup)
    private static final String DEFAULT_USER_ID = "piter";

    // Prompt used to generate a short description for a new chat
    private final String DESCRIPTION_PROMOPT = "Generate a chat description based on the message, limiting the description to 30 characters: ";

    // ------ Constructor ------ //

    // Configures ChatClient with chat memory and logging
    public MemoryChatService(
            ChatClient.Builder chatClientBuilder,
            JdbcChatMemoryRepository jdbcChatMemoryRepository,
            MemoryChatRepository memoryChatRepository
    ) {
        this.memoryChatRepository = memoryChatRepository;

        // Creates a chat memory window that keeps the last 10 messages
        ChatMemory chatMemory = MessageWindowChatMemory.builder()
                .chatMemoryRepository(jdbcChatMemoryRepository)
                .maxMessages(10)
                .build();

        // Builds the ChatClient with memory and logging advisors
        this.chatClient = chatClientBuilder
                .defaultAdvisors(
                        MessageChatMemoryAdvisor.builder(chatMemory)
                                .build(),
                        new SimpleLoggerAdvisor()
                )
                .build();
    }

    // ------ Methods ------ //

    //// Creates a new chat with an auto-generated description
    public String createChat(String message) {
        String description = this.generateDescription(message);
        return this.memoryChatRepository.generateChatId(DEFAULT_USER_ID, description);
    }

    // Creates a new chat and immediately sends the first message
    // Returns the chat ID, assistant response, and generated description
    public ChatStartResponse createChatWithResponse(String message) {
        String description = this.generateDescription(message);
        String chatId = this.memoryChatRepository.generateChatId(DEFAULT_USER_ID, description);
        String response = this.chat(chatId, message);
        return new ChatStartResponse(chatId, response, description);
    }

    // Returns all chats associated with the default user
    public List<Chat> getAllChats() {
        return this.memoryChatRepository.getAllChatsForUser(DEFAULT_USER_ID);
    }

    // Returns all messages from a specific chat
    public List<ChatMessage> getChatMessages(String chatId) {
        return this.memoryChatRepository.getChatMessages(chatId);
    }

    // Sends a message to the assistant using the given chat memory
    // Validates if the chat exists before sending the message
    public String chat(String chatId, String message) {
        if (!this.memoryChatRepository.chatIdExists(chatId)) {
            throw new IllegalArgumentException("Chat ID does not exist: " + chatId);
        }

        return this.chatClient.prompt()
                .user(message)
                .advisors(a -> a.param(ChatMemory.CONVERSATION_ID, chatId))
                .call()
                .content();
    }

    // Generates a short description for a chat based on the first message
    private String generateDescription(String message) {
        return this.chatClient.prompt()
                .user(DESCRIPTION_PROMOPT + message)
                .call()
                .content();
    }
}
