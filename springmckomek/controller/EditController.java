package kz.kdlolymp.springmckomek.controller;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import kz.kdlolymp.springmckomek.controller.serializers.*;
import kz.kdlolymp.springmckomek.entity.*;
import kz.kdlolymp.springmckomek.service.*;
import net.minidev.json.JSONUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Controller
public class EditController {

    @Autowired
    KnowledgeService knowledgeService;
    @Autowired
    KnowledgeTypeService typeService;
    @Autowired
    ArticleService articleService;
    @Autowired
    CityService cityService;
    @Autowired
    CenterService centerService;
    @Autowired
    DoctorService doctorService;
    @Autowired
    SpecialityService specialityService;
    @Autowired
    ServicesService servicesService;
    private Gson gson = new Gson();

    @PostMapping("/editor/change-knowledge")
    public void editKnowledge(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        req.setCharacterEncoding("UTF-8");
        int knowledgeId = Integer.parseInt(req.getParameter("knowledgeId"));
        String knowledgeName = req.getParameter("knowledgeName");
        Knowledge knowledge = knowledgeService.changeName(knowledgeId, knowledgeName);
        resp.setContentType("json");
        resp.setCharacterEncoding("UTF-8");
        GsonBuilder builder = new GsonBuilder();
        builder.registerTypeAdapter(Knowledge.class, new KnowledgeSerializer());
        resp.getWriter().print(builder.create().toJson(knowledge));
        resp.getWriter().flush();
        resp.getWriter().close();
    }

    @PostMapping("/editor/add-knowledge")
    public void addKnowledge(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        req.setCharacterEncoding("UTF-8");
        String knowledgeName = req.getParameter("knowledgeName");
        List<Knowledge> knowledgeList = new ArrayList<>();
        if(knowledgeService.addKnowledge(knowledgeName)){
            knowledgeList = knowledgeService.getAll();
        }
        resp.setContentType("json");
        resp.setCharacterEncoding("UTF-8");
        GsonBuilder builder = new GsonBuilder();
        builder.registerTypeAdapter(Knowledge.class, new KnowledgeSerializer());
        resp.getWriter().print(builder.create().toJson(knowledgeList));
        resp.getWriter().flush();
        resp.getWriter().close();
    }

    @PostMapping("/editor/del-knowledge")
    public void delKnowledge(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        req.setCharacterEncoding("UTF-8");
        int knowledgeId = Integer.parseInt(req.getParameter("knowledgeId"));
        List<KnowledgeType> types = typeService.getTypesByKnowledgeId(knowledgeId);
        if(types!=null && types.size()>0) {
            for (KnowledgeType type : types) {
                if(articleService.delAllByType(type.getId())){
                    typeService.deleteType(type.getId());
                }
            }
        }
        knowledgeService.deleteKnowledge(knowledgeId);
        List<Knowledge> knowledgeList = knowledgeService.getAll();
        resp.setContentType("json");
        resp.setCharacterEncoding("UTF-8");
        GsonBuilder builder = new GsonBuilder();
        builder.registerTypeAdapter(Knowledge.class, new KnowledgeSerializer());
        resp.getWriter().print(builder.create().toJson(knowledgeList));
        resp.getWriter().flush();
        resp.getWriter().close();
    }

    @PostMapping("/editor/change-type")
    public void editType(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        req.setCharacterEncoding("UTF-8");
        int typeId = Integer.parseInt(req.getParameter("typeId"));
        String typeName = req.getParameter("typeName");
        KnowledgeType type = typeService.changeName(typeId, typeName);
        resp.setContentType("json");
        resp.setCharacterEncoding("UTF-8");
        GsonBuilder builder = new GsonBuilder();
        builder.registerTypeAdapter(KnowledgeType.class, new TypeSerializer());
        resp.getWriter().print(builder.create().toJson(type));
        resp.getWriter().flush();
        resp.getWriter().close();
    }

