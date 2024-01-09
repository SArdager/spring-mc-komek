package kz.kdlolymp.springmckomek.entity;

import org.springframework.stereotype.Component;

import javax.persistence.*;

@Entity
@Component
@Table(name="cities")
public class City {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "city_id")
    private Integer id;
    @Column(name = "city_name")
    private String cityName;

    public City() { }

    public City(String cityName) {
        this.cityName = cityName;
    }

    public City(int id, String cityName) {
        this.id = id;
        this.cityName = cityName;
    }


    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getCityName() { return cityName; }

    public void setCityName(String cityName) { this.cityName = cityName; }
}
