interface DoctorScheduleProps {
    doctorId?: string;
}

const DoctorSchedule: React.FC<DoctorScheduleProps> = ({ doctorId }) => {
    return <div>Doctor ID: {doctorId}</div>;
};

export default DoctorSchedule;