    @PostMapping("/editor/add-type")
    public void addType(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        req.setCharacterEncoding("UTF-8");
        int knowledgeId = Integer.parseInt(req.getParameter("knowledgeId"));
        String typeName = req.getParameter("typeName");
        List<KnowledgeType> types = new ArrayList<>();
        if(typeService.addType(typeName, knowledgeId)){
            types = typeService.getTypesByKnowledgeId(knowledgeId);
        }
        resp.setContentType("json");
        resp.setCharacterEncoding("UTF-8");
        GsonBuilder builder = new GsonBuilder();
        builder.registerTypeAdapter(KnowledgeType.class, new TypeSerializer());
        resp.getWriter().print(builder.create().toJson(types));
        resp.getWriter().flush();
        resp.getWriter().close();
    }

    @PostMapping("/editor/del-type")
    public void delType(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        req.setCharacterEncoding("UTF-8");
        int knowledgeId = Integer.parseInt(req.getParameter("knowledgeId"));
        int typeId = Integer.parseInt(req.getParameter("typeId"));
        if(articleService.delAllByType(typeId)){
            typeService.deleteType(typeId);
        }
        List<KnowledgeType> types = typeService.getTypesByKnowledgeId(knowledgeId);
        resp.setContentType("json");
        resp.setCharacterEncoding("UTF-8");
        GsonBuilder builder = new GsonBuilder();
        builder.registerTypeAdapter(KnowledgeType.class, new TypeSerializer());
        resp.getWriter().print(builder.create().toJson(types));
        resp.getWriter().flush();
        resp.getWriter().close();
    }

    @PostMapping("/editor/save-text")
    public void saveText(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        req.setCharacterEncoding("UTF-8");
        int typeId = Integer.parseInt(req.getParameter("typeId"));
        int articleId = 0;
        if(req.getParameter("articleId")!=null && req.getParameter("articleId").length()>0) {
            articleId = Integer.parseInt(req.getParameter("articleId"));
        }
        int col = 1;
        if(req.getParameter("col")!=null && req.getParameter("col").length()>0) {
            col = Integer.parseInt(req.getParameter("col"));
        }
        int row = 1;
        if(req.getParameter("row")!=null && req.getParameter("row").length()>0) {
            row = Integer.parseInt(req.getParameter("row"));
        }
        String text = req.getParameter("text");
        String language = req.getParameter("language");
        String message;
        KnowledgeType type = typeService.getTypeById(typeId);
        if(articleId>0){
            if(articleService.changeArticle(articleId, language, text, type, col, row)){
                message = "Статья изменена и записана в базе данных";
            } else {
                message = "Ошибка записи в базу данных. Перегрузите страницу.";
            }
        } else {
            Article article = new Article(language, text, type, col, row);
            if(articleService.createArticle(article)){
                message = "Статья создана и записана в базе данных";
            } else {
                message = "Ошибка записи в базу данных. Перегрузите страницу.";
            }
        }
        resp.setContentType("text");
        resp.setCharacterEncoding("UTF-8");
        resp.getWriter().print(message);
        resp.getWriter().flush();
        resp.getWriter().close();
    }

    @PostMapping("/editor/change-city")
    public void editCity(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        req.setCharacterEncoding("UTF-8");
        int cityId = Integer.parseInt(req.getParameter("cityId"));
        String cityName = req.getParameter("cityName");
        City city = cityService.changeName(cityId, cityName);
        resp.setContentType("json");
        resp.setCharacterEncoding("UTF-8");
        GsonBuilder builder = new GsonBuilder();
        builder.registerTypeAdapter(City.class, new CitySerializer());
        resp.getWriter().print(builder.create().toJson(city));
        resp.getWriter().flush();
        resp.getWriter().close();
    }

    @PostMapping("/editor/add-city")
    public void addCity(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        req.setCharacterEncoding("UTF-8");
        String cityName = req.getParameter("cityName");
        List<City> cities = new ArrayList<>();
        if(cityService.addCity(cityName)){
            cities = cityService.getAll(false);
        }
        resp.setContentType("json");
        resp.setCharacterEncoding("UTF-8");
        GsonBuilder builder = new GsonBuilder();
        builder.registerTypeAdapter(City.class, new CitySerializer());
        resp.getWriter().print(builder.create().toJson(cities));
        resp.getWriter().flush();
        resp.getWriter().close();
    }

