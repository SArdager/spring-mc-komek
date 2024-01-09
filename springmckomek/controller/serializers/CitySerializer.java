package kz.kdlolymp.springmckomek.controller.serializers;

import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonSerializationContext;
import com.google.gson.JsonSerializer;
import kz.kdlolymp.springmckomek.entity.City;

import java.lang.reflect.Type;

public class CitySerializer implements JsonSerializer<City> {
    @Override
    public JsonElement serialize(City city, Type type, JsonSerializationContext jsonSerializationContext) {
        JsonObject jObject = new JsonObject();
        if(city!=null) {
            jObject.addProperty("id", city.getId());
            jObject.addProperty("cityName", city.getCityName());
        }
        return jObject;
    }
}
