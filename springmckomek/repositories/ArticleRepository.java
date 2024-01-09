package kz.kdlolymp.springmckomek.repositories;

import kz.kdlolymp.springmckomek.entity.Article;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Repository;

@Component
@Repository
public interface ArticleRepository extends JpaRepository<Article, Integer> {

    Article findById(int id);

}
