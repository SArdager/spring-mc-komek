package kz.kdlolymp.springmckomek.service;

import kz.kdlolymp.springmckomek.entity.Services;
import kz.kdlolymp.springmckomek.entity.Speciality;
import kz.kdlolymp.springmckomek.repositories.ServicesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.util.ArrayList;
import java.util.List;

@Service
public class ServicesService {
    @PersistenceContext
    private EntityManager manager;
    @Autowired
    private ServicesRepository servicesRepository;

    public Services getServiceById(int serviceId){
        return servicesRepository.findById(serviceId);
    }
    public List<Services> getAllServices(boolean withAll){
        List<Services> services = servicesRepository.findAll(Sort.by(Sort.Direction.ASC, "serviceName"));
        int pos = 0;
        for(int i=0; i<services.size(); i++){
            if(services.get(i).getId() == 1){
                pos = i;
            }
        }
        Services service = services.get(pos);
        services.remove(pos);
        if(withAll){
            List<Services> newServices = new ArrayList<>();
            newServices.add(service);
            for(int j=0; j<services.size(); j++){
                if(services.get(j)!=null){
                    newServices.add(services.get(j));
                }
            }
            return newServices;
        } else {
            return services;
        }
    }

    public boolean addServices(String serviceName) {
        Services servicesFromDb = servicesRepository.findByServiceName(serviceName);
        if(servicesFromDb!=null && servicesFromDb.getId()>0){
            return  false;
        } else {
            Services services = new Services(serviceName);
            servicesRepository.save(services);
            return true;
        }
    }

    public boolean changeServices(int serviceId, String serviceName) {
        Services servicesFromDb = servicesRepository.findByServiceName(serviceName);
        if(servicesFromDb!=null && servicesFromDb.getId()!=serviceId){
            return  false;
        } else {
            Services services = servicesRepository.findById(serviceId);
            services.setServiceName(serviceName);
            servicesRepository.save(services);
            return true;
        }
    }

    public void deleteServices(int serviceId) {
        Services services = getServiceById(serviceId);
        servicesRepository.delete((services));
    }
}
