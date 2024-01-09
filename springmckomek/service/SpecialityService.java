package kz.kdlolymp.springmckomek.service;

import kz.kdlolymp.springmckomek.entity.City;
import kz.kdlolymp.springmckomek.entity.Speciality;
import kz.kdlolymp.springmckomek.repositories.SpecialityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class SpecialityService {
    @Autowired
    private SpecialityRepository specialityRepository;

    public Speciality getSpecialityById(int specialityId){
        return specialityRepository.findById(specialityId);
    }

    public List<Speciality> getAllSpecialities(boolean withAll){
        List<Speciality> specialities = specialityRepository.findAll(Sort.by(Sort.Direction.ASC, "specialityName"));
        int pos = 0;
        for(int i=0; i<specialities.size(); i++){
            if(specialities.get(i).getId() == 1){
                pos = i;
            }
        }
        Speciality speciality = specialities.get(pos);
        specialities.remove(pos);
        if(withAll){
            List<Speciality> newSpecialities = new ArrayList<>();
            newSpecialities.add(speciality);
            for(int j=0; j<specialities.size(); j++){
                if(specialities.get(j)!=null){
                    newSpecialities.add(specialities.get(j));
                }
            }
            return newSpecialities;
        } else {
            return specialities;
        }
    }


    public boolean addSpeciality(String specialityName) {
        Speciality specialityFromDb = specialityRepository.findBySpecialityName(specialityName);
        if(specialityFromDb!=null && specialityFromDb.getId()>0){
            return  false;
        } else {
            Speciality speciality = new Speciality(specialityName);
            specialityRepository.save(speciality);
            return true;
        }
    }

    public boolean changeSpeciality(int specialityId, String specialityName) {
        Speciality specialityFromDb = specialityRepository.findBySpecialityName(specialityName);
        if(specialityFromDb!=null && specialityFromDb.getId()!=specialityId){
            return  false;
        } else {
            Speciality speciality = specialityRepository.findById(specialityId);
            speciality.setSpecialityName(specialityName);
            specialityRepository.save(speciality);
            return true;
        }
    }

    public void deleteSpeciality(int specialityId) {
        Speciality speciality = getSpecialityById(specialityId);
        specialityRepository.delete(speciality);
    }
}
