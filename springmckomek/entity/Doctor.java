package kz.kdlolymp.springmckomek.entity;

import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import org.springframework.stereotype.Component;

import javax.persistence.*;
import java.io.Serializable;

@Entity
@Component
@Table(name="doctors")
public class Doctor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "doctor_id")
    private int id;
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name="center_id", nullable = false)
    private Center center;
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name="speciality_id", nullable = false)
    private Speciality speciality;
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name="service_id", nullable = false)
    private Services services;
    @Column(name = "addition")
    private String addition;
    @Column(name = "doctor_name")
    private String doctorName;
    @Column(name = "experience")
    private String experience;
    @Column(name = "work_time")
    private String workTime;
    @Column(name = "doctor_description")
    private String description;
    @Column(name = "col_d")
    private int col;
    @Column(name = "row_d")
    private int row;


    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public Center getCenter() {return center;}

    public void setCenter(Center center) {this.center = center;}

    public Speciality getSpeciality() {return speciality;}

    public void setSpeciality(Speciality speciality) {this.speciality = speciality;}

    public Services getServices() {return services;}

    public void setServices(Services services) {this.services = services;}

    public String getAddition() {
        return addition;
    }

    public void setAddition(String addition) {
        this.addition = addition;
    }

    public String getDoctorName() {
        return doctorName;
    }

    public void setDoctorName(String doctorName) {
        this.doctorName = doctorName;
    }

    public String getExperience() {
        return experience;
    }

    public void setExperience(String experience) {
        this.experience = experience;
    }

    public String getWorkTime() {
        return workTime;
    }

    public void setWorkTime(String workTime) {
        this.workTime = workTime;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public int getCol() { return col; }

    public void setCol(int col) { this.col = col; }

    public int getRow() { return row; }

    public void setRow(int row) { this.row = row; }
}
