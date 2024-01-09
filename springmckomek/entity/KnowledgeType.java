package kz.kdlolymp.springmckomek.entity;

import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import org.springframework.stereotype.Component;

import javax.persistence.*;

@Entity
@Component
@Table(name="knowledge_types")
public class KnowledgeType {

    @Id
    @Column(columnDefinition = "serial", name = "type_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @Column(name = "type_name")
    private String typeName;
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name="knowledge_id", nullable = false)
    private Knowledge knowledge;

    public KnowledgeType() {
    }

    public KnowledgeType(String typeName, Knowledge knowledge) {
        this.typeName = typeName;
        this.knowledge = knowledge;
    }

    public void setTypeId(int id) { this.id = id; }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getTypeName() { return typeName; }

    public void setTypeName(String typeName) { this.typeName = typeName; }

    public Knowledge getKnowledge() {return knowledge;}

    public void setKnowledge(Knowledge knowledge) {this.knowledge = knowledge;}
}
