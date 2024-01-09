package kz.kdlolymp.springmckomek.controller.serializers;

import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonSerializationContext;
import com.google.gson.JsonSerializer;
import kz.kdlolymp.springmckomek.entity.Services;

import java.lang.reflect.Type;

public class ServicesSerializer implements JsonSerializer<Services> {
    @Override
    public JsonElement serialize(Services services, Type type, JsonSerializationContext jsonSerializationContext) {
        JsonObject jObject = new JsonObject();
        if(services!=null) {
            jObject.addProperty("id", services.getId());
            jObject.addProperty("serviceName", services.getServiceName());
        }
        return jObject;
    }
}
