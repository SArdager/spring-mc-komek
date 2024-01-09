package kz.kdlolymp.springmckomek.controller.serializers;

import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonSerializationContext;
import com.google.gson.JsonSerializer;
import kz.kdlolymp.springmckomek.entity.Doctor;

import java.lang.reflect.Type;

public class DoctorSerializer implements JsonSerializer<Doctor> {
    @Override
    public JsonElement serialize(Doctor doctor, Type type, JsonSerializationContext jsonSerializationContext) {
        JsonObject jObject = new JsonObject();
        if(doctor!=null) {
            jObject.addProperty("id", doctor.getId());
            jObject.addProperty("centerName", doctor.getCenter().getCenterName());
            jObject.addProperty("specialityName", doctor.getSpeciality().getSpecialityName());
            jObject.addProperty("specialityId", doctor.getSpeciality().getId());
            jObject.addProperty("serviceName", doctor.getServices().getServiceName());
            jObject.addProperty("serviceId", doctor.getServices().getId());
            jObject.addProperty("addition", doctor.getAddition());
            jObject.addProperty("doctorName", doctor.getDoctorName());
            jObject.addProperty("experience", doctor.getExperience());
            jObject.addProperty("workTime", doctor.getWorkTime());
            jObject.addProperty("description", doctor.getDescription());
            jObject.addProperty("col", doctor.getCol());
            jObject.addProperty("row", doctor.getRow());
        }
        return jObject;
    }
}
