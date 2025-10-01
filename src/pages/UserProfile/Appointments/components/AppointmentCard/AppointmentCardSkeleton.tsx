import React from 'react';
import { Skeleton, Box, Stack } from '@mui/material';

const AppointmentCardSkeleton: React.FC = () => {
    return (
        <div className="appointment-wrap">
            <ul>
                {/* Doctor Information */}
                <li>
                    <div className="patinet-information">
                        <Box>
                            <Skeleton
                                variant="circular"
                                width={60}
                                height={60}
                                sx={{ borderRadius: '12px' }}
                            />
                        </Box>
                        <div className="patient-info">
                            <Skeleton variant="text" width={80} height={16} />
                            <Skeleton variant="text" width={120} height={20} />
                        </div>
                    </div>
                </li>

                {/* Appointment Information */}
                <li className="appointment-info">
                    <Skeleton variant="text" width={150} height={18} />
                    <Stack direction="row" spacing={1} mt={1}>
                        <Skeleton
                            variant="rectangular"
                            width={80}
                            height={24}
                            sx={{ borderRadius: '12px' }}
                        />
                        <Skeleton
                            variant="rectangular"
                            width={70}
                            height={24}
                            sx={{ borderRadius: '12px' }}
                        />
                    </Stack>
                </li>

                {/* Contact Information */}
                <li className="mail-info-patient">
                    <ul>
                        <li>
                            <Stack direction="row" alignItems="center" spacing={1}>
                                <Skeleton variant="circular" width={16} height={16} />
                                <Skeleton variant="text" width={140} height={16} />
                            </Stack>
                        </li>
                        <li>
                            <Stack direction="row" alignItems="center" spacing={1}>
                                <Skeleton variant="circular" width={16} height={16} />
                                <Skeleton variant="text" width={100} height={16} />
                            </Stack>
                        </li>
                    </ul>
                </li>

                {/* Action Buttons */}
                <li className="appointment-action">
                    <ul>
                        <li>
                            <Skeleton variant="circular" width={32} height={32} />
                        </li>
                        <li>
                            <Skeleton variant="circular" width={32} height={32} />
                        </li>
                        <li>
                            <Skeleton variant="circular" width={32} height={32} />
                        </li>
                    </ul>
                </li>
                <li className="appointment-detail-btn">
                    <Skeleton
                        variant="rectangular"
                        width={120}
                        height={40}
                        sx={{ borderRadius: '20px' }}
                    />
                </li>
            </ul>
        </div>
    );
};

export default AppointmentCardSkeleton;
