package kz.kdlolymp.springmckomek.repositories;

import kz.kdlolymp.springmckomek.entity.Center;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Repository;

import java.util.List;

@Component
@Repository
public interface CenterRepository extends JpaRepository<Center, Integer> {

    Center findById(int id);

    List<Center> findAll();


    List<Center> findAllByCityId(int cityId);
}
