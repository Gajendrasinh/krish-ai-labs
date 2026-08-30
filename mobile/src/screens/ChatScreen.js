import { useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { CHAT_ENDPOINT } from '../config';
import { theme } from '../theme';

/**
 * Same contract as the website's ChatWidget (site/src/components/ChatWidget.jsx):
 *
 *   POST {CHAT_ENDPOINT}
 *   Request  { message, history: { role: 'user'|'assistant', content }[] }
 *   Response { reply, sources?, mode? }
 *
 * See backend/README.md for the server this talks to.
 */

const WELCOME_MESSAGE = {
  id: 'welcome',
  role: 'assistant',
  content:
    "Hi! I'm the Krish AI Labs assistant. Ask me about our services, past projects, or how to get a quote.",
};

const FALLBACK_MESSAGE =
  "I can't reach the assistant backend right now. Double-check EXPO_PUBLIC_API_URL, or reach us at hello@krishailabs.com in the meantime.";

let nextId = 1;

export default function ChatScreen() {
  const [messages, setMessages] = useState([WELCOME_MESSAGE]);
  const [input, setInput] = useState('');
  const [pending, setPending] = useState(false);
  const listRef = useRef(null);

  async function sendMessage() {
    const text = input.trim();
    if (!text || pending) return;

    const history = messages.map(({ role, content }) => ({ role, content }));
    const userMessage = { id: `u${nextId++}`, role: 'user', content: text };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setPending(true);

    try {
      const res = await fetch(CHAT_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, history }),
      });
      if (!res.ok) throw new Error(`chat backend responded ${res.status}`);
      const data = await res.json();
      if (typeof data.reply !== 'string') throw new Error('malformed chat response');
      setMessages((prev) => [
        ...prev,
        { id: `a${nextId++}`, role: 'assistant', content: data.reply },
      ]);
    } catch (err) {
      console.warn('[chat] request failed:', err);
      setMessages((prev) => [
        ...prev,
        { id: `a${nextId++}`, role: 'assistant', content: FALLBACK_MESSAGE, isFallback: true },
      ]);
    } finally {
      setPending(false);
      requestAnimationFrame(() => listRef.current?.scrollToEnd({ animated: true }));
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
    >
      <LinearGradient colors={theme.gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.header}>
        <Text style={styles.headerTitle}>Krish AI Labs</Text>
        <Text style={styles.headerSubtitle}>AI Assistant</Text>
      </LinearGradient>

      <FlatList
        ref={listRef}
        style={styles.thread}
        contentContainerStyle={styles.threadContent}
        data={messages}
        keyExtractor={(m) => m.id}
        onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
        renderItem={({ item }) => (
          <View
            style={[
              styles.bubble,
              item.role === 'user' ? styles.bubbleUser : styles.bubbleAssistant,
            ]}
          >
            <Text style={item.role === 'user' ? styles.bubbleTextUser : styles.bubbleTextAssistant}>
              {item.content}
            </Text>
          </View>
        )}
        ListFooterComponent={
          pending ? (
            <View style={[styles.bubble, styles.bubbleAssistant, styles.bubblePending]}>
              <ActivityIndicator size="small" color={theme.textFaint} />
            </View>
          ) : null
        }
      />

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Ask about our services…"
          placeholderTextColor={theme.textFaint}
          editable={!pending}
          onSubmitEditing={sendMessage}
          returnKeyType="send"
        />
        <TouchableOpacity
          style={[styles.sendButton, (!input.trim() || pending) && styles.sendButtonDisabled]}
          onPress={sendMessage}
          disabled={!input.trim() || pending}
        >
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.bg,
  },
  header: {
    paddingTop: 56,
    paddingBottom: 18,
    paddingHorizontal: 20,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  headerSubtitle: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 13,
    marginTop: 2,
  },
  thread: {
    flex: 1,
  },
  threadContent: {
    padding: 16,
    gap: 10,
  },
  bubble: {
    maxWidth: '85%',
    paddingVertical: 10,
    paddingHorizontal: 13,
    borderRadius: 14,
    marginBottom: 10,
  },
  bubbleUser: {
    alignSelf: 'flex-end',
    backgroundColor: theme.violet,
    borderBottomRightRadius: 4,
  },
  bubbleAssistant: {
    alignSelf: 'flex-start',
    backgroundColor: theme.surface,
    borderWidth: 1,
    borderColor: theme.border,
    borderBottomLeftRadius: 4,
  },
  bubblePending: {
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  bubbleTextUser: {
    color: '#fff',
    fontSize: 14,
    lineHeight: 20,
  },
  bubbleTextAssistant: {
    color: theme.text,
    fontSize: 14,
    lineHeight: 20,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 8,
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: theme.border,
    backgroundColor: theme.bg,
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.borderStrong,
    backgroundColor: theme.surface,
    color: theme.text,
    fontSize: 14,
  },
  sendButton: {
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.violet,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
});
