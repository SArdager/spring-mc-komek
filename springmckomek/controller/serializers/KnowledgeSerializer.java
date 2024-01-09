package kz.kdlolymp.springmckomek.controller.serializers;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonSerializationContext;
import com.google.gson.JsonSerializer;
import kz.kdlolymp.springmckomek.entity.Knowledge;

import java.lang.reflect.Type;

public class KnowledgeSerializer implements JsonSerializer<Knowledge> {


    @Override
    public JsonElement serialize(Knowledge knowledge, Type type, JsonSerializationContext jsonSerializationContext) {
        JsonObject jObject = new JsonObject();
        if(knowledge!=null) {
            jObject.addProperty("id", knowledge.getId());
            jObject.addProperty("knowledgeName", knowledge.getKnowledgeName());
        }
        return jObject;
    }
}
