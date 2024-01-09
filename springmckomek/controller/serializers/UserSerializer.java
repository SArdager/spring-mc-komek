package kz.kdlolymp.springmckomek.controller.serializers;

import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonSerializationContext;
import com.google.gson.JsonSerializer;
import kz.kdlolymp.springmckomek.entity.User;

import java.lang.reflect.Type;

public class UserSerializer implements JsonSerializer<User>{
    @Override
    public JsonElement serialize(User user, Type type, JsonSerializationContext jsonSerializationContext) {
        JsonObject jObject = new JsonObject();
        if(user!=null) {
            jObject.addProperty("id", user.getId());
            jObject.addProperty("userSurname", user.getUserSurname());
            jObject.addProperty("userFirstname", user.getUserFirstname());
            jObject.addProperty("username", user.getUsername());
            jObject.addProperty("position", user.getPosition());
            jObject.addProperty("email", user.getEmail());
            jObject.addProperty("isEnabled", user.isEnabled());
            jObject.addProperty("isTemporary", user.isTemporary());
            jObject.addProperty("role", user.getRole());
            jObject.addProperty("editor", user.isEditor());
        }
        return jObject;
    }
}
