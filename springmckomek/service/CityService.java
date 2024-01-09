package kz.kdlolymp.springmckomek.service;

import kz.kdlolymp.springmckomek.entity.City;
import kz.kdlolymp.springmckomek.entity.Knowledge;
import kz.kdlolymp.springmckomek.repositories.CityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.util.ArrayList;
import java.util.List;

@Service
public class CityService {
    @PersistenceContext
    private EntityManager manager;
    @Autowired
    private CityRepository cityRepository;

    public  City getCityById(int cityId){
        return cityRepository.findById(cityId);
    }
    public List<City> getAll(boolean withAll){
        List<City> cities = cityRepository.findAll(Sort.by(Sort.Direction.ASC, "cityName"));
        City cityAll = new City();
        City cityAstana = new City();
        City cityAlmaty = new City();
        for(int i=0; i<cities.size(); i++){
            if(cities.get(i).getCityName().indexOf("Все") > -1){
                cityAll = cities.get(i);
                cities.remove(i);
                i--;
            } else if(cities.get(i).getCityName().indexOf("Астана") > -1){
                cityAstana = cities.get(i);
                cities.remove(i);
                i--;
            } else if(cities.get(i).getCityName().indexOf("Алматы") > -1){
                cityAlmaty = cities.get(i);
                cities.remove(i);
                i--;
            } else{}
        }
        List<City> newCities = new ArrayList<>();
        if(withAll && cityAll!=null){
            newCities.add(cityAll);
        }
        if(cityAstana!=null){
            newCities.add(cityAstana);
        }
        if(cityAlmaty!=null){
            newCities.add(cityAlmaty);
        }

        for(int j=0; j<cities.size(); j++){
            if(cities.get(j)!=null){
                newCities.add(cities.get(j));
            }
        }
        return newCities;
    }

    public City changeName(int cityId, String cityName) {
        City cityFromDb = cityRepository.findById(cityId);
        City city = cityRepository.findByCityName(cityName);
        if(city == null){
            cityFromDb.setCityName(cityName);
            city = cityRepository.save(cityFromDb);
            return city;
        } else {
            return  null;
        }
    }

    public boolean addCity(String cityName) {
        City cityFromDb = cityRepository.findByCityName(cityName);
        if(cityFromDb!=null && cityFromDb.getId()!=null){
            return false;
        } else {
            City city = new City(cityName);
            cityRepository.save(city);
            return true;
        }
    }


    public void deleteCity(int cityId) {
        cityRepository.deleteById(cityId);
    }
}
