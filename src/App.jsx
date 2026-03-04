import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Search, Volume2, HelpCircle, Layers, Fingerprint } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Known GIF names (from earlier directory listing)
const KNOWN_GIFS = [
    "address", "ahemdabad", "all", "any questions", "are you angry", "are you busy",
    "are you hungry", "assam", "august", "banana", "banaras", "banglore", "be careful",
    "bridge", "cat", "christmas", "church", "cilinic", "dasara", "december",
    "did you finish homework", "do you have money", "do you want something to drink",
    "do you watch TV", "dont worry", "flower is beautiful", "good afternoon",
    "good morning", "good question", "grapes", "hello", "hindu", "hyderabad",
    "i am a clerk", "i am fine", "i am sorry", "i am thinking", "i am tired",
    "i go to a theatre", "i had to say something but I forgot", "i like pink colour",
    "i love to shop", "job", "july", "june", "karnataka", "kerala", "krishna",
    "lets go for lunch", "mango", "may", "mile", "mumbai", "nagpur", "nice to meet you",
    "open the door", "pakistan", "please call me later", "please wait for sometime",
    "police station", "post office", "pune", "punjab", "saturday", "shall I help you",
    "shall we go together tommorow", "shop", "sign language interpreter", "sit down",
    "stand up", "take care", "temple", "there was traffic jam", "thursday", "toilet",
    "tomato", "tuesday", "usa", "village", "wednesday", "what are you doing",
    "what is the problem", "what is today's date", "what is your father do",
    "what is your mobile number", "what is your name", "whats up", "where is the bathroom",
    "where is the police station", "you are wrong"
];

function App() {
    const [isRecording, setIsRecording] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [currentDisplay, setCurrentDisplay] = useState(null); // { type: 'gif', src: '...' } or { type: 'letters', word: '...' }
    const [error, setError] = useState(null);
    const recognitionRef = useRef(null);

    useEffect(() => {
        // Initialize Speech Recognition
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            const recognition = new SpeechRecognition();
            recognition.continuous = false;
            recognition.interimResults = false;
            recognition.lang = 'en-IN'; // Set to English (India) for likely better local accent support

            recognition.onstart = () => {
                setIsRecording(true);
                setError(null);
            };

            recognition.onresult = (event) => {
                const result = event.results[0][0].transcript.toLowerCase().trim();
                setTranscript(result);
                processSpokenText(result);
            };

            recognition.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                setError('Could not hear you. Please try again.');
                setIsRecording(false);
            };

            recognition.onend = () => {
                setIsRecording(false);
            };

            recognitionRef.current = recognition;
        } else {
            setError('Speech recognition is not supported in this browser. Try Chrome.');
        }
    }, []);

    const toggleRecording = () => {
        if (isRecording) {
            recognitionRef.current.stop();
        } else {
            setTranscript('');
            setCurrentDisplay(null);
            recognitionRef.current.start();
        }
    };

    const processSpokenText = (text) => {
        // 1. Check if the exact phrase exists in KNOWN_GIFS
        const cleanedText = text.replace(/[?.!,]/g, '').trim();

        // Check for exact match first
        const exactMatch = KNOWN_GIFS.find(name => name.toLowerCase() === cleanedText);
        if (exactMatch) {
            setCurrentDisplay({
                type: 'gif',
                src: `/ISL_Gifs/${exactMatch}.gif`,
                label: exactMatch
            });
            return;
        }

        // 2. If no exact phrase, check if it's a single word with a GIF
        const words = cleanedText.split(' ');
        if (words.length === 1) {
            const wordMatch = KNOWN_GIFS.find(name => name.toLowerCase() === words[0]);
            if (wordMatch) {
                setCurrentDisplay({
                    type: 'gif',
                    src: `/ISL_Gifs/${wordMatch}.gif`,
                    label: wordMatch
                });
            } else {
                // Fallback to letters for the single word
                setCurrentDisplay({
                    type: 'letters',
                    word: words[0],
                    label: words[0]
                });
            }
        } else {
            // For multiple words, we'll try to find any existing GIFs first, 
            // otherwise we just display the letters for the whole phrase (or first word)
            // Implementation: if no exact phrase, show letters word by word or just the whole phrase in letters
            setCurrentDisplay({
                type: 'letters',
                word: words.join(''), // Combined for letters display
                label: text
            });
        }
    };

    return (
        <div className="app-container">
            <div className="grid-background"></div>

            <header>
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    Voice2Sign
                </motion.h1>
                <motion.p
                    className="subtitle"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    Bridging the communication gap with AI. Speak naturally, and we'll translate it into Indian Sign Language.
                </motion.p>
            </header>

            <div className="main-controls">
                <motion.button
                    className={`speak-button ${isRecording ? 'recording' : ''}`}
                    onClick={toggleRecording}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    {isRecording ? <Mic className="mic-icon" /> : <MicOff className="mic-icon" />}
                </motion.button>

                <div className="text-output">
                    {isRecording ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ repeat: Infinity, duration: 1.5 }}
                        >
                            Listening...
                        </motion.div>
                    ) : (
                        transcript || "Click the microphone to start"
                    )}
                </div>

                {error && <div style={{ color: '#ef4444', fontWeight: 500 }}>{error}</div>}
            </div>

            <div className="display-container">
                <AnimatePresence mode="wait">
                    {!currentDisplay ? (
                        <motion.div
                            key="empty"
                            className="empty-state"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.5 }}
                            exit={{ opacity: 0 }}
                        >
                            <Search className="empty-icon" />
                            <p>Your translation will appear here</p>
                        </motion.div>
                    ) : currentDisplay.type === 'gif' ? (
                        <motion.div
                            key="gif"
                            className="sign-box"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ type: 'spring', damping: 20 }}
                        >
                            <div style={{ textAlign: 'center' }}>
                                <img src={currentDisplay.src} alt={currentDisplay.label} className="sign-image" />
                                <p style={{ marginTop: '1rem', fontWeight: 600, color: 'var(--primary)' }}>
                                    {currentDisplay.label}
                                </p>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="letters"
                            className="alphabets-container"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            {currentDisplay.word.split('').map((char, index) => (
                                /^[a-z]$/.test(char) ? (
                                    <motion.div
                                        key={index}
                                        className="alphabet-card"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                    >
                                        <img src={`/letters/${char}.jpg`} alt={char} className="alphabet-img" />
                                        <span className="letter-label">{char}</span>
                                    </motion.div>
                                ) : (
                                    <div key={index} style={{ width: '20px' }}></div>
                                )
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div style={{ display: 'flex', gap: '2rem', marginTop: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-dim)', fontSize: '0.875rem' }}>
                    <Layers size={16} /> <span>90+ ISL Phrases</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-dim)', fontSize: '0.875rem' }}>
                    <Fingerprint size={16} /> <span>Finger Spelling Support</span>
                </div>
            </div>

            <footer>
                &copy; 2026 Voice2Sign - Accessible AI Solutions
            </footer>
        </div>
    );
}

export default App;
