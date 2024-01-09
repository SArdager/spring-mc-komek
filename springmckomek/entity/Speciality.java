package kz.kdlolymp.springmckomek.entity;

import org.springframework.stereotype.Component;

import javax.persistence.*;

@Entity
@Component
@Table(name="specialities")
public class Speciality {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "speciality_id")
    private int id;
    @Column(name = "speciality_name")
    private String specialityName;

    public Speciality() {
    }

    public Speciality(String specialityName) {
        this.specialityName = specialityName;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getSpecialityName() {
        return specialityName;
    }

    public void setSpecialityName(String specialityName) {
        this.specialityName = specialityName;
    }
}
