import React from 'react';
import { Skeleton, Box, Stack } from '@mui/material';

const BookingHeaderSkeleton: React.FC = () => {
    return (
        <Box className="card-header pt-3">
            <Box className="booking-header pb-0">
                <Box className="card mb-0">
                    <Box className="card-body">
                        {/* Doctor Info Section */}
                        <Stack direction="row" alignItems="center" flexWrap="wrap" gap={2} mb={4}>
                            {/* Doctor Avatar */}
                            <Skeleton
                                variant="circular"
                                width={100}
                                height={100}
                                sx={{ flexShrink: 0 }}
                            />

                            {/* Doctor Details */}
                            <Box>
                                {/* Doctor Name and Rating */}
                                <Stack direction="row" alignItems="center" gap={1} mb={1}>
                                    <Skeleton variant="text" width={200} height={32} />
                                    <Skeleton
                                        variant="rectangular"
                                        width={50}
                                        height={24}
                                        sx={{ borderRadius: '4px' }}
                                    />
                                </Stack>

                                {/* Specialty */}
                                <Skeleton variant="text" width={180} height={24} sx={{ mb: 1 }} />

                                {/* Location */}
                                <Stack direction="row" alignItems="center" gap={2}>
                                    <Skeleton variant="circular" width={20} height={20} />
                                    <Skeleton variant="text" width={240} height={20} />
                                </Stack>
                            </Box>
                        </Stack>

                        {/* Appointment Info Section Title */}
                        <Skeleton variant="text" width={160} height={24} sx={{ mb: 1 }} />

                        {/* Appointment Info Grid */}
                        <Box className="row gx-2 gy-3">
                            {/* Service */}
                            <Box className="col-lg-3 col-sm-6">
                                <Box>
                                    <Skeleton
                                        variant="text"
                                        width={80}
                                        height={22}
                                        sx={{ mb: 1 }}
                                    />
                                    <Skeleton variant="text" width="100%" height={20} />
                                </Box>
                            </Box>

                            {/* Service Type */}
                            <Box className="col-lg-3 col-sm-6">
                                <Box>
                                    <Skeleton
                                        variant="text"
                                        width={80}
                                        height={22}
                                        sx={{ mb: 1 }}
                                    />
                                    <Skeleton variant="text" width="100%" height={20} />
                                </Box>
                            </Box>

                            {/* Date & Time */}
                            <Box className="col-lg-3 col-sm-6">
                                <Box>
                                    <Skeleton
                                        variant="text"
                                        width={100}
                                        height={22}
                                        sx={{ mb: 1 }}
                                    />
                                    <Skeleton variant="text" width="100%" height={20} />
                                </Box>
                            </Box>

                            {/* Appointment Type */}
                            <Box className="col-lg-3 col-sm-6">
                                <Box>
                                    <Skeleton
                                        variant="text"
                                        width={120}
                                        height={22}
                                        sx={{ mb: 1 }}
                                    />
                                    <Skeleton variant="text" width="100%" height={20} />
                                </Box>
                            </Box>
                        </Box>
                        <Box className="col-lg-3 col-sm-6" sx={{ mt: 1 }}>
                            <Box>
                                <Skeleton variant="text" width={120} height={22} sx={{ mb: 1 }} />
                                <Skeleton variant="text" width="100%" height={20} />
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default BookingHeaderSkeleton;
