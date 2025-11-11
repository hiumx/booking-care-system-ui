import { useEffect, useRef, useState } from 'react';

interface UseSpeechRecognitionProps {
    onTranscript: (transcript: string) => void;
    currentValue: string;
    language?: string;
}

export const useSpeechRecognition = ({
    onTranscript,
    currentValue,
    language = 'vi-VN',
}: UseSpeechRecognitionProps) => {
    const [isRecording, setIsRecording] = useState(false);
    const recognitionRef = useRef<SpeechRecognition | null>(null);
    const valueRef = useRef<string>(currentValue);

    // Update valueRef when currentValue changes
    useEffect(() => {
        valueRef.current = currentValue;
    }, [currentValue]);

    // Setup speech recognition
    useEffect(() => {
        const SpeechRecognition =
            (globalThis as any).SpeechRecognition || (globalThis as any).webkitSpeechRecognition;
        if (SpeechRecognition) {
            const recognition = new SpeechRecognition();
            recognition.continuous = true;
            recognition.interimResults = true;
            recognition.lang = language;
            recognitionRef.current = recognition;

            recognition.onresult = (event: SpeechRecognitionEvent) => {
                let transcript = '';
                for (let i = event.resultIndex; i < event.results.length; i++) {
                    transcript += event.results[i][0].transcript;
                }
                const newText = valueRef.current + ' ' + transcript.trim();
                onTranscript(newText);
            };

            recognition.onend = () => {
                setIsRecording(false);
            };
        }
    }, [language, onTranscript]);

    const toggleRecording = () => {
        if (isRecording) {
            recognitionRef.current?.stop();
            setIsRecording(false);
        } else {
            recognitionRef.current?.start();
            setIsRecording(true);
        }
    };

    return {
        isRecording,
        toggleRecording,
    };
};
