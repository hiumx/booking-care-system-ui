import { useState, useRef, useCallback, useEffect } from 'react';
import { toast } from 'react-toastify';
import Button from '@/components/Button';
import EkycService from '@/services/ekyc.service';
import type { EkycVerificationState, EkycFormData, EkycOcrResult } from '@/types/ekyc.types';
import styles from './EkycVerification.module.scss';

interface EkycVerificationProps {
    onVerificationComplete: (data: EkycFormData) => void;
}

type CameraTarget = 'front' | 'back' | 'selfie' | 'video';

const EkycVerification: React.FC<EkycVerificationProps> = ({ onVerificationComplete }) => {
    const [state, setState] = useState<EkycVerificationState>({
        step: 'idle',
        isVerified: false,
    });

    const [idCardFront, setIdCardFront] = useState<File | null>(null);
    const [idCardBack, setIdCardBack] = useState<File | null>(null);
    const [selfie, setSelfie] = useState<File | null>(null);
    const [livenessVideo, setLivenessVideo] = useState<File | null>(null);

    const [idCardFrontPreview, setIdCardFrontPreview] = useState<string>('');
    const [idCardBackPreview, setIdCardBackPreview] = useState<string>('');
    const [selfiePreview, setSelfiePreview] = useState<string>('');
    const [videoPreview, setVideoPreview] = useState<string>('');

    const [activeCamera, setActiveCamera] = useState<CameraTarget | null>(null);
    const [isCameraReady, setIsCameraReady] = useState(false);
    const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);

    const idCardFrontRef = useRef<HTMLInputElement>(null);
    const idCardBackRef = useRef<HTMLInputElement>(null);
    const selfieRef = useRef<HTMLInputElement>(null);
    const videoInputRef = useRef<HTMLInputElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const recordedChunksRef = useRef<Blob[]>([]);
    const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);

    const handleFileSelect = useCallback(
        (file: File | null, setFile: (f: File | null) => void, setPreview: (p: string) => void) => {
            if (file) {
                setFile(file);
                const reader = new FileReader();
                reader.onloadend = () => {
                    setPreview(reader.result as string);
                };
                reader.readAsDataURL(file);
            }
        },
        []
    );

    const handleIdCardFrontChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        handleFileSelect(file, setIdCardFront, setIdCardFrontPreview);
    };

    const handleIdCardBackChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        handleFileSelect(file, setIdCardBack, setIdCardBackPreview);
    };

    const handleSelfieChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        handleFileSelect(file, setSelfie, setSelfiePreview);
    };

    const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        if (file) {
            setLivenessVideo(file);
            setVideoPreview(URL.createObjectURL(file));
        }
    };

    // Effect to attach stream to video element
    useEffect(() => {
        if (cameraStream && videoRef.current) {
            videoRef.current.srcObject = cameraStream;
            videoRef.current.onloadedmetadata = () => {
                videoRef.current
                    ?.play()
                    .then(() => setIsCameraReady(true))
                    .catch((err) => console.error('Video play error:', err));
            };
        }
    }, [cameraStream, activeCamera]);

    // Cleanup camera on unmount
    useEffect(() => {
        return () => {
            if (cameraStream) {
                cameraStream.getTracks().forEach((track) => track.stop());
            }
            if (recordingTimerRef.current) {
                clearInterval(recordingTimerRef.current);
            }
        };
    }, [cameraStream]);

    const startCamera = async (target: CameraTarget) => {
        try {
            setActiveCamera(target);
            setIsCameraReady(false);
            setIsRecording(false);
            setRecordingTime(0);

            const facingMode = target === 'selfie' || target === 'video' ? 'user' : 'environment';
            const constraints: MediaStreamConstraints = {
                video: { facingMode, width: { ideal: 1280 }, height: { ideal: 720 } },
                audio: false,
            };

            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            setCameraStream(stream);
        } catch (err) {
            toast.error('Không thể truy cập camera. Vui lòng kiểm tra quyền truy cập.');
            console.error('Camera error:', err);
            setActiveCamera(null);
        }
    };

    const stopCamera = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
        }
        if (cameraStream) {
            cameraStream.getTracks().forEach((track) => track.stop());
            setCameraStream(null);
        }
        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }
        if (recordingTimerRef.current) {
            clearInterval(recordingTimerRef.current);
        }
        setActiveCamera(null);
        setIsCameraReady(false);
        setIsRecording(false);
        setRecordingTime(0);
    };

    const capturePhoto = () => {
        if (!videoRef.current || !activeCamera || activeCamera === 'video') return;

        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.drawImage(videoRef.current, 0, 0);

        canvas.toBlob(
            (blob) => {
                if (!blob) return;
                const file = new File([blob], `${activeCamera}-${Date.now()}.jpg`, {
                    type: 'image/jpeg',
                });
                const previewUrl = canvas.toDataURL('image/jpeg');

                if (activeCamera === 'front') {
                    setIdCardFront(file);
                    setIdCardFrontPreview(previewUrl);
                } else if (activeCamera === 'back') {
                    setIdCardBack(file);
                    setIdCardBackPreview(previewUrl);
                } else if (activeCamera === 'selfie') {
                    setSelfie(file);
                    setSelfiePreview(previewUrl);
                }

                stopCamera();
            },
            'image/jpeg',
            0.9
        );
    };

    const startRecording = () => {
        if (!cameraStream) return;

        recordedChunksRef.current = [];
        const mediaRecorder = new MediaRecorder(cameraStream, {
            mimeType: 'video/webm;codecs=vp9',
        });

        mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                recordedChunksRef.current.push(event.data);
            }
        };

        mediaRecorder.onstop = () => {
            const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
            const file = new File([blob], `liveness-${Date.now()}.webm`, { type: 'video/webm' });
            setLivenessVideo(file);
            setVideoPreview(URL.createObjectURL(blob));
            stopCamera();
        };

        mediaRecorderRef.current = mediaRecorder;
        mediaRecorder.start();
        setIsRecording(true);

        // Start timer
        recordingTimerRef.current = setInterval(() => {
            setRecordingTime((prev) => {
                if (prev >= 5) {
                    // Auto stop after 5 seconds
                    mediaRecorderRef.current?.stop();
                    return prev;
                }
                return prev + 1;
            });
        }, 1000);
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            if (recordingTimerRef.current) {
                clearInterval(recordingTimerRef.current);
            }
        }
    };

    const handleVerify = async () => {
        if (!idCardFront || !idCardBack || !selfie) {
            toast.error('Vui lòng cung cấp đầy đủ ảnh CMND/CCCD và ảnh selfie');
            return;
        }

        setState((prev) => ({ ...prev, step: 'uploading' }));

        try {
            setState((prev) => ({ ...prev, step: 'processing' }));

            const response = await EkycService.verifyIdentity(
                idCardFront,
                idCardBack,
                selfie,
                livenessVideo || undefined
            );

            if (response.success && response.data?.isVerified) {
                const data = response.data;
                setState({
                    step: 'completed',
                    isVerified: true,
                    sessionId: data.sessionId,
                    ocrResult: data.ocrResult,
                    faceMatchResult: data.faceMatchResult,
                    livenessResult: data.livenessResult,
                    verifiedAt: data.verifiedAt,
                });

                toast.success('Xác thực danh tính thành công!');

                // Privacy-friendly: Only send verification status, not PII
                onVerificationComplete({
                    ekycSessionId: data.sessionId,
                    faceMatchScore: data.faceMatchResult?.similarity,
                    livenessScore: data.livenessResult?.livenessScore,
                    isVerified: true,
                    // OCR data for display/auto-fill only (not stored in backend)
                    idCardName: data.ocrResult?.fullName,
                    idCardNumber: data.ocrResult?.idNumber,
                    idCardDob: data.ocrResult?.dateOfBirth,
                    idCardAddress: data.ocrResult?.placeOfResidence,
                });
            } else {
                setState({
                    step: 'failed',
                    isVerified: false,
                    errorMessage:
                        response.data?.errorMessage || 'Xác thực thất bại. Vui lòng thử lại.',
                });
                toast.error(response.data?.errorMessage || 'Xác thực thất bại. Vui lòng thử lại.');
            }
        } catch (error: any) {
            setState({
                step: 'failed',
                isVerified: false,
                errorMessage: error.message || 'Có lỗi xảy ra. Vui lòng thử lại.',
            });
            toast.error(error.message || 'Có lỗi xảy ra. Vui lòng thử lại.');
        }
    };

    const handleRetry = () => {
        setState({ step: 'idle', isVerified: false });
        setIdCardFront(null);
        setIdCardBack(null);
        setSelfie(null);
        setLivenessVideo(null);
        setIdCardFrontPreview('');
        setIdCardBackPreview('');
        setSelfiePreview('');
        setVideoPreview('');
    };

    const renderOcrResult = (ocrResult: EkycOcrResult) => (
        <div className={styles.ocrResult}>
            <h6 className="mb-3">
                <i className="isax isax-document-text me-2"></i>
                Thông tin từ CMND/CCCD
            </h6>
            <div className="row">
                <div className="col-md-6 mb-2">
                    <small className="text-muted">Số CMND/CCCD:</small>
                    <p className="mb-0 fw-semibold">{ocrResult.idNumber || 'N/A'}</p>
                </div>
                <div className="col-md-6 mb-2">
                    <small className="text-muted">Họ và tên:</small>
                    <p className="mb-0 fw-semibold">{ocrResult.fullName || 'N/A'}</p>
                </div>
                <div className="col-md-6 mb-2">
                    <small className="text-muted">Ngày sinh:</small>
                    <p className="mb-0 fw-semibold">{ocrResult.dateOfBirth || 'N/A'}</p>
                </div>
                <div className="col-md-6 mb-2">
                    <small className="text-muted">Giới tính:</small>
                    <p className="mb-0 fw-semibold">{ocrResult.gender || 'N/A'}</p>
                </div>
                <div className="col-12 mb-2">
                    <small className="text-muted">Địa chỉ:</small>
                    <p className="mb-0 fw-semibold">{ocrResult.placeOfResidence || 'N/A'}</p>
                </div>
            </div>
        </div>
    );

    const renderVerificationStatus = () => {
        if (state.step === 'completed' && state.isVerified) {
            return (
                <div className={styles.verificationSuccess}>
                    <div className="text-center mb-3">
                        <i
                            className="isax isax-tick-circle text-success"
                            style={{ fontSize: '48px' }}
                        ></i>
                        <h5 className="mt-2 text-success">Xác thực thành công!</h5>
                    </div>
                    {state.ocrResult && renderOcrResult(state.ocrResult)}
                    {state.faceMatchResult && (
                        <div className="mt-3 p-3 bg-light rounded">
                            <small className="text-muted">Độ khớp khuôn mặt:</small>
                            <p className="mb-0 fw-semibold text-success">
                                {state.faceMatchResult.similarity.toFixed(1)}%
                            </p>
                        </div>
                    )}
                </div>
            );
        }

        if (state.step === 'failed') {
            return (
                <div className={styles.verificationFailed}>
                    <div className="text-center mb-3">
                        <i
                            className="isax isax-close-circle text-danger"
                            style={{ fontSize: '48px' }}
                        ></i>
                        <h5 className="mt-2 text-danger">Xác thực thất bại</h5>
                        <p className="text-muted">{state.errorMessage}</p>
                    </div>
                    <div className="text-center">
                        <Button
                            text="Thử lại"
                            type="button"
                            onClick={handleRetry}
                            className="btn-outline-primary"
                        />
                    </div>
                </div>
            );
        }

        return null;
    };

    const renderCameraModal = () => {
        if (!activeCamera) return null;

        const titles: Record<CameraTarget, string> = {
            front: 'Chụp mặt trước CMND/CCCD',
            back: 'Chụp mặt sau CMND/CCCD',
            selfie: 'Chụp ảnh chân dung',
            video: 'Quay video xác thực',
        };

        const isVideoMode = activeCamera === 'video';

        return (
            <div className={styles.cameraModal}>
                <div className={styles.cameraContainer}>
                    <h5 className="text-center mb-3">{titles[activeCamera]}</h5>
                    {isVideoMode && (
                        <p className="text-center text-muted small mb-2">
                            Quay video khuôn mặt trong 3-5 giây, xoay đầu nhẹ sang trái và phải
                        </p>
                    )}
                    <div className={styles.videoWrapper}>
                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            muted
                            className={styles.video}
                            style={{ display: isCameraReady ? 'block' : 'none' }}
                        />
                        {!isCameraReady && (
                            <div className="d-flex align-items-center justify-content-center h-100">
                                <div className="spinner-border text-light" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            </div>
                        )}
                        {(activeCamera === 'selfie' || activeCamera === 'video') &&
                            isCameraReady && <div className={styles.faceGuide}></div>}
                        {isRecording && (
                            <div className={styles.recordingIndicator}>
                                <span className={styles.recordingDot}></span>
                                <span>REC {recordingTime}s</span>
                            </div>
                        )}
                    </div>
                    <div className="d-flex justify-content-center gap-3 mt-3">
                        <button
                            type="button"
                            className="btn btn-outline-danger"
                            onClick={stopCamera}
                        >
                            Hủy
                        </button>
                        {isVideoMode ? (
                            isRecording ? (
                                <button
                                    type="button"
                                    className="btn btn-danger"
                                    onClick={stopRecording}
                                    disabled={recordingTime < 2}
                                >
                                    <i className="isax isax-stop me-2"></i>
                                    Dừng ({5 - recordingTime}s)
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    className="btn btn-danger"
                                    onClick={startRecording}
                                    disabled={!isCameraReady}
                                >
                                    <i className="isax isax-video me-2"></i>
                                    Bắt đầu quay
                                </button>
                            )
                        ) : (
                            <button
                                type="button"
                                className="btn btn-sm btn-outline-primary"
                                onClick={capturePhoto}
                                disabled={!isCameraReady}
                            >
                                <i className="isax isax-camera me-2"></i>
                                Chụp ảnh
                            </button>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    const renderUploadBox = (
        label: string,
        preview: string,
        inputRef: React.RefObject<HTMLInputElement | null>,
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
        cameraTarget: CameraTarget,
        placeholder: string,
        icon: string,
        isRequired = true
    ) => (
        <div className="mb-3">
            <label className="form-label">
                {label} {isRequired && <span className="text-danger">*</span>}
            </label>
            <div className={styles.uploadBox}>
                {preview ? (
                    <div className={styles.previewContainer}>
                        <img src={preview} alt={label} className={styles.previewImage} />
                        <button
                            type="button"
                            className={styles.removeBtn}
                            onClick={() => {
                                if (cameraTarget === 'front') {
                                    setIdCardFront(null);
                                    setIdCardFrontPreview('');
                                } else if (cameraTarget === 'back') {
                                    setIdCardBack(null);
                                    setIdCardBackPreview('');
                                } else {
                                    setSelfie(null);
                                    setSelfiePreview('');
                                }
                            }}
                        >
                            <i className="isax isax-close-circle"></i>
                        </button>
                    </div>
                ) : (
                    <div className={styles.uploadActions}>
                        <div className={styles.uploadPlaceholder}>
                            <i className={`isax ${icon}`}></i>
                            <span>{placeholder}</span>
                        </div>
                        <div className={styles.actionButtons}>
                            <button
                                type="button"
                                className="btn btn-sm btn-outline-primary"
                                onClick={() => inputRef.current?.click()}
                            >
                                <i className="isax isax-gallery-add me-1"></i>
                                Tải lên
                            </button>
                            <button
                                type="button"
                                className="btn btn-sm btn-outline-primary"
                                onClick={() => startCamera(cameraTarget)}
                            >
                                <i className="isax isax-camera me-1"></i>
                                Chụp ảnh
                            </button>
                        </div>
                    </div>
                )}
            </div>
            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                onChange={onChange}
                className="d-none"
            />
        </div>
    );

    const renderVideoUploadBox = () => (
        <div className="mb-3">
            <label className="form-label">
                Video xác thực người thật <span className="text-danger">*</span>
            </label>
            <div className={styles.uploadBox}>
                {videoPreview ? (
                    <div className={styles.previewContainer}>
                        <video src={videoPreview} className={styles.previewImage} controls />
                        <button
                            type="button"
                            className={styles.removeBtn}
                            onClick={() => {
                                setLivenessVideo(null);
                                setVideoPreview('');
                            }}
                        >
                            <i className="isax isax-close-circle"></i>
                        </button>
                    </div>
                ) : (
                    <div className={styles.uploadActions}>
                        <div className={styles.uploadPlaceholder}>
                            <i className="isax isax-video"></i>
                            <span>Quay video 3-5 giây</span>
                        </div>
                        <div className={styles.actionButtons}>
                            <button
                                type="button"
                                className="btn btn-sm btn-outline-primary"
                                onClick={() => videoInputRef.current?.click()}
                            >
                                <i className="isax isax-gallery-add me-1"></i>
                                Tải lên
                            </button>
                            <button
                                type="button"
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => startCamera('video')}
                            >
                                <i className="isax isax-video me-1"></i>
                                Quay video
                            </button>
                        </div>
                    </div>
                )}
            </div>
            <input
                ref={videoInputRef}
                type="file"
                accept="video/*"
                onChange={handleVideoChange}
                className="d-none"
            />
            <small className="text-muted">
                Video giúp xác thực bạn là người thật. Xoay đầu nhẹ sang trái và phải khi quay.
            </small>
        </div>
    );

    const isProcessing = state.step === 'uploading' || state.step === 'processing';
    const canVerify = idCardFront && idCardBack && selfie && livenessVideo && !isProcessing;

    return (
        <div className={styles.ekycContainer}>
            <div className="d-flex align-items-center mb-3">
                <div className="section-divider-icon me-3">
                    <i
                        className="isax isax-security-user"
                        style={{ fontSize: '24px', color: '#0d6efd' }}
                    ></i>
                </div>
                <h5 className="mb-0 fw-bold text-primary">Xác thực danh tính (eKYC)</h5>
            </div>
            <p className="text-muted small mb-4">
                Vui lòng xác thực danh tính bằng CMND/CCCD để đảm bảo tính xác thực của đơn đăng ký
            </p>

            {state.step !== 'completed' && state.step !== 'failed' && (
                <>
                    <div className="row">
                        <div className="col-md-6">
                            {renderUploadBox(
                                'Ảnh mặt trước CMND/CCCD',
                                idCardFrontPreview,
                                idCardFrontRef,
                                handleIdCardFrontChange,
                                'front',
                                'Mặt trước',
                                'isax-card'
                            )}
                        </div>
                        <div className="col-md-6">
                            {renderUploadBox(
                                'Ảnh mặt sau CMND/CCCD',
                                idCardBackPreview,
                                idCardBackRef,
                                handleIdCardBackChange,
                                'back',
                                'Mặt sau',
                                'isax-card'
                            )}
                        </div>
                    </div>

                    {renderUploadBox(
                        'Ảnh chân dung (Selfie)',
                        selfiePreview,
                        selfieRef,
                        handleSelfieChange,
                        'selfie',
                        'Chụp ảnh selfie',
                        'isax-user'
                    )}

                    {renderVideoUploadBox()}

                    <div className="d-flex justify-content-end mt-4">
                        <Button
                            text={isProcessing ? 'Đang xác thực...' : 'Xác thực danh tính'}
                            type="button"
                            onClick={handleVerify}
                            isDisabled={!canVerify}
                        />
                    </div>

                    {isProcessing && (
                        <div className={styles.processingOverlay}>
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                            <p className="mt-2 mb-0">
                                {state.step === 'uploading'
                                    ? 'Đang tải ảnh lên...'
                                    : 'Đang xác thực danh tính...'}
                            </p>
                        </div>
                    )}
                </>
            )}

            {renderVerificationStatus()}
            {renderCameraModal()}
        </div>
    );
};

export default EkycVerification;
