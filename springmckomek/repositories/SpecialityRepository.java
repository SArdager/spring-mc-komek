package kz.kdlolymp.springmckomek.repositories;

import kz.kdlolymp.springmckomek.entity.Speciality;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Repository;

import java.util.List;

@Component
@Repository
public interface SpecialityRepository extends JpaRepository<Speciality, Integer> {

    Speciality findById(int id);

    Speciality findBySpecialityName(String specialityName);

    List<Speciality> findAll();

}
