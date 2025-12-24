import { useState, useEffect, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import BookingSectionWrapper from '../../components/BookingSectionWrapper';
import { mockAppointmentInfo } from '../../constants/mockData';
import { useBookingEntityInfo } from '../../hooks';
import { Link } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import {
    selectUserFirstName,
    selectUserLastName,
    selectUserEmail,
    selectUserPhone,
} from '@/store/selectors/user.selectors';
import CustomFileInput from '@/components/CustomFileInput/CustomFileInput';
import Input from '@/components/Input';
import Select from '@/components/Select/Select';
import { Skeleton } from '@mui/material';
import {
    setBookingSymptoms,
    addAttachmentUrl,
    clearAttachmentUrls,
    setBookingRelative,
} from '@/store/slices/bookingSlice';
import { AppointmentService } from '@/services/appointment.service';
import { PatientRelativeService } from '@/services/patientRelative.service';
import { PatientRelativeBasicResponse } from '@/types/patient-relative.types';
import { toast } from 'react-toastify';
import { translateApiError, handleNetworkError } from '@/utils/errorHandler';

interface BasicInfoSectionProps {
    nextStep: () => void;
    prevStep: () => void;
}

const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({ nextStep, prevStep }) => {
    const { t } = useTranslation(['booking', 'common']);

    // Use shared hook for booking type detection and entity info
    const { entityInfo } = useBookingEntityInfo();
    const dispatch = useAppDispatch();

    // Get user profile from Redux
    const userFirstName = useAppSelector(selectUserFirstName);
    const userLastName = useAppSelector(selectUserLastName);
    const userEmail = useAppSelector(selectUserEmail);
    const userPhone = useAppSelector(selectUserPhone);
    const bookingState = useAppSelector((state) => state.booking);

    // Local state for form inputs
    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    const [phoneNumber, setPhoneNumber] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [symptoms, setSymptoms] = useState<string>(bookingState.symptoms || '');
    const [attachments, setAttachments] = useState<File[]>([]);
    const [isUploading, setIsUploading] = useState<boolean>(false);

    // Patient relatives state
    const [relatives, setRelatives] = useState<PatientRelativeBasicResponse[]>([]);
    const [isLoadingRelatives, setIsLoadingRelatives] = useState<boolean>(false);
    const [bookingFor, setBookingFor] = useState<'self' | 'relative'>(
        bookingState.isBookingForRelative ? 'relative' : 'self'
    );
    const [selectedRelativeId, setSelectedRelativeId] = useState<string>(
        bookingState.relativeId || ''
    );

    // Fetch relatives on mount
    const fetchRelatives = useCallback(async () => {
        setIsLoadingRelatives(true);
        try {
            const response = await PatientRelativeService.getMyRelativesBasic();
            if (response.success && response.data) {
                setRelatives(response.data);
            }
        } catch (error: any) {
            console.error('Failed to fetch relatives:', error);
        } finally {
            setIsLoadingRelatives(false);
        }
    }, []);

    useEffect(() => {
        fetchRelatives();
    }, [fetchRelatives]);

    // Fill form with user profile data when component mounts
    useEffect(() => {
        setFirstName(userFirstName || '');
        setLastName(userLastName || '');
        setEmail(userEmail || '');
        setPhoneNumber(userPhone || '');
    }, [userFirstName, userLastName, userEmail, userPhone]);

    // Clear attachment URLs when component mounts to avoid duplicate uploads
    useEffect(() => {
        dispatch(clearAttachmentUrls());
    }, [dispatch]);

    // Handle booking for change
    const handleBookingForChange = (value: 'self' | 'relative') => {
        setBookingFor(value);
        if (value === 'self') {
            setSelectedRelativeId('');
            dispatch(setBookingRelative({ relativeId: null, isBookingForRelative: false }));
        }
    };

    // Handle relative selection
    const handleRelativeChange = (relativeId: string) => {
        setSelectedRelativeId(relativeId);
        dispatch(
            setBookingRelative({
                relativeId: relativeId || null,
                isBookingForRelative: !!relativeId,
            })
        );
    };

    // Transform relatives to Select items
    const relativeSelectItems = useMemo(() => {
        return relatives.map((relative) => ({
            label: `${relative.fullName} (${relative.relationshipDisplay}) - ${relative.age} ${t('common:units.yearsOld')}`,
            value: relative.id,
        }));
    }, [relatives, t]);

    // Handle file selection (không upload ngay)
    const handleFileChange = (files: File[]) => {
        setAttachments(files);
    };

    // Handle symptoms change
    const handleSymptomsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;
        setSymptoms(value);
        dispatch(setBookingSymptoms(value));
    };

    // Upload files when user clicks next step
    const handleNextStep = async () => {
        // Validate relative selection if booking for relative
        if (bookingFor === 'relative' && !selectedRelativeId) {
            toast.error(t('booking:basicInfo.pleaseSelectRelative', 'Vui lòng chọn người thân'));
            return;
        }

        // Upload attachments if any
        if (attachments.length > 0) {
            setIsUploading(true);
            try {
                for (const file of attachments) {
                    const response = await AppointmentService.uploadAttachment(file);

                    // ✅ Handle API response with error code
                    if (!response.success) {
                        const errorMessage = translateApiError(
                            response.errors,
                            response.message || t('common:messages.uploadError')
                        );
                        toast.error(errorMessage);
                        setIsUploading(false);
                        return;
                    }

                    if (response.data?.fileUrl) {
                        dispatch(addAttachmentUrl(response.data.fileUrl));
                    }
                }
            } catch (error: any) {
                // ✅ Handle network/unexpected errors
                const errorMessage = handleNetworkError(error);
                toast.error(errorMessage);
                setIsUploading(false);
                return; // Dừng lại nếu upload thất bại
            } finally {
                setIsUploading(false);
            }
        }

        // Proceed to next step
        nextStep();
    };

    const renderRelativeSelection = () => {
        if (isLoadingRelatives) {
            return (
                <Skeleton variant="rectangular" width="100%" height={46} sx={{ borderRadius: 1 }} />
            );
        }
        if (relatives.length === 0) {
            return (
                <div className="alert alert-warning py-2">
                    <i className="fa fa-exclamation-triangle me-2"></i>
                    {t('booking:basicInfo.noRelatives', 'Bạn chưa có người thân nào.')}{' '}
                    <Link to="/user/profile?tab=relatives" className="alert-link">
                        {t('booking:basicInfo.addRelative', 'Thêm người thân')}
                    </Link>
                </div>
            );
        }
        return (
            <Select
                title={t('booking:basicInfo.selectRelativePlaceholder', '-- Chọn người thân --')}
                items={relativeSelectItems}
                value={selectedRelativeId}
                onChange={handleRelativeChange}
            />
        );
    };

    return (
        <BookingSectionWrapper
            doctor={entityInfo}
            appointment={mockAppointmentInfo}
            nextStepTitle={
                isUploading ? t('common:actions.processing') : t('booking:payment.selectMethod')
            }
            nextStep={handleNextStep}
            prevStep={prevStep}
            disabled={isUploading}
        >
            <div className="card mb-0">
                <div className="card-body pb-1">
                    <div className="row">
                        {/* Booking For Selection */}
                        <div className="col-12 mb-3">
                            <label className="form-label fw-semibold">
                                <i className="fa fa-user-friends me-2"></i>
                                {t('booking:basicInfo.bookingFor', 'Đặt lịch cho')}
                            </label>
                            <div className="d-flex gap-3 flex-wrap">
                                <div className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        name="bookingFor"
                                        id="bookingForSelf"
                                        checked={bookingFor === 'self'}
                                        onChange={() => handleBookingForChange('self')}
                                    />
                                    <label className="form-check-label" htmlFor="bookingForSelf">
                                        {t('booking:basicInfo.forSelf', 'Bản thân')}
                                    </label>
                                </div>
                                <div className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        name="bookingFor"
                                        id="bookingForRelative"
                                        checked={bookingFor === 'relative'}
                                        onChange={() => handleBookingForChange('relative')}
                                    />
                                    <label
                                        className="form-check-label"
                                        htmlFor="bookingForRelative"
                                    >
                                        {t('booking:basicInfo.forRelative', 'Người thân')}
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Relative Selection */}
                        {bookingFor === 'relative' && (
                            <div className="col-12 mb-3">
                                <label className="form-label">
                                    {t('booking:basicInfo.selectRelative', 'Chọn người thân')}{' '}
                                    <span className="text-danger">*</span>
                                </label>
                                {renderRelativeSelection()}
                                <small className="text-muted mt-1 d-block">
                                    <Link to="/user/profile?tab=relatives">
                                        <i className="fa fa-cog me-1"></i>
                                        {t(
                                            'booking:basicInfo.manageRelatives',
                                            'Quản lý người thân'
                                        )}
                                    </Link>
                                </small>
                            </div>
                        )}

                        <div className="col-lg-6 col-md-6">
                            <Input
                                id="firstName"
                                label={t('booking:basicInfo.firstName')}
                                isRequired
                                type="text"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                placeholder={t('booking:basicInfo.placeholder.firstName')}
                                disabled
                                wrapperClassName="mb-3"
                            />
                        </div>
                        <div className="col-lg-6 col-md-6">
                            <Input
                                id="lastName"
                                label={t('booking:basicInfo.lastName')}
                                isRequired
                                type="text"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                placeholder={t('booking:basicInfo.placeholder.lastName')}
                                disabled
                                wrapperClassName="mb-3"
                            />
                        </div>
                        <div className="col-lg-6 col-md-6">
                            <Input
                                id="email"
                                label={t('booking:basicInfo.email')}
                                isRequired
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder={t('booking:basicInfo.placeholder.email')}
                                disabled
                                wrapperClassName="mb-3"
                            />
                        </div>
                        <div className="col-lg-6 col-md-6">
                            <Input
                                id="phoneNumber"
                                label={t('booking:basicInfo.phoneNumber')}
                                isRequired
                                type="tel"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                placeholder={t('booking:basicInfo.placeholder.phoneNumber')}
                                disabled
                                wrapperClassName="mb-3"
                            />
                        </div>

                        <div className="col-lg-12">
                            <div className="mb-3">
                                <label className="form-label" htmlFor="attachments">
                                    {t('booking:basicInfo.attachments')}{' '}
                                    <span className="text-muted ms-1">
                                        {t('booking:basicInfo.optional')}
                                    </span>
                                    {attachments.length > 0 && (
                                        <small className="text-success ms-2">
                                            (
                                            {t('booking:basicInfo.filesSelected', {
                                                count: attachments.length,
                                            })}
                                            )
                                        </small>
                                    )}
                                </label>
                                <div className="alert alert-info py-2 mb-2">
                                    <i className="fa fa-info-circle me-2"></i>
                                    <small>
                                        <strong>
                                            {t('booking:basicInfo.attachmentInfo.title')}
                                        </strong>
                                        <ul className="mb-0 mt-1 ps-3">
                                            <li>
                                                {t('booking:basicInfo.attachmentInfo.followUp')}
                                            </li>
                                            <li>{t('booking:basicInfo.attachmentInfo.chronic')}</li>
                                            <li>{t('booking:basicInfo.attachmentInfo.remote')}</li>
                                        </ul>
                                        <strong className="d-block mt-1">
                                            {t('booking:basicInfo.attachmentInfo.acceptedFormats')}
                                        </strong>{' '}
                                        {t('booking:basicInfo.attachmentInfo.formats')}
                                    </small>
                                </div>
                                <CustomFileInput
                                    files={attachments}
                                    onChange={handleFileChange}
                                    accept="image/*,.pdf,.doc,.docx"
                                    multiple={true}
                                    maxSize={10}
                                    id="attachments"
                                />
                                {attachments.length > 0 && (
                                    <small className="text-muted mt-1 d-block">
                                        <i className="fa fa-info-circle me-1"></i>{' '}
                                        {t('booking:basicInfo.uploadNote')}
                                    </small>
                                )}
                            </div>
                        </div>
                        <div className="col-lg-12">
                            <div className="mb-3">
                                <label className="form-label" htmlFor="symptoms">
                                    {t('booking:basicInfo.symptoms')}
                                </label>
                                <textarea
                                    className="form-control"
                                    rows={3}
                                    id="symptoms"
                                    value={symptoms}
                                    onChange={handleSymptomsChange}
                                    placeholder={t('booking:basicInfo.placeholder.symptoms')}
                                ></textarea>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </BookingSectionWrapper>
    );
};

export default BasicInfoSection;
