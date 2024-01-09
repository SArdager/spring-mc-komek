package kz.kdlolymp.springmckomek.controller.serializers;

import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonSerializationContext;
import com.google.gson.JsonSerializer;
import kz.kdlolymp.springmckomek.entity.Article;

import java.lang.reflect.Type;

public class ArticleSerializer implements JsonSerializer<Article> {
    @Override
    public JsonElement serialize(Article article, Type type, JsonSerializationContext jsonSerializationContext) {
        JsonObject jObject = new JsonObject();
        if(article!=null) {
            jObject.addProperty("id", article.getId());
            jObject.addProperty("text", article.getText());
            jObject.addProperty("language", article.getLanguage());
            jObject.addProperty("knowledgeName", article.getKnowledgeType().getKnowledge().getKnowledgeName());
            jObject.addProperty("typeName", article.getKnowledgeType().getTypeName());
            jObject.addProperty("col", article.getCol());
            jObject.addProperty("row", article.getRow());
        }
        return jObject;
    }
}
