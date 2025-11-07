import { Skeleton, Box } from '@mui/material';

const NotificationSkeleton: React.FC = () => {
    return (
        <Box
            sx={{
                padding: '16px',
                borderBottom: '1px solid #e0e0e0',
                backgroundColor: 'transparent',
            }}
        >
            <div className="d-flex gap-3">
                {/* Icon Skeleton */}
                <Skeleton variant="circular" width={48} height={48} sx={{ flexShrink: 0 }} />

                {/* Content Skeleton */}
                <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                    {/* Title and Time Row */}
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'start',
                            marginBottom: '8px',
                        }}
                    >
                        <Skeleton variant="text" width="60%" height={24} />
                        <Skeleton variant="text" width={80} height={20} />
                    </Box>

                    {/* Content Text */}
                    <Skeleton variant="text" width="90%" height={20} sx={{ marginBottom: '8px' }} />
                    <Skeleton
                        variant="text"
                        width="70%"
                        height={20}
                        sx={{ marginBottom: '12px' }}
                    />

                    {/* Action Buttons Row */}
                    <Box sx={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <Skeleton
                            variant="rectangular"
                            width={150}
                            height={32}
                            sx={{ borderRadius: '4px' }}
                        />
                        <Skeleton
                            variant="rectangular"
                            width={80}
                            height={32}
                            sx={{ borderRadius: '4px' }}
                        />
                    </Box>
                </Box>
            </div>
        </Box>
    );
};

export default NotificationSkeleton;
