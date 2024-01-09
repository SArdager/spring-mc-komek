package kz.kdlolymp.springmckomek.repositories;

import kz.kdlolymp.springmckomek.entity.KnowledgeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Repository;

import java.util.List;

@Component
@Repository
public interface KnowledgeTypeRepository extends JpaRepository<KnowledgeType, Integer> {

    KnowledgeType findById(int id);

    KnowledgeType findByTypeName(String typeName);

    List<KnowledgeType> findAllByKnowledgeIdOrderByTypeNameAsc(int knowledgeId);


}
