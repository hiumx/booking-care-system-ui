import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import AppointmentDetail from './components/AppointmentDetail/AppointmentDetail';
import AppointmentDetailSkeleton from './components/AppointmentDetail/AppointmentDetailSkeleton';
import AppointmentCard from './components/AppointmentCard/AppointmentCard';
import AppointmentCardSkeleton from './components/AppointmentCard/AppointmentCardSkeleton';
import ModalCancel from '@/components/ModalCancel';
import { AppointmentService } from '@/services/appointment.service';
import { RootState } from '@/store';
import { getRefundInfo } from '@/utils/refund-policy.util';
import { handleRescheduleAction } from '@/utils/reschedule-utils';
import { AppointmentStatus } from '@/enums/appointment.enums';
import {
    transformToDetailData,
    transformToCardData,
    isNewAppointment,
    mapStatusToUITab,
    AppointmentDetailData,
    AppointmentCardData,
    AppointmentQueryRequest,
} from '@/types/appointment.types';
import { PATHS } from '@/routes/paths';

const AppointmentDetailPage: React.FC = () => {
    const { t, i18n } = useTranslation('userProfile');

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const locale = i18n.language === 'vi' ? 'vi-VN' : 'en-US';
        return date.toLocaleDateString(locale, {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    };

    const location = useLocation();
    const navigate = useNavigate();
    const userProfile = useSelector((state: RootState) => state.user.profile);

    const [appointmentData, setAppointmentData] = useState<AppointmentDetailData | null>(null);
    const [recentAppointments, setRecentAppointments] = useState<AppointmentCardData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingRecent, setIsLoadingRecent] = useState(false);

    // Cancel modal states
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [isCancelling, setIsCancelling] = useState(false);

    // Get appointment ID from URL params
    const getAppointmentId = () => {
        const urlParams = new URLSearchParams(location.search);
        return urlParams.get('id') || '';
    };

    const appointmentId = getAppointmentId();

    // Fetch appointment detail from API
    useEffect(() => {
        const fetchAppointmentDetail = async () => {
            if (!appointmentId) {
                toast.error(t('appointments.detail.toast.appointmentNotFound'));
                navigate('/user/profile?tab=appointments');
                return;
            }

            setIsLoading(true);
            try {
                const response = await AppointmentService.getAppointmentById(appointmentId);

                if (response.success && response.data) {
                    const detailData = transformToDetailData(response.data);
                    detailData.isNew = isNewAppointment(response.data.createdAt);
                    setAppointmentData(detailData);
                } else {
                    throw new Error(response.message || t('appointments.detail.toast.loadError'));
                }
            } catch (error: any) {
                console.error('Error fetching appointment detail:', error);
                toast.error(error.message || t('appointments.detail.toast.loadError'));
                navigate('/user/profile?tab=appointments');
            } finally {
                setIsLoading(false);
            }
        };

        fetchAppointmentDetail();
    }, [appointmentId, navigate]);

    // Fetch recent appointments (2 most recent)
    useEffect(() => {
        const fetchRecentAppointments = async () => {
            if (!userProfile?.id) {
                return;
            }

            setIsLoadingRecent(true);
            try {
                const query: AppointmentQueryRequest = {
                    patientId: userProfile.id,
                    pageNumber: 1,
                    pageSize: 3, // Fetch 3 to ensure 2 after filtering out current
                    sortBy: 'CreatedAt',
                    sortDescending: true,
                };

                const response = await AppointmentService.getAppointmentsByPatient(query);

                if (response.success && response.data) {
                    const transformedAppointments = response.data.appointments
                        .filter((apt) => apt.id !== appointmentId) // Exclude current appointment
                        .slice(0, 2) // Take max 2 appointments
                        .map((apt) => {
                            const cardData = transformToCardData(apt);
                            cardData.isNew = isNewAppointment(apt.createdAt);
                            return cardData;
                        });

                    setRecentAppointments(transformedAppointments);
                }
            } catch (error: any) {
                console.error('Error fetching recent appointments:', error);
                // Don't show error toast for recent appointments - not critical
            } finally {
                setIsLoadingRecent(false);
            }
        };

        fetchRecentAppointments();
    }, [userProfile, appointmentId]);

    const handleStartSession = () => {
        // In real app: navigate to video call page or open video modal
    };

    const handleCancel = () => {
        // Validate status - only allow cancellation for PENDING or CONFIRMED
        if (!appointmentData) return;

        if (
            appointmentData.status !== AppointmentStatus.PENDING &&
            appointmentData.status !== AppointmentStatus.CONFIRMED
        ) {
            toast.warning(t('appointments.toast.cancelStatusWarning'));
            return;
        }

        setShowCancelModal(true);
    };

    // Handle cancel appointment confirm
    const handleCancelConfirm = async (cancellationReason: string) => {
        if (!appointmentData || !userProfile?.id) return;

        setIsCancelling(true);
        try {
            // Call API to cancel appointment
            await AppointmentService.cancelAppointment(
                appointmentData.appointmentId,
                cancellationReason,
                userProfile.id
            );

            // Calculate refund percentage for success message (patient cancellation)
            const refundInfo = getRefundInfo(
                appointmentData.appointmentDate,
                appointmentData.appointmentTimeId,
                undefined,
                false
            );

            // Show success message with refund info
            if (refundInfo.refundPercentage === 100) {
                toast.success(t('appointments.toast.cancelSuccessRefund100'));
            } else if (refundInfo.refundPercentage === 50) {
                toast.success(t('appointments.toast.cancelSuccessRefund50'));
            } else {
                toast.success(t('appointments.toast.cancelSuccessNoRefund'));
            }

            // Close modal and navigate back to appointments list
            setShowCancelModal(false);

            // Navigate back to appointments with cancelled tab
            navigate(PATHS.USER.ROOT + '/' + PATHS.USER.PROFILE + '?tab=appointments');
        } catch (error: any) {
            console.error('Error cancelling appointment:', error);
            toast.error(error.message || t('appointments.toast.cancelError'));
        } finally {
            setIsCancelling(false);
        }
    };

    // Handle reschedule (lazy token generation for Options 1 & 3)
    const handleReschedule = async (
        appointment?: AppointmentCardData,
        action?: 'SAME_DOCTOR' | 'NEW_DOCTOR'
    ) => {
        // If called without parameters (from old reschedule buttons in CANCELLED/COMPLETED status)
        if (!action || !appointment) {
            return;
        }

        if (!userProfile?.id) return;
        await handleRescheduleAction(appointment, action, userProfile.id);
    };

    const handleDownloadPrescription = () => {
        // In real app: trigger download or open prescription modal
    };

    // Helper function to render recent appointments - extracted to avoid nested ternary
    const renderRecentAppointments = () => {
        if (isLoadingRecent) {
            return null;
        }

        if (recentAppointments.length > 0) {
            return recentAppointments.map((appointment) => (
                <AppointmentCard
                    key={appointment.appointmentId}
                    appointment={appointment}
                    status={mapStatusToUITab(appointment.status)}
                    variant="minimal"
                />
            ));
        }

        return (
            <div className="text-center py-4">
                <div className="mb-1" style={{ fontSize: '4rem', color: 'var(--bs-gray-400)' }}>
                    <i className="isax isax-calendar-search"></i>
                </div>
                <h4 className="text-muted">{t('appointments.detail.noRecentAppointments')}</h4>
                <p className="text-muted mb-4">{t('appointments.detail.noRecentDescription')}</p>
            </div>
        );
    };

    return (
        <>
            {/* Dashboard Header */}
            <div className="dashboard-header">
                <div className="header-back">
                    <Link to="/user/profile?tab=appointments" className="back-arrow">
                        <i className="fa-solid fa-arrow-left"></i>
                    </Link>

                    <h3>{t('appointments.detail.title')}</h3>
                </div>
            </div>

            {/* Loading State - Skeleton */}
            {isLoading && <AppointmentDetailSkeleton />}

            {/* Appointment Detail Component */}
            {!isLoading && appointmentData && (
                <AppointmentDetail
                    appointment={appointmentData}
                    onStartSession={handleStartSession}
                    onCancel={handleCancel}
                    onReschedule={handleReschedule}
                    onDownloadPrescription={handleDownloadPrescription}
                />
            )}

            {/* Error State - handled by redirect in useEffect */}

            {/* Recent Appointments Section */}
            {!isLoading && (
                <div className="recent-appointments">
                    <h5 className="head-text">{t('appointments.detail.recentAppointments')}</h5>

                    {/* Loading State - Skeleton */}
                    {isLoadingRecent && (
                        <>
                            <AppointmentCardSkeleton />
                            <AppointmentCardSkeleton />
                        </>
                    )}

                    {/* Appointment Cards */}
                    {renderRecentAppointments()}
                </div>
            )}

            {/* Appointment Cancel Reason Modal */}
            <div className="modal fade custom-modal custom-modal-two" id="reject_reason">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">
                                {t('appointments.detail.cancelReasonTitle')}
                            </h5>
                            <button type="button" data-bs-dismiss="modal" aria-label="Close">
                                <span>
                                    <i className="fa-solid fa-x"></i>
                                </span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="reason-of-rejection">
                                <p>
                                    {appointmentData?.reason ||
                                        t('appointments.detail.noReasonProvided')}
                                </p>
                                <span className="text-danger">
                                    {t('appointments.detail.cancelledBy')}{' '}
                                    {appointmentData?.cancelledBy === 'Patient'
                                        ? t('appointments.detail.cancelledByYou')
                                        : t('appointments.detail.cancelledByHospital')}{' '}
                                    {t('appointments.detail.cancelledOn')}{' '}
                                    {formatDate(appointmentData?.cancelledAt || '')}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Cancel Appointment Modal */}
            {appointmentData && (
                <ModalCancel
                    show={showCancelModal}
                    onHide={() => {
                        if (!isCancelling) {
                            setShowCancelModal(false);
                        }
                    }}
                    onConfirm={handleCancelConfirm}
                    title={t('appointments.cancelModal.title')}
                    message={t('appointments.cancelModal.message')}
                    confirmText={t('appointments.cancelModal.confirm')}
                    cancelText={t('appointments.cancelModal.cancel')}
                    loading={isCancelling}
                    reasonLabel={t('appointments.cancelModal.reasonLabel')}
                    reasonPlaceholder={t('appointments.cancelModal.reasonPlaceholder')}
                    minReasonLength={10}
                    refundInfo={
                        appointmentData.consultationFees > 0
                            ? getRefundInfo(
                                  appointmentData.appointmentDate,
                                  appointmentData.appointmentTimeId,
                                  undefined,
                                  false
                              ) // Patient cancellation - only show refund info if has payment
                            : undefined
                    }
                />
            )}
        </>
    );
};

export default AppointmentDetailPage;
