package kz.kdlolymp.springmckomek.entity;

import org.springframework.stereotype.Component;

import javax.persistence.*;

@Entity
@Component
@Table(name="knowledge")
public class Knowledge {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "knowledge_id")
    private Integer id;
    @Column(name = "knowledge_name")
    private String knowledgeName;

    public Knowledge() { }

    public Knowledge(String knowledgeName) {
        this.knowledgeName = knowledgeName;
    }


    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getKnowledgeName() { return knowledgeName; }

    public void setKnowledgeName(String knowledgeName) { this.knowledgeName = knowledgeName; }
}
