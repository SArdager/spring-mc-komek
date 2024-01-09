package kz.kdlolymp.springmckomek.repositories;

import kz.kdlolymp.springmckomek.entity.Doctor;
import kz.kdlolymp.springmckomek.entity.Speciality;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Repository;

import java.util.List;

@Component
@Repository
public interface DoctorRepository extends JpaRepository<Doctor, Integer> {

    Doctor findById(int id);

    List<Doctor> findAllByCenterId(int centerId);

    List<Doctor> findAllByCenterIdOrderByDoctorNameAsc(int centerId);

    List<Doctor> findAllBySpecialityId(int specialityId);

    List<Doctor> findAllByServicesId(int serviceId);




}
