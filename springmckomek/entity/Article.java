package kz.kdlolymp.springmckomek.entity;

import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import org.springframework.stereotype.Component;

import javax.persistence.*;

@Entity
@Component
@Table(name="articles")
public class Article {
    @Id
    @Column(columnDefinition = "serial", name = "article_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @Column(name = "article_language")
    private String language;
    @Column(name = "article_text")
    private String text;
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name="type_id", nullable = false)
    private KnowledgeType knowledgeType;
    @Column(name = "col")
    private int col;
    @Column(name = "row")
    private int row;

    public Article() {
    }

    public Article(String language, String text, KnowledgeType knowledgeType, int col, int row) {
        this.language = language;
        this.text = text;
        this.knowledgeType = knowledgeType;
        this.col = col;
        this.row = row;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getLanguage() { return language; }

    public void setLanguage(String language) { this.language = language; }

    public String getText() { return text; }

    public void setText(String text) { this.text = text; }


    public int getCol() { return col; }

    public void setCol(int col) { this.col = col; }

    public int getRow() { return row; }

    public void setRow(int row) { this.row = row; }

    public KnowledgeType getKnowledgeType() {return knowledgeType;}

    public void setKnowledgeType(KnowledgeType knowledgeType) {this.knowledgeType = knowledgeType;}


}