    @PostMapping("/editor/del-city")
    public void delCity(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        req.setCharacterEncoding("UTF-8");
        int cityId = Integer.parseInt(req.getParameter("cityId"));
        List<Center> centers =  centerService.getOnlyCentersByCity(cityId);
        if(centers!=null && centers.size()>0) {
            for (Center center : centers) {
                if(doctorService.deleteAllDoctorsByCenter(center.getId())){
                    centerService.deleteCenter(center.getId());
                }
            }
        }
        cityService.deleteCity(cityId);
        List<City> cities = cityService.getAll(false);
        resp.setContentType("json");
        resp.setCharacterEncoding("UTF-8");
        GsonBuilder builder = new GsonBuilder();
        builder.registerTypeAdapter(City.class, new CitySerializer());
        resp.getWriter().print(builder.create().toJson(cities));
        resp.getWriter().flush();
        resp.getWriter().close();
    }

    @PostMapping("/editor/get-center")
    public void getCenter(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        req.setCharacterEncoding("UTF-8");
        int centerId = Integer.parseInt(req.getParameter("centerId"));
        boolean isDoc = Boolean.parseBoolean(req.getParameter("isDoc"));
        Center center = centerService.getCenterById(centerId);
        List<Doctor> doctors = doctorService.getDoctorsByCenterId(centerId, isDoc);
        center.setDoctors(doctors);
        resp.setContentType("json");
        resp.setCharacterEncoding("UTF-8");
        gson = new GsonBuilder()
                .registerTypeAdapter(Center.class, new CenterSerializer())
                .registerTypeAdapter(Doctor.class, new DoctorSerializer())
                .create();
        resp.getWriter().print(gson.toJson(center));
        resp.getWriter().flush();
        resp.getWriter().close();
    }

    @PostMapping("/editor/get-doctor")
    public void getDoctor(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        req.setCharacterEncoding("UTF-8");
        int doctorId = Integer.parseInt(req.getParameter("doctorId"));
        Doctor doctor = new Doctor();
        if(doctorId>0) {
            doctor = doctorService.getDoctorById(doctorId);
        }
        resp.setContentType("json");
        resp.setCharacterEncoding("UTF-8");
        gson = new GsonBuilder()
                .registerTypeAdapter(Doctor.class, new DoctorSerializer())
                .create();
        resp.getWriter().print(gson.toJson(doctor));
        resp.getWriter().flush();
        resp.getWriter().close();
    }

    @PostMapping("/editor/del-doctor")
    public void deleteDoctor(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        req.setCharacterEncoding("UTF-8");
        int doctorId = Integer.parseInt(req.getParameter("doctorId"));
        String message = "Ошибка изменения записи в базе данных. Попробуйте позднее.";
        if(doctorId>0) {
            Doctor doctor = doctorService.getDoctorById(doctorId);
            if(doctorService.deleteDoctor(doctor)){
                message = "Врач удален из базы данных";
            }
        }
        resp.setContentType("text");
        resp.setCharacterEncoding("UTF-8");
        resp.getWriter().print(message);
        resp.getWriter().flush();
        resp.getWriter().close();
    }

    @PostMapping("/editor/get-services")
    public void getCenterServices(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        req.setCharacterEncoding("UTF-8");
        int centerId = 1;
        if(req.getParameter("centerId")!=null && req.getParameter("centerId").length()>0) {
            centerId = Integer.parseInt(req.getParameter("centerId"));
        }
        List<Doctor> doctors = doctorService.getDoctorsByCenterId(centerId, false);
        resp.setContentType("json");
        resp.setCharacterEncoding("UTF-8");
        gson = new GsonBuilder()
                .registerTypeAdapter(Doctor.class, new DoctorSerializer())
                .create();
        resp.getWriter().print(gson.toJson(doctors));
        resp.getWriter().flush();
        resp.getWriter().close();
    }

    @PostMapping("/editor/add-center")
    public void addCenter(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        req.setCharacterEncoding("UTF-8");
        int cityId = Integer.parseInt(req.getParameter("cityId"));
        String centerName = req.getParameter("centerName");
        List<Center> centers = new ArrayList<>();
        if(centerService.addCenter(centerName, cityId)){
            centers = centerService.getOnlyCentersByCity(cityId);
        }
        resp.setContentType("json");
        resp.setCharacterEncoding("UTF-8");
        GsonBuilder builder = new GsonBuilder();
        builder.registerTypeAdapter(Center.class, new CenterSerializer());
        resp.getWriter().print(builder.create().toJson(centers));
        resp.getWriter().flush();
        resp.getWriter().close();
    }

