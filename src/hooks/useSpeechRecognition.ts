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
    const interimTranscriptRef = useRef<string>('');
    const finalTranscriptRef = useRef<string>('');
    const startValueRef = useRef<string>('');
    const processedResultIndexRef = useRef<number>(0);

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

            recognition.onstart = () => {
                // Lưu giá trị hiện tại khi bắt đầu recording
                startValueRef.current = valueRef.current;
                finalTranscriptRef.current = '';
                interimTranscriptRef.current = '';
                processedResultIndexRef.current = 0;
            };

            recognition.onresult = (event: SpeechRecognitionEvent) => {
                // CHỈ xử lý results CHƯA ĐƯỢC XỬ LÝ (từ processedResultIndexRef trở đi)
                // Tránh xử lý lại results đã xử lý để không bị lặp
                let newFinalTranscript = '';
                let interimTranscript = '';

                // Bắt đầu từ index đã xử lý, không phải từ event.resultIndex
                const startIndex = Math.max(processedResultIndexRef.current, event.resultIndex);

                for (let i = startIndex; i < event.results.length; i++) {
                    const result = event.results[i];
                    const transcript = result[0].transcript;

                    if (result.isFinal) {
                        // CHỈ lấy final results MỚI và append vào transcript đã có
                        newFinalTranscript += transcript;
                    } else {
                        // Lưu interim transcript (không dùng để cập nhật input)
                        interimTranscript += transcript;
                    }
                }

                // Cập nhật processedResultIndexRef để đánh dấu đã xử lý đến đâu
                if (event.results.length > processedResultIndexRef.current) {
                    processedResultIndexRef.current = event.results.length;
                }

                // CHỈ cập nhật khi có final results MỚI
                if (newFinalTranscript.trim()) {
                    // Append final transcript mới vào transcript đã có
                    finalTranscriptRef.current = (
                        finalTranscriptRef.current +
                        ' ' +
                        newFinalTranscript.trim()
                    ).trim();

                    // Cập nhật input với base text + toàn bộ final transcript
                    const baseText = startValueRef.current.trim();
                    const newText = baseText
                        ? `${baseText} ${finalTranscriptRef.current}`
                        : finalTranscriptRef.current;
                    onTranscript(newText);
                }

                // Lưu interim transcript (không dùng để cập nhật input)
                interimTranscriptRef.current = interimTranscript;
            };

            recognition.onend = () => {
                // Khi kết thúc, đảm bảo final transcript được cập nhật
                if (finalTranscriptRef.current) {
                    const baseText = startValueRef.current.trim();
                    const newText = baseText
                        ? `${baseText} ${finalTranscriptRef.current.trim()}`
                        : finalTranscriptRef.current.trim();
                    onTranscript(newText);
                }
                setIsRecording(false);
            };

            recognition.onerror = (event: any) => {
                console.error('Speech recognition error:', event.error);
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
