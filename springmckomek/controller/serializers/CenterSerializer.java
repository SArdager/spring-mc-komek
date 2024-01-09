package kz.kdlolymp.springmckomek.controller.serializers;

import com.google.gson.*;
import kz.kdlolymp.springmckomek.entity.Center;

import java.lang.reflect.Type;

public class CenterSerializer implements JsonSerializer<Center> {
    @Override
    public JsonElement serialize(Center center, Type type, JsonSerializationContext context) {
        JsonObject jObject = new JsonObject();
        if(center!=null) {
            jObject.addProperty("id", center.getId());
            jObject.addProperty("centerName", center.getCenterName());
            String fullName = "";
            String address = "";
            String transport = "";
            String description = "";
            if(center.getCenterFullName()!=null){
                fullName = center.getCenterFullName();
            }
            if(center.getCenterAddress()!=null){
                address = center.getCenterAddress();
            }
            if(center.getTransport()!=null){
                transport = center.getTransport();
            }
            if(center.getCenterDescription()!=null){
                description = center.getCenterDescription();
            }
            jObject.addProperty("centerFullName", fullName);
            jObject.addProperty("centerAddress", address);
            jObject.addProperty("transport", transport);
            jObject.addProperty("centerDescription", description);
            if(center.getDoctors()!=null && center.getDoctors().size()>0){
                JsonArray doctors = new JsonArray();
                for(int i=0; i<center.getDoctors().size(); i++){
                    JsonElement doctor = context.serialize(center.getDoctors().get(i));
                    doctors.add(doctor);
                }
                jObject.add("doctors", doctors);
            }
        }
        return jObject;
    }
}
