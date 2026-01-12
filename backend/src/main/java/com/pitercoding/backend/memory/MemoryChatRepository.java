package com.pitercoding.backend.memory;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public class MemoryChatRepository {
    private  final JdbcTemplate jdbcTemplate;

    // ------ Constructor ------ //

    // Injects JdbcTemplate to execute SQL queries
    public MemoryChatRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    // ------ Methods ------ //

    // Creates a new chat entry in the CHAT_MEMORY table
    // Generates a unique conversation ID and stores user and description
    public String generateChatId(String userId, String description) {
        String conversationId = UUID.randomUUID().toString();
        final String sql = "INSERT INTO CHAT_MEMORY (conversation_id, user_id, description) VALUES (?, ?, ?)";
        jdbcTemplate.update(sql, conversationId, userId, description);
        return conversationId;
    }

    // Checks if a chat with the given conversation ID exists
    public boolean chatIdExists(String chatId) {
        String sql = "SELECT COUNT(*) FROM CHAT_MEMORY WHERE conversation_id = ?";
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class, chatId);
        return count != null && count > 0;
    }

    // Returns all chats for a specific user (id and description only)
    public List<Chat> getAllChatsForUser(String userId) {
        final String sql = "SELECT conversation_id, description FROM CHAT_MEMORY WHERE user_id = ? ORDER BY conversation_id DESC";
        return jdbcTemplate.query(sql, (rs, rowNum) -> new Chat(rs.getString("conversation_id"), rs.getString("description")), userId);
    }

    // Returns all messages for a given chat from the AI memory table
    // Messages are ordered by timestamp to preserve conversation flow
    public List<ChatMessage> getChatMessages(String chatId) {
        String sql = "SELECT content, type FROM SPRING_AI_CHAT_MEMORY WHERE conversation_id = ? ORDER BY timestamp ASC";
        return jdbcTemplate.query(sql, (rs, rowNum) -> new ChatMessage(rs.getString("content"), rs.getString("type")), chatId);
    }

}