    @PostMapping("/editor/del-center")
    public void deleteCenter(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        req.setCharacterEncoding("UTF-8");
        int cityId = Integer.parseInt(req.getParameter("cityId"));
        int centerId = Integer.parseInt(req.getParameter("centerId"));
        if(doctorService.deleteAllDoctorsByCenter(centerId)){
            centerService.deleteCenter(centerId);
        }
        List<Center> centers = centerService.getOnlyCentersByCity(cityId);
        resp.setContentType("json");
        resp.setCharacterEncoding("UTF-8");
        GsonBuilder builder = new GsonBuilder();
        builder.registerTypeAdapter(Center.class, new CenterSerializer());
        resp.getWriter().print(builder.create().toJson(centers));
        resp.getWriter().flush();
        resp.getWriter().close();
    }

    @PostMapping("/editor/change-center")
    public void editCenter(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        req.setCharacterEncoding("UTF-8");
        int centerId = Integer.parseInt(req.getParameter("centerId"));
        String centerName = req.getParameter("centerName");
        String centerFullName = req.getParameter("centerFullName");
        String address = req.getParameter("address");
        String transport = req.getParameter("transport");
        String description = req.getParameter("description");
        Center center = centerService.getCenterById(centerId);
        center.setCenterName(centerName);
        center.setCenterFullName(centerFullName);
        center.setCenterAddress(address);
        center.setTransport(transport);
        center.setCenterDescription(description);
        String message = "Ошибка изменения описания медицинского центра. Повторите позже.";
        if(centerService.changeCenter(center)){
            message = "Описание медицинского центра внесено (изменено).";
        }
        resp.setContentType("text");
        resp.setCharacterEncoding("UTF-8");
        resp.getWriter().print(message);
        resp.getWriter().flush();
        resp.getWriter().close();
    }

    @PostMapping("/editor/add-speciality")
    public void addSpeciality(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        req.setCharacterEncoding("UTF-8");
        String specialityName = req.getParameter("specialityName");
        List<Speciality> specialities = new ArrayList<>();
        if(specialityService.addSpeciality(specialityName)){
            specialities = specialityService.getAllSpecialities(false);
        }
        resp.setContentType("json");
        resp.setCharacterEncoding("UTF-8");
        GsonBuilder builder = new GsonBuilder();
        builder.registerTypeAdapter(Speciality.class, new SpecialitySerializer());
        resp.getWriter().print(builder.create().toJson(specialities));
        resp.getWriter().flush();
        resp.getWriter().close();
    }

    @PostMapping("/editor/del-speciality")
    public void deleteSpeciality(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        req.setCharacterEncoding("UTF-8");
        int specialityId = Integer.parseInt(req.getParameter("specialityId"));
        String message ="Ошибка изменения записей в базе данных. Попробуйте позднее.";
        if(specialityId>0) {
            if (doctorService.deleteAllDoctorsBySpeciality(specialityId)) {
                specialityService.deleteSpeciality(specialityId);
                message = "Специализация и все врачи с данной специализацией удалены из базы данных";
            }
        }
        resp.setContentType("text");
        resp.setCharacterEncoding("UTF-8");
        resp.getWriter().print(message);
        resp.getWriter().flush();
        resp.getWriter().close();
    }

    @PostMapping("/editor/change-speciality")
    public void editSpeciality(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        req.setCharacterEncoding("UTF-8");
        int specialityId = Integer.parseInt(req.getParameter("specialityId"));
        String specialityName = req.getParameter("specialityName");
        String message = "Ошибка изменения названия специализации. Возможно такая специализация уже зарегистрирована в базе данных.";
        if(specialityService.changeSpeciality(specialityId, specialityName)){
            message = "Название специализации изменено.";
        }
        resp.setContentType("text");
        resp.setCharacterEncoding("UTF-8");
        resp.getWriter().print(message);
        resp.getWriter().flush();
        resp.getWriter().close();
    }

