package kz.kdlolymp.springmckomek.service;

import kz.kdlolymp.springmckomek.entity.Knowledge;
import kz.kdlolymp.springmckomek.repositories.KnowledgeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.util.List;

@Service
public class KnowledgeService {
    @PersistenceContext
    private EntityManager manager;
    @Autowired
    private KnowledgeRepository knowledgeRepository;

    public Knowledge getKnowledgeById(int knowledgeId){
        return knowledgeRepository.findById(knowledgeId);
    }

    public List<Knowledge> getAll(){
        return knowledgeRepository.findAll(Sort.by(Sort.Direction.ASC, "knowledgeName"));
    }

    public void deleteKnowledge(int knowledgeId){
        knowledgeRepository.deleteById(knowledgeId);
    }
    public Knowledge changeName(int knowledgeId, String knowledgeName) {
        Knowledge knowledgeFromDb = knowledgeRepository.findById(knowledgeId);
        Knowledge knowledge = knowledgeRepository.findByKnowledgeName(knowledgeName);
        if(knowledge == null){
            knowledgeFromDb.setKnowledgeName(knowledgeName);
            knowledge = knowledgeRepository.save(knowledgeFromDb);
            return knowledge;
        } else {
            return null;
        }
    }


    public boolean addKnowledge(String knowledgeName) {
        Knowledge knowledgeFromDb = knowledgeRepository.findByKnowledgeName(knowledgeName);
        if(knowledgeFromDb!=null && knowledgeFromDb.getId()!=null){
            return false;
        } else {
            Knowledge knowledge = new Knowledge(knowledgeName);
            knowledgeRepository.save(knowledge);
            return true;
        }
    }
}
