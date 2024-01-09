package kz.kdlolymp.springmckomek.service;

import kz.kdlolymp.springmckomek.entity.Doctor;
import kz.kdlolymp.springmckomek.repositories.DoctorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.persistence.EntityManager;
import javax.persistence.NoResultException;
import javax.persistence.PersistenceContext;
import java.util.List;

@Service
public class DoctorService {
    @PersistenceContext
    private EntityManager manager;
    @Autowired
    private DoctorRepository doctorRepository;

    public Doctor getDoctorById(int doctorId){
        return doctorRepository.findById(doctorId);
    }
    public Doctor saveDoctor(Doctor doctor){
        return doctorRepository.save(doctor);
    }
    public List<Doctor> getDoctorsByCenterId(int centerId, boolean isDoc){
        List<Doctor> doctors;
        if(isDoc){
            doctors = manager.createQuery("SELECT d FROM Doctor d WHERE d.center.id = :paramCenter AND d.speciality.id > 1",
                    Doctor.class).setParameter("paramCenter", centerId).getResultList();
        } else {
            doctors = manager.createQuery("SELECT d FROM Doctor d WHERE d.center.id = :paramCenter AND d.services.id > 1",
                    Doctor.class).setParameter("paramCenter", centerId).getResultList();
        }
        return doctors;
    }
    public List<Doctor> getDoctorsByCenterAndSpeciality(int centerId, int specialityId){
        List<Doctor> doctors;
        if(specialityId>1) {
            doctors = manager.createQuery("SELECT d FROM Doctor d WHERE d.center.id = :paramCenter AND d.speciality.id = :paramSpec",
                    Doctor.class).setParameter("paramCenter", centerId).setParameter("paramSpec", specialityId).getResultList();
        } else {
            doctors = manager.createQuery("SELECT d FROM Doctor d WHERE d.center.id = :paramCenter AND d.speciality.id > 1",
                    Doctor.class).setParameter("paramCenter", centerId).getResultList();
        }
        return doctors;
    }

    public List<Doctor> getDoctorsByCenterAndServices(int centerId, int serviceId){
        List<Doctor> doctors;
        if(serviceId>1) {
            doctors = manager.createQuery("SELECT d FROM Doctor d WHERE d.center.id = :paramCenter AND d.services.id = :paramSrv",
                    Doctor.class).setParameter("paramCenter", centerId).setParameter("paramSrv", serviceId).getResultList();
        } else {
            doctors = manager.createQuery("SELECT d FROM Doctor d WHERE d.center.id = :paramCenter AND d.services.id > 1",
                    Doctor.class).setParameter("paramCenter", centerId).getResultList();
        }
        return doctors;
    }

    public List<Doctor> getCenterDoctorsByService(int centerId, int serviceId) {
        List<Doctor>doctors = manager.createQuery("SELECT d FROM Doctor d WHERE d.center.id = :paramCenter " +
                        "AND d.services.id = :paramService", Doctor.class).setParameter("paramCenter", centerId)
                .setParameter("paramService", serviceId).getResultList();
        return doctors;
    }

    public boolean deleteAllDoctorsByCenter(int centerId) {
        List<Doctor> doctors = doctorRepository.findAllByCenterId(centerId);
        if(doctors!=null && doctors.size()>0){
            for(Doctor doctor: doctors){
                doctorRepository.deleteById(doctor.getId());
            }
        }
        return true;
    }

    public boolean deleteAllDoctorsBySpeciality(int specialityId) {
        List<Doctor> doctors = doctorRepository.findAllBySpecialityId(specialityId);
        if(doctors!=null && doctors.size()>0) {
            for (Doctor doctor : doctors) {
                doctorRepository.delete(doctor);
            }
        }
        return true;
    }

    public boolean deleteDoctorByService(int serviceId, int doctorId) {
        Doctor doctor = doctorRepository.findById(doctorId);
        if(doctor.getServices().getId() == serviceId){
            doctorRepository.delete(doctor);
            return true;
        } else {
            return false;
        }
    }

    public boolean deleteAllDoctorsByServices(int serviceId) {
        List<Doctor> doctors = doctorRepository.findAllByServicesId(serviceId);
        if(doctors!=null && doctors.size()>0) {
            for (Doctor doctor : doctors) {
                doctorRepository.delete(doctor);
            }
        }
        return  true;
    }

    public boolean deleteDoctor(Doctor doctor) {
        doctorRepository.delete(doctor);
        return true;
    }

    public Doctor getDoctorByCenterAndNameAndS(int centerId, String doctorName, int specialityId, int serviceId) {
        Doctor doctor = new Doctor();
        try {
            doctor = manager.createQuery("SELECT d FROM Doctor d WHERE d.center.id = :paramCenter AND d.doctorName = :paramName AND d.speciality.id = :paramSpec " +
                "AND d.services.id = :paramSer", Doctor.class).setParameter("paramCenter", centerId).setParameter("paramName", doctorName)
                .setParameter("paramSpec", specialityId).setParameter("paramSer", serviceId).getSingleResult();
        } catch (NoResultException ex) {
        }
        return doctor;
    }
}
