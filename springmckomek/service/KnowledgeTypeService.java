package kz.kdlolymp.springmckomek.service;

import kz.kdlolymp.springmckomek.entity.Knowledge;
import kz.kdlolymp.springmckomek.entity.KnowledgeType;
import kz.kdlolymp.springmckomek.repositories.KnowledgeTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.util.List;

@Service
public class KnowledgeTypeService {
    @PersistenceContext
    private EntityManager manager;
    @Autowired
    private KnowledgeTypeRepository typeRepository;
    @Autowired
    private KnowledgeService knowledgeService;

    public void deleteType(int tipeId){
        typeRepository.deleteById(tipeId);
    }
    public List<KnowledgeType> getTypesByKnowledgeId(int knowledgeId){
        return typeRepository.findAllByKnowledgeIdOrderByTypeNameAsc(knowledgeId);
    }
    public KnowledgeType getTypeById(int typeId){
        return typeRepository.findById(typeId);
    }

    public KnowledgeType changeName(int typeId, String typeName) {
        KnowledgeType typeFromDb = typeRepository.findById(typeId);
        KnowledgeType type = typeRepository.findByTypeName(typeName);
        if(type == null){
            typeFromDb.setTypeName(typeName);
            type = typeRepository.save(typeFromDb);
            return type;
        } else {
            return null;
        }
    }

    public boolean addType(String typeName, int knowledgeId) {
        KnowledgeType typeFromDb = typeRepository.findByTypeName(typeName);
        if(typeFromDb!=null && typeFromDb.getId()!=null){
            return false;
        } else {
            Knowledge knowledge = knowledgeService.getKnowledgeById(knowledgeId);
            KnowledgeType type = new KnowledgeType(typeName, knowledge);
            typeRepository.save(type);
            return true;
        }

    }
}