    @PostMapping("/editor/del-services")
    public void deleteServices(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        req.setCharacterEncoding("UTF-8");
        int serviceId = Integer.parseInt(req.getParameter("serviceId"));
        String message ="Ошибка изменения записей в базе данных. Попробуйте позднее.";
        if(serviceId>0) {
            if (doctorService.deleteAllDoctorsByServices(serviceId)) {
                servicesService.deleteServices(serviceId);
                message = "Услуга и все врачи с данной услугой удалены из базы данных";
            }
        }
        resp.setContentType("text");
        resp.setCharacterEncoding("UTF-8");
        resp.getWriter().print(message);
        resp.getWriter().flush();
        resp.getWriter().close();
    }

    @PostMapping("/editor/add-services")
    public void addServices(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        req.setCharacterEncoding("UTF-8");
        String serviceName = req.getParameter("serviceName");
        List<Services> servicesList = new ArrayList<>();
        if(servicesService.addServices(serviceName)){
            servicesList = servicesService.getAllServices(false);
        }
        resp.setContentType("json");
        resp.setCharacterEncoding("UTF-8");
        GsonBuilder builder = new GsonBuilder();
        builder.registerTypeAdapter(Services.class, new ServicesSerializer());
        resp.getWriter().print(builder.create().toJson(servicesList));
        resp.getWriter().flush();
        resp.getWriter().close();
    }

    @PostMapping("/editor/change-services")
    public void editServices(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        req.setCharacterEncoding("UTF-8");
        int serviceId = Integer.parseInt(req.getParameter("serviceId"));
        String serviceName = req.getParameter("serviceName");
        String message = "Ошибка изменения названия услуги. Возможно такая услуга уже зарегистрирована в базе данных.";
        if(servicesService.changeServices(serviceId, serviceName)){
            message = "Название услуги изменено.";
        }
        resp.setContentType("text");
        resp.setCharacterEncoding("UTF-8");
        resp.getWriter().print(message);
        resp.getWriter().flush();
        resp.getWriter().close();
    }

    @PostMapping("/editor/save-description")
    public void saveDescription(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        req.setCharacterEncoding("UTF-8");
        int serviceId = Integer.parseInt(req.getParameter("serviceId"));
        int specialityId = Integer.parseInt(req.getParameter("specialityId"));
        int doctorId = Integer.parseInt(req.getParameter("doctorId"));
        int col = Integer.parseInt(req.getParameter("col"));
        int row = Integer.parseInt(req.getParameter("row"));
        int centerId = Integer.parseInt(req.getParameter("centerId"));
        String doctorName = req.getParameter("doctorName");
        String experience = req.getParameter("experience");
        String addition = req.getParameter("addition");
        String doctorWorkTime = req.getParameter("doctorWorkTime");
        String text = req.getParameter("text");
        Speciality speciality = specialityService.getSpecialityById(specialityId);
        Services services = servicesService.getServiceById(serviceId);
        Center center = centerService.getCenterById(centerId);
        Doctor doctor = new Doctor();
        Doctor doctorFromDb;
        String message = "Ошибка изменения описания врача (услуги). Возможно врач (услуга) уже зарегистрированы в базе данных.";
        if(doctorId>0){
            doctorFromDb = doctorService.getDoctorById(doctorId);
        } else {
            doctorFromDb = doctorService.getDoctorByCenterAndNameAndS(centerId, doctorName, specialityId, serviceId);
        }
        if(doctorFromDb != null || doctorFromDb.getDoctorName() != null){
            doctor.setId(doctorFromDb.getId());
        }
        doctor.setDoctorName(doctorName);
        doctor.setCenter(center);
        doctor.setSpeciality(speciality);
        doctor.setServices(services);
        doctor.setExperience(experience);
        doctor.setAddition(addition);
        doctor.setWorkTime(doctorWorkTime);
        doctor.setDescription(text);
        doctor.setCol(col);
        doctor.setRow(row);
        if(doctorService.saveDoctor(doctor)!=null){
            message = "Описание врача (услуги) изменено.";
        }
        resp.setContentType("text");
        resp.setCharacterEncoding("UTF-8");
        resp.getWriter().print(message);
        resp.getWriter().flush();
        resp.getWriter().close();
    }



}
