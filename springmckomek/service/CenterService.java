package kz.kdlolymp.springmckomek.service;

import kz.kdlolymp.springmckomek.entity.*;
import kz.kdlolymp.springmckomek.repositories.CenterRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.persistence.EntityManager;
import javax.persistence.NoResultException;
import javax.persistence.PersistenceContext;
import java.util.ArrayList;
import java.util.List;

@Service
public class CenterService {
    @PersistenceContext
    private EntityManager manager;
    @Autowired
    private CenterRepository centerRepository;
    @Autowired
    private SpecialityService specialityService;
    @Autowired
    private DoctorService doctorService;
    @Autowired
    private CityService cityService;

    public List<Center> getOnlyCentersByCity(int cityId) {
        return centerRepository.findAllByCityId(cityId);
    }

    public List<Center> getCentersByCityId(int cityId, boolean isDoc){
        List<Center> centers = centerRepository.findAllByCityId(cityId);
        for(Center center: centers){
            List<Doctor> doctors;
            if(isDoc) {
                doctors = doctorService.getDoctorsByCenterAndSpeciality(center.getId(), 1);
            } else {
                doctors = doctorService.getDoctorsByCenterAndServices(center.getId(), 1);
            }
            center.setDoctors(doctors);
        }
        return centers;
    }

    public List<Center> getCentersDoctors(int cityId, int centerId, boolean isDoc) {
        List<Center> centers = new ArrayList<>();
        List<Doctor> doctors;
        if(isDoc){
            if(centerId > 0){
                Center center = centerRepository.findById(centerId);
                doctors = doctorService.getDoctorsByCenterAndSpeciality(centerId, 1);
                center.setDoctors(doctors);
                centers.add(center);
            } else {
                centers = centerRepository.findAllByCityId(cityId);
                for(Center center: centers){
                    doctors = doctorService.getDoctorsByCenterAndSpeciality(center.getId(), 1);
                    center.setDoctors(doctors);
                }
            }
        } else{
            if(centerId > 0){
                Center center = centerRepository.findById(centerId);
                doctors = doctorService.getDoctorsByCenterAndServices(centerId, 1);
                center.setDoctors(doctors);
                centers.add(center);
            } else {
                centers = centerRepository.findAllByCityId(cityId);
                for(Center center: centers){
                    doctors = doctorService.getDoctorsByCenterAndServices(center.getId(), 1);
                    center.setDoctors(doctors);
                }
            }
        }
        return centers;
    }
    public Center getCenterDoctors(int centerId, boolean isDoc) {
        Center center = new Center();
        List<Doctor> doctors;
        if(centerId > 0){
            center = centerRepository.findById(centerId);
            if(isDoc){
                doctors = doctorService.getDoctorsByCenterAndSpeciality(centerId, 1);
                center.setDoctors(doctors);
            } else {
                doctors = doctorService.getDoctorsByCenterAndServices(centerId, 1);
                center.setDoctors(doctors);
            }
        }
        return center;
    }

    public Center getCenterByNameAndCity(String centerName, int cityId){
        Center center;
        try{
            center = manager.createQuery("SELECT c FROM Center c WHERE c.city.id = :paramCity " +
                            "AND c.centerName = :paramName", Center.class).setParameter("paramCity", cityId)
                    .setParameter("paramName", centerName).getSingleResult();
        } catch (NoResultException ex) {
            center = new Center();
        }
        return center;
    }
    public boolean addCenter(String centerName, int cityId) {
        Center centerFromDb = getCenterByNameAndCity(centerName, cityId);
        if(centerFromDb!=null && centerFromDb.getCenterName()!=null){
            return false;
        } else {
            City city = cityService.getCityById(cityId);
            Center center = new Center(city, centerName);
            centerRepository.save(center);
            return true;
        }
    }

    public Center getCenterById(int centerId) {
        return centerRepository.findById(centerId);
    }

    public void deleteCenter(int centerId) {
        centerRepository.deleteById(centerId);
    }

    public boolean changeCenter(Center center) {
        centerRepository.save(center);
        return true;
    }


}
