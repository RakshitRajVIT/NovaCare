import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Mic, MicOff, Bot, User, Volume2, VolumeX } from 'lucide-react';
import { useChat } from '@/hooks/useChat';
import { useSpeechSynthesis } from '@/hooks/useSpeechSynthesis';
import ReactMarkdown from 'react-markdown';

interface ChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onVoiceStart?: () => void;
  onVoiceStop?: () => void;
  isListening?: boolean;
}

const ChatPanel = ({ 
  isOpen, 
  onClose, 
  onVoiceStart, 
  onVoiceStop,
  isListening = false 
}: ChatPanelProps) => {
  const [inputValue, setInputValue] = useState('');
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const { messages, isTyping, sendMessage } = useChat();
  const { speak, stop, isSpeaking, isSupported } = useSpeechSynthesis();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  const handleSend = async () => {
    if (!inputValue.trim() || isTyping) return;

    const userInput = inputValue;
    setInputValue('');
    
    const response = await sendMessage(userInput);
    
    // Speak the response if voice is enabled
    if (voiceEnabled && response && isSupported) {
      speak(response);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleVoice = () => {
    if (isListening) {
      onVoiceStop?.();
    } else {
      onVoiceStart?.();
    }
  };

  const toggleVoiceOutput = () => {
    if (isSpeaking) {
      stop();
    }
    setVoiceEnabled(!voiceEnabled);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-background/50 backdrop-blur-sm lg:hidden"
          />

          {/* Chat Panel */}
          <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md"
          >
            <div className="h-full glass-card rounded-l-3xl flex flex-col overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-border/30">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                      <Bot className="w-5 h-5 text-primary" />
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-card" />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-foreground">Nova AI</h3>
                    <p className="text-xs text-muted-foreground">Online • Ready to assist</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {isSupported && (
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={toggleVoiceOutput}
                      className={`p-2 rounded-lg transition-colors ${
                        voiceEnabled ? 'bg-primary/20 text-primary' : 'hover:bg-muted/50 text-muted-foreground'
                      }`}
                      title={voiceEnabled ? 'Disable voice responses' : 'Enable voice responses'}
                    >
                      {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                    </motion.button>
                  )}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onClose}
                    className="p-2 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <X className="w-5 h-5 text-muted-foreground" />
                  </motion.button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message, index) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: index * 0.02 }}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`flex gap-2 max-w-[85%] ${
                        message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                      }`}
                    >
                      {/* Avatar */}
                      <div
                        className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
                          message.role === 'user'
                            ? 'bg-secondary/50'
                            : 'bg-primary/20'
                        }`}
                      >
                        {message.role === 'user' ? (
                          <User className="w-4 h-4 text-secondary-foreground" />
                        ) : (
                          <Bot className="w-4 h-4 text-primary" />
                        )}
                      </div>

                      {/* Message bubble */}
                      <div
                        className={`px-4 py-3 rounded-2xl ${
                          message.role === 'user'
                            ? 'bg-primary/20 rounded-tr-md'
                            : 'glass-card rounded-tl-md'
                        }`}
                      >
                        <div className="text-sm text-foreground leading-relaxed prose prose-sm prose-invert max-w-none">
                          <ReactMarkdown>{message.content}</ReactMarkdown>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {message.timestamp.toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}

                {/* Typing indicator */}
                <AnimatePresence>
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-start gap-2"
                    >
                      <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                        <Bot className="w-4 h-4 text-primary" />
                      </div>
                      <div className="glass-card px-4 py-3 rounded-2xl rounded-tl-md">
                        <div className="flex gap-1">
                          {[0, 1, 2].map((i) => (
                            <motion.div
                              key={i}
                              className="w-2 h-2 rounded-full bg-primary"
                              animate={{
                                y: [0, -6, 0],
                                opacity: [0.5, 1, 0.5],
                              }}
                              transition={{
                                duration: 0.8,
                                repeat: Infinity,
                                delay: i * 0.15,
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div ref={messagesEndRef} />
              </div>

              {/* Speaking indicator */}
              <AnimatePresence>
                {isSpeaking && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="px-4 py-2 border-t border-border/30 bg-primary/10"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <div className="flex gap-1">
                        {[0, 1, 2, 3].map((i) => (
                          <motion.div
                            key={i}
                            className="w-1 h-4 rounded-full bg-primary"
                            animate={{
                              scaleY: [0.3, 1, 0.3],
                            }}
                            transition={{
                              duration: 0.6,
                              repeat: Infinity,
                              delay: i * 0.1,
                            }}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-primary">Nova is speaking...</span>
                      <button
                        onClick={stop}
                        className="text-xs text-muted-foreground hover:text-foreground ml-2"
                      >
                        Stop
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Input area */}
              <div className="p-4 border-t border-border/30">
                <div className="flex items-center gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={toggleVoice}
                    className={`p-3 rounded-xl transition-all duration-300 ${
                      isListening
                        ? 'bg-primary text-primary-foreground shadow-lg'
                        : 'glass-card hover:border-glow'
                    }`}
                    style={{
                      boxShadow: isListening
                        ? '0 0 20px hsl(180 60% 55% / 0.5)'
                        : undefined,
                    }}
                  >
                    {isListening ? (
                      <MicOff className="w-5 h-5" />
                    ) : (
                      <Mic className="w-5 h-5 text-muted-foreground" />
                    )}
                  </motion.button>

                  <div className="flex-1 relative">
                    <input
                      ref={inputRef}
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={handleKeyPress}
                      placeholder="Type your message..."
                      disabled={isTyping}
                      className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border/30 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors disabled:opacity-50"
                    />
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSend}
                    disabled={!inputValue.trim() || isTyping}
                    className={`p-3 rounded-xl transition-all duration-300 ${
                      inputValue.trim() && !isTyping
                        ? 'bg-primary text-primary-foreground shadow-lg'
                        : 'glass-card opacity-50 cursor-not-allowed'
                    }`}
                    style={{
                      boxShadow: inputValue.trim() && !isTyping
                        ? '0 0 15px hsl(180 60% 55% / 0.4)'
                        : undefined,
                    }}
                  >
                    <Send className="w-5 h-5" />
                  </motion.button>
                </div>

                {isListening && (
                  <motion.p
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xs text-primary text-center mt-2"
                  >
                    Listening... Speak now
                  </motion.p>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ChatPanel;
