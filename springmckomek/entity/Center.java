package kz.kdlolymp.springmckomek.entity;

import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import org.springframework.stereotype.Component;

import javax.persistence.*;
import java.io.Serializable;
import java.util.List;

@Entity
@Component
@Table(name="centers")
public class Center {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "center_id")
    private int id;
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name="city_id", nullable = false)
    private City city;
    @Column(name = "center_name")
    private String centerName;
    @Column(name = "center_full_name")
    private String centerFullName;
    @Column(name = "center_address")
    private String centerAddress;
    @Column(name = "center_description")
    private String centerDescription;
    @Column(name = "transport")
    private String transport;
    @Transient
    private List<Doctor> doctors;

    public Center() { }

    public Center(City city, String centerName) {
        this.city = city;
        this.centerName = centerName;
    }

    public int getId() { return id; }

    public void setId(int id) { this.id = id; }

    public City getCity() {return city;}

    public void setCity(City city) {this.city = city;}

    public String getCenterName() { return centerName; }

    public void setCenterName(String centerName) { this.centerName = centerName; }

    public String getCenterFullName() { return centerFullName; }

    public void setCenterFullName(String centerFullName) { this.centerFullName = centerFullName; }

    public String getCenterAddress() { return centerAddress; }

    public void setCenterAddress(String centerAddress) { this.centerAddress = centerAddress; }

    public String getCenterDescription() { return centerDescription; }

    public void setCenterDescription(String centerDescription) { this.centerDescription = centerDescription; }

    public String getTransport() { return transport; }

    public void setTransport(String transport) { this.transport = transport; }

    public List<Doctor> getDoctors() { return doctors; }

    public void setDoctors(List<Doctor> doctors) { this.doctors = doctors; }

}

