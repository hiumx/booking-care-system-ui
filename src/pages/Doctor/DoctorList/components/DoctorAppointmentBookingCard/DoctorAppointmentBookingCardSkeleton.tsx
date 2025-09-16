import { Skeleton, Box, Stack } from '@mui/material';

const DoctorAppointmentBookingCardSkeleton: React.FC = () => {
    return (
        <Box
            display="flex"
            border="1px solid #e0e0e0"
            borderRadius="16px"
            boxShadow="0px 2px 6px rgba(0,0,0,0.05)"
            maxWidth="966px"
            mx="auto"
        >
            {/* Left: Doctor Image */}
            <Box position="relative" width={300} height={248} flexShrink={0}>
                <Skeleton
                    variant="rectangular"
                    width="100%"
                    height="100%"
                    sx={{ borderRadius: '12px' }}
                />
                <Box position="absolute" top={20} left={16}>
                    <Skeleton variant="rectangular" width={50} height={24} />
                </Box>
                <Box position="absolute" top={20} right={16}>
                    <Skeleton variant="circular" width={24} height={24} />
                </Box>
            </Box>

            {/* Right: Content */}
            <Stack p={2} flex={1} pl={3} justifyContent="space-between">
                {/* Top Section */}
                <Box>
                    <Skeleton variant="text" width={120} height={20} /> {/* Specialty */}
                    <Skeleton variant="text" width={200} height={28} /> {/* Name */}
                    <Skeleton variant="text" width={180} height={18} /> {/* Title */}
                    <Stack direction="row" spacing={2} mt={1}>
                        <Skeleton variant="circular" width={20} height={20} />
                        <Skeleton variant="text" width={100} height={18} />
                    </Stack>
                    <Stack direction="row" spacing={2} mt={1}>
                        <Skeleton variant="circular" width={20} height={20} />
                        <Skeleton variant="text" width={140} height={18} />
                    </Stack>
                </Box>

                {/* Bottom Section */}
                <Box
                    display="flex"
                    flexWrap="wrap"
                    alignItems="center"
                    justifyContent="space-between"
                    mt={2}
                >
                    <Box>
                        <Skeleton variant="text" width={80} height={22} /> {/* Fee */}
                        <Skeleton variant="text" width={160} height={18} /> {/* Next time */}
                    </Box>
                    <Skeleton
                        variant="rectangular"
                        width={160}
                        height={44}
                        sx={{ borderRadius: '8px' }}
                    />
                </Box>
            </Stack>
        </Box>
    );
};

export default DoctorAppointmentBookingCardSkeleton;
