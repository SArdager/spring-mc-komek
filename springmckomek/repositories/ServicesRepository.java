package kz.kdlolymp.springmckomek.repositories;

import kz.kdlolymp.springmckomek.entity.Services;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Repository;

import java.util.List;

@Component
@Repository
public interface ServicesRepository extends JpaRepository<Services, Integer> {

    Services findById(int id);

    Services findByServiceName(String serviceName);

    List<Services> findAll();

}
