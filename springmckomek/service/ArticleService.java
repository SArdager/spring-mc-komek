package kz.kdlolymp.springmckomek.service;

import kz.kdlolymp.springmckomek.entity.Article;
import kz.kdlolymp.springmckomek.entity.KnowledgeType;
import kz.kdlolymp.springmckomek.repositories.ArticleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.persistence.EntityManager;
import javax.persistence.NoResultException;
import javax.persistence.PersistenceContext;
import java.util.List;

@Service
public class ArticleService {
    @PersistenceContext
    private EntityManager manager;
    @Autowired
    private ArticleRepository articleRepository;
    @Autowired
    private KnowledgeTypeService typeService;

    public Article getArticleById(int articleId){
        return articleRepository.findById(articleId);
    }

    public List<Article> getAllByType(int typeId) {
        List<Article> articles = manager.createQuery("SELECT a FROM Article a WHERE a.knowledgeType.id = :paramType", Article.class)
                    .setParameter("paramType", typeId).getResultList();
        return articles;
    }

    public boolean delAllByType(int typeId){
        List<Article> articles = getAllByType(typeId);
        if(articles!=null && articles.size()>0){
            for(Article article: articles){
                articleRepository.delete(article);
            }
        }
        return true;
    }

    public Article getArticle(int typeId, String language) {
        Article article;
        try{
            article = manager.createQuery("SELECT a FROM Article a WHERE a.knowledgeType.id = :paramType " +
                            "AND a.language = :paramLanguage", Article.class).setParameter("paramType", typeId)
                            .setParameter("paramLanguage", language).getSingleResult();
        } catch (NoResultException ex) {
            article = new Article();
            KnowledgeType type = typeService.getTypeById(typeId);
            article.setKnowledgeType(type);
            article.setCol(1);
            article.setRow(1);
            article.setLanguage(language);
            if (language.equals("kz")) {
                article.setText("<tr><td>Қазақ тіліндегі мақала дерекқордан табылмады.</td></tr>");
            } else {
                article.setText("<tr><td>Статья на русском языке в базе данных не найдена.</td></tr>");
            }
        }

        return article;
    }


    public List<Article> getArticlesByText(String text) {
        String[] words = text.split(" ", 5);
        String addSelect = "";
        for (int i = 0; i < words.length; i++) {
            if(i>0) {
                addSelect += " AND";
            }
            addSelect += " a.text LIKE '%" + words[i] + "%'";
        }
        List<Article> articles = manager.createQuery("SELECT a FROM Article a WHERE" + addSelect, Article.class).getResultList();
        articles = selectTextFromArticle(articles, words);

        return articles;
    }

    private List<Article> selectTextFromArticle(List<Article> articles, String[] words) {
        for(Article article: articles){
            String text = article.getText();
            boolean isSearching = true;
            for (int i = 0; i < words.length; i++) {
                if(isSearching) {
                    String word = words[i];
                    int wrd = text.indexOf(word);
                    if (wrd > -1) {
                        int start = 0;
                        int end = text.length();
                        int lng = text.length();
                        if (wrd > 100) {
                            start = text.indexOf(" ", wrd - 100) + 1;
                        }
                        if (wrd + 200 < lng) {
                            end = wrd + 200;
                        }
                        text = text.substring(start, end);
                        if (start > 0) {
                            text = "..." + text;
                        }
                        if (end < lng) {
                            text = text + "...";
                        }
                        text = underlineWords(text, words);
                        isSearching = false;
                    }
                } else {
                    i = words.length;
                }
            }
            article.setText(text);
        }
        return articles;
    }

    private String underlineWords(String text, String[] words) {
        for(int i=0; i<words.length; i++){
            String word = words[i];
            int s = text.indexOf(word);
            while(s>-1){
                text = text.substring(0, s) + "<u><b>" + text.substring(s, s+word.length()) + "</b></u>" +
                        text.substring(s+word.length());
                s = text.indexOf(word, s+word.length()+14);
            }
        }
        return text;
    }

    public boolean createArticle(Article article) {
        Article articleFromDb = getArticle(article.getKnowledgeType().getId(), article.getLanguage());
        if(articleFromDb!=null && articleFromDb.getId()!=null){
            changeArticle(articleFromDb.getId(), article.getLanguage(), article.getText(), article.getKnowledgeType(),
                    article.getCol(), article.getRow());
        } else {
            articleRepository.save(article);
        }
        return true;
    }
    public boolean changeArticle(int articleId, String language, String text, KnowledgeType type, int col, int row) {
        Article articleFromDb = getArticleById(articleId);
        if(articleFromDb!=null && articleFromDb.getId()==articleId){
            articleFromDb.setLanguage(language);
            articleFromDb.setText(text);
            articleFromDb.setKnowledgeType(type);
            articleFromDb.setRow(row);
            articleFromDb.setCol(col);
            articleRepository.save(articleFromDb);
            return true;
        } else {
            return false;
        }
    }

}
