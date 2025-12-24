import speciality01 from '@/assets/img/specialities/speciality-01.jpg';
import speciality02 from '@/assets/img/specialities/speciality-02.jpg';
import speciality03 from '@/assets/img/specialities/speciality-03.jpg';
import speciality04 from '@/assets/img/specialities/speciality-04.jpg';
import speciality05 from '@/assets/img/specialities/speciality-05.jpg';
import speciality06 from '@/assets/img/specialities/speciality-06.jpg';
import speciality07 from '@/assets/img/specialities/speciality-07.jpg';
import speciality08 from '@/assets/img/specialities/speciality-08.jpg';

// Fallback images for specialties
export const specialtyImages = [
    speciality01,
    speciality02,
    speciality03,
    speciality04,
    speciality05,
    speciality06,
    speciality07,
    speciality08,
];

// Convert API data to Service format
export const convertToServiceFormat = (categories: any[]) => {
    return categories.map((category) => ({
        id: category.id,
        name: category.name,
        image: category.imageUrl,
    }));
};

// Convert API specialties data to Home format
export const convertToSpecialtyFormat = (apiSpecialties: any[]) => {
    return apiSpecialties.map((specialty, index) => ({
        id: specialty.id,
        name: specialty.name,
        image: specialtyImages[index % specialtyImages.length],
        icon: specialty.imageUrl,
        doctorCount: specialty.doctorCount,
    }));
};

// Convert API hospital data to Home format
export const convertToHospitalFormat = (apiHospitals: any[]) => {
    return apiHospitals.map((hospital) => ({
        id: hospital.id,
        name: hospital.name,
        image: hospital.avatarUrl || '/default-hospital.png',
        specialties: hospital.specialties?.map((s: any) => s.name) || [],
        address: hospital.address,
        specialtyCount: hospital.totalSpecialties || hospital.specialties?.length || 0,
    }));
};

// Convert API doctor data to Home format
export const convertToDoctorFormat = (apiDoctors: any[]) => {
    return apiDoctors.map((doctor) => ({
        id: doctor.id,
        name: `${doctor.lastName} ${doctor.firstName}`,
        image: doctor.avatarUrl || '/default-doctor.png',
        specialty: doctor.specialty?.name || 'Chuyên khoa',
        hospitalName: doctor.hospital?.name || 'Bệnh viện',
        hospitalId: doctor.hospitalId || doctor.hospital?.id, // Add hospitalId
        rating: doctor.reviewStatistics?.averageRating || 0,
        experience: `${doctor.yearsOfExperience || 0} năm kinh nghiệm`,
        positionName: doctor.position?.name,
        serviceTypeName: doctor.prices?.[0]?.serviceTypeName,
        amount: doctor.prices?.[0]?.amount,
        specialtiesLink: `/doctors?specialtyId=${doctor.specialty?.id || ''}`,
    }));
};

// Sort doctors by rating (highest first)
export const sortDoctorsByRating = (doctors: any[]) => {
    return doctors.sort((a, b) => {
        const ratingA = a.reviewStatistics?.averageRating || 0;
        const ratingB = b.reviewStatistics?.averageRating || 0;
        return ratingB - ratingA;
    });
};
