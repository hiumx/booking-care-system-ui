import React from 'react';
import { Skeleton, Box, Stack } from '@mui/material';

const AppointmentDetailSkeleton: React.FC = () => {
    return (
        <div className="appointment-details-wrap">
            {/* Appointment Detail Card Skeleton */}
            <div className="appointment-wrap appointment-detail-card">
                <ul>
                    {/* Doctor/Service/Hospital Information */}
                    <li>
                        <div className="patinet-information">
                            <Box>
                                <Skeleton
                                    variant="circular"
                                    width={100}
                                    height={100}
                                    sx={{ borderRadius: '12px' }}
                                />
                            </Box>
                            <div className="patient-info flex-fill ms-3">
                                <Skeleton variant="text" width={100} height={16} />
                                <Skeleton variant="text" width={180} height={24} sx={{ mt: 1 }} />
                                <div className="mail-info-patient">
                                    <ul>
                                        <li>
                                            <Stack direction="row" alignItems="center" spacing={1}>
                                                <Skeleton
                                                    variant="circular"
                                                    width={16}
                                                    height={16}
                                                />
                                                <Skeleton variant="text" width={200} height={16} />
                                            </Stack>
                                        </li>
                                        <li>
                                            <Stack direction="row" alignItems="center" spacing={1}>
                                                <Skeleton
                                                    variant="circular"
                                                    width={16}
                                                    height={16}
                                                />
                                                <Skeleton variant="text" width={120} height={16} />
                                            </Stack>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </li>

                    {/* Appointment Type */}
                    <li className="appointment-info">
                        <div className="person-info">
                            <Skeleton variant="text" width={100} height={16} />
                            <Stack direction="row" spacing={1} mt={1}>
                                <Skeleton
                                    variant="rectangular"
                                    width={100}
                                    height={24}
                                    sx={{ borderRadius: '12px' }}
                                />
                            </Stack>
                        </div>
                    </li>

                    {/* Badge and Fees */}
                    <li className="appointment-action">
                        <div className="detail-badge-info">
                            <Skeleton
                                variant="rectangular"
                                width={120}
                                height={28}
                                sx={{ borderRadius: '14px' }}
                            />
                        </div>
                        <div className="consult-fees">
                            <Skeleton variant="text" width={150} height={20} />
                        </div>
                    </li>
                </ul>

                {/* Bottom Details */}
                <ul className="detail-card-bottom-info">
                    <li>
                        <Skeleton variant="text" width={120} height={20} />
                        <Skeleton variant="text" width={200} height={18} sx={{ mt: 0.5 }} />
                    </li>
                    <li>
                        <Skeleton variant="text" width={140} height={20} />
                        <Skeleton variant="text" width={250} height={18} sx={{ mt: 0.5 }} />
                    </li>
                    <li>
                        <Skeleton variant="text" width={110} height={20} />
                        <Skeleton variant="text" width={180} height={18} sx={{ mt: 0.5 }} />
                    </li>
                    <li>
                        <Skeleton
                            variant="rectangular"
                            width={200}
                            height={40}
                            sx={{ borderRadius: '20px', mt: 1 }}
                        />
                    </li>
                </ul>
            </div>
            {/* /Appointment Detail Card Skeleton */}
        </div>
    );
};

export default AppointmentDetailSkeleton;
