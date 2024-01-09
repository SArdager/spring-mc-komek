package kz.kdlolymp.springmckomek.controller.serializers;

import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonSerializationContext;
import com.google.gson.JsonSerializer;
import kz.kdlolymp.springmckomek.entity.Speciality;

import java.lang.reflect.Type;

public class SpecialitySerializer implements JsonSerializer<Speciality> {
    @Override
    public JsonElement serialize(Speciality speciality, Type type, JsonSerializationContext jsonSerializationContext) {
        JsonObject jObject = new JsonObject();
        if(speciality!=null) {
            jObject.addProperty("id", speciality.getId());
            jObject.addProperty("specialityName", speciality.getSpecialityName());
        }
        return jObject;
    }
}
