package kz.kdlolymp.springmckomek.repositories;

import kz.kdlolymp.springmckomek.entity.City;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Repository;

import java.util.List;

@Component
@Repository
public interface CityRepository extends JpaRepository<City, Integer> {
    City findById(int id);
    City findByCityName(String cityName);
    List<City> findAll();

}
