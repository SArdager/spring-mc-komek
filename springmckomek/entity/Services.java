package kz.kdlolymp.springmckomek.entity;

import org.springframework.stereotype.Component;

import javax.persistence.*;

@Entity
@Component
@Table(name="services")
public class Services {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "service_id")
    private int id;
    @Column(name = "service_name")
    private String serviceName;

    public Services() {
    }

    public Services(String serviceName) {
        this.serviceName = serviceName;
    }

    public int getId() {return id;}

    public void setId(int id) {this.id = id;}

    public String getServiceName() {return serviceName;}

    public void setServiceName(String serviceName) {this.serviceName = serviceName;}
}
