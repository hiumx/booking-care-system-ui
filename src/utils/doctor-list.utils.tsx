import React from 'react';
import DoctorCard from '@/components/DoctorCard';
import { buildPath, PATHS, replacePathParams } from '@/routes/paths';

/**
 * Doctor display format returned by convertToDoctorFormat
 */
interface DoctorDisplayFormat {
    id: string;
    name: string;
    image: string;
    specialty: string;
    hospitalName: string;
    hospitalId?: string;
    rating: number;
    experience: string;
    positionName?: string;
    serviceTypeName?: string;
    amount?: number;
    specialtiesLink: string;
}

/**
 * Creates list items for doctor carousel/grid display
 * Used by Home and AboutUs pages to avoid code duplication
 */
export const createDoctorListItems = (
    doctors: DoctorDisplayFormat[]
): { id: string | number; node: React.ReactNode }[] => {
    return doctors.map((doctor) => ({
        id: doctor.id,
        node: (
            <DoctorCard
                key={doctor.id}
                image={doctor.image}
                name={doctor.name}
                specialty={doctor.specialty}
                hospitalName={doctor.hospitalName}
                hospitalId={doctor.hospitalId}
                rating={doctor.rating}
                experience={doctor.experience}
                positionName={doctor.positionName}
                serviceTypeName={doctor.serviceTypeName}
                amount={doctor.amount}
                profileLink={replacePathParams(buildPath(PATHS.DOCTOR.ROOT, PATHS.DOCTOR.PROFILE), {
                    id: doctor.id,
                })}
                bookingLink={replacePathParams(PATHS.BOOKING.ROOT, { doctorId: doctor.id })}
                specialtiesLink={doctor.specialtiesLink}
            />
        ),
    }));
};
