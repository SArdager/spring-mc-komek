package kz.kdlolymp.springmckomek.controller.serializers;

import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonSerializationContext;
import com.google.gson.JsonSerializer;
import kz.kdlolymp.springmckomek.entity.KnowledgeType;

import java.lang.reflect.Type;

public class TypeSerializer implements JsonSerializer<KnowledgeType> {

    @Override
    public JsonElement serialize(KnowledgeType knowledgeType, Type type, JsonSerializationContext jsonSerializationContext) {
        JsonObject jObject = new JsonObject();
        if(knowledgeType!=null) {
            jObject.addProperty("id", knowledgeType.getId());
            jObject.addProperty("typeName", knowledgeType.getTypeName());
            jObject.addProperty("knowledgeName", knowledgeType.getKnowledge().getKnowledgeName());
            jObject.addProperty("knowledgeId", knowledgeType.getKnowledge().getId());
        }
        return jObject;
    }
}
