$(document).ready(function(){

    $('#speciality_edit').click(function(){
        $('#show_speciality').css("display", "block");
        $('#show_service').css("display", "none");
        $('#speciality_edit').attr("class", "background_bold");
        $('#service_edit').attr("class", "background_white");
        $('#doctor_mode').val("true");
        $('#change_city').css("display", "none");
        $('#select_mc').trigger("change");
        cleanDoctorDescription();
    });

    $('#service_edit').click(function(){
        $('#show_speciality').css("display", "none");
        $('#show_service').css("display", "block");
        $('#speciality_edit').attr("class", "background_white");
        $('#service_edit').attr("class", "background_bold");
        $('#doctor_mode').val("false");
        $('#change_city').css("display", "block");
        clearFields();
        $('#select_mc').trigger("change");
    });

    $('#select_city').change (function(){
        $('#change_type').css("display", "none");
        $('#show_center').css("display", "none");
        $('#show_doctors').css("display", "none");
        $('#show_article').css("display", "none");
        $('#change_city').css("display", "block");

        if($('#select_city').val()>0){
            $('#btn_city').val("Изменить");
            $('#btn_del_city').prop("type", "button");
            $('#change_center').css("display", "block");
            $('#btn_del_mc').prop("type", "hidden");
            $('#btn_mc').val("Создать");
            $.ajax({
                url: 'load-data/centers',
                method: 'POST',
                dataType: 'json',
                data: {cityId: $('#select_city').val()},
                success: function(centers) {
                    $('#change_center').css("display", "block");
                    $('#change_mc').css("display", "block");
                    $('#new_name_line').css("display", "block");
                    $('#select_mc').empty();
                    $('#select_mc').append('<option value="-1">Добавить новый мед.центр</option>');
                    if(centers!=null && centers.length>0){
                        $.each(centers, function(key, center){
                            $('#select_mc').append('<option value="' + center.id + '">' + center.centerName + '</option>');
                        });
                    }
                },
                error:  function(response) {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    $('#result_line').html("Ошибка обращения в базу данных. Перегрузите страницу.");
                }
            });
        } else {
            $('#btn_city').val("Создать");
            $('#btn_del_city').prop("type", "hidden");
            $('#change_center').css("display", "none");
        }
    });

    $('#select_mc').change ( function(){
        clearFields();
        $('#change_mc').css("display", "block");
        $('#show_center').css("display", "none");
        $('#select_speciality').val('-1');
        $('#select_service').val('-1');
        cleanDoctorDescription();
        if($('#select_mc').val()>0){
            $('#show_doctors').css("display", "block");
            $('#btn_mc').val("Редактировать");
            $('#btn_del_mc').prop("type", "button");
            $('#change_city').css("display", "none");
            $('#new_name_line').css("display", "none");
            let isDoc;
            if($('#doctor_mode').val() === 'true'){
                isDoc = true;
            } else {
                isDoc = false;
            }
            $.ajax({
                url: 'editor/get-center',
                method: 'POST',
                dataType: 'json',
                data: {centerId: $('#select_mc').val(), isDoc: isDoc},
                success: function(center) {
                    if(center!=null && center.id!=null){
                        $('#center_name').val(center.centerName);
                        $('#center_full_name').val(center.centerFullName);
                        $('#address').val(center.centerAddress);
                        $('#transport').val(center.transport);
                        $('#center_description').val(center.centerDescription);
                        if(center.doctors != null && center.doctors.length >0){
                            let doctors = center.doctors;
                            if($('#doctor_mode').val() === 'true'){
                                $('#btn_doctor').prop("type", "button");
                                $('#btn_del_doctor').prop("type", "hidden");
                                $('#select_doctor').empty();
                                $('#select_new_doctor').empty();
                                $('#select_doctor').append("<option value='-1'>Добавить нового врача</option>");
                                $('#select_new_doctor').append("<option value='-1'>Выберите врача</option>");
                                $.each(doctors, function(key, doctor){
                                    $('#select_doctor').append("<option value='" + doctor.id + "'>" + doctor.doctorName + "</option>");
                                    $('#select_new_doctor').append("<option value='" + doctor.id + "'>" + doctor.doctorName + "</option>");
                                });
                            } else {
                                $('#select_service_doctor').empty();
                                $('#select_center_service').empty();
                                $('#select_all_doctors').empty();
                                $('#select_center_service').append("<option value='-1'>Добавить новую услугу</option>");
                                $('#select_service_doctor').append("<option value='-1'>Добавить специалиста</option>");
                                $('#select_all_doctors').append("<option value='-1'>Выберите специалиста</option>");
                                $('#select_all_doctors').append("<option value='-5'>Специалист</option>");
                                $('#select_all_doctors').append("<option value='-6'>Мед.сестра</option>");
                                $('#select_all_doctors').append("<option value='-7'>Добавить врача мед.центра</option>");
                                $('#select_all_doctors').append("<option value='-9'>Создать нового специалиста</option>");
                                $.each(doctors, function(key, doctor){
                                    $('#select_center_service').append("<option value='" + doctor.id + "$" + doctor.serviceId + "'>" + doctor.serviceName + "</option>");
                                    $('#select_service_doctor').append("<option value='" + doctor.id + "$" + doctor.serviceId + "'>" + doctor.doctorName + "</option>");
                                });
                            }
                        }
                        if($('#doctor_mode').val() === 'true'){
                            $('#show_speciality').css("display", "block");
                            $('#show_service').css("display", "none");
                            $('#select_doctor').val("-1");
                            $('#select_doctor').trigger("change");
                        } else {
                            $('#show_speciality').css("display", "none");
                            $('#show_service').css("display", "block");
                            $('#select_center_service').val('-1');
                            $('#select_service_doctor').val('-1');
                            $('#select_center_service').trigger("change");
                            $('#select_service_doctor').trigger("change");
                        }
                    } else {
                        $('#center_name').val($('#select_mc option:selected').text());
                        $('#center_full_name').val("");
                        $('#address').val("");
                        $('#transport').val("");
                        $('#center_description').val("");
                    }
                    $('#mc_name').val("");
                },
                error:  function(response) {
                    $('#btn_mc').prop("type", "button");
                    $('#btn_del_mc').prop("type", "button");
                    clearFields();
                    $('#result_line').html("Ошибка обращения в базу данных. Перегрузите страницу.");
                }
            });
        } else {
            $('#btn_mc').val("Создать");
            $('#btn_del_mc').prop("type", "hidden");
            $('#new_name_line').css("display", "block");
            $('#change_city').css("display", "block");
            $('#btn_city').val("Изменить");
            clearFields();
        }
    });

    function clearFields(){
        $('#show_doctors').css("display", "none");
        $('#show_speciality').css("display", "block");
        $('#show_service').css("display", "none");
        $('#show_description').css("display", "none");
        $('#show_article').css("display", "none");
    }

    $('#btn_city').on('click', function(){
        if($('#city_name').val().length > 0 ){
            $('#btn_city').prop("type", "hidden");
            $('#btn_del_city').prop("type", "hidden");
            $('#btn_mc').prop("type", "hidden");
            $('#show_center').css("display", "none");
            if($('#select_city').val() > 0 ){
                $.ajax({
                    url: 'editor/change-city',
                    method: 'POST',
                    dataType: 'json',
                    data: {cityId: $('#select_city').val(), cityName: $('#city_name').val()},
                    success: function(city) {
                        $('#btn_city').prop("type", "button");
                        $('#btn_del_city').prop("type", "button");
                        $('#btn_mc').prop("type", "button");
                        if(city!=null && city.id!=null){
                            $('#select_city option:selected').text(city.cityName);
                        } else {
                            $('#result_line').html("Ошибка записи. Возможно новое название уже имеется в базе данных.");
                        }
                        $('#city_name').val("");
                    },
                    error:  function(response) {
                        $('#btn_city').prop("type", "button");
                        $('#btn_del_city').prop("type", "button");
                        $('#btn_mc').prop("type", "button");
                        $('#result_line').html("Ошибка обращения в базу данных. Перегрузите страницу.");
                    }
                });
            } else {
                $.ajax({
                    url: 'editor/add-city',
                    method: 'POST',
                    dataType: 'json',
                    data: {cityName: $('#city_name').val()},
                    success: function(cities) {
                        $('#btn_city').prop("type", "button");
                        $('#btn_mc').prop("type", "button");
                        if(cities!=null && cities.length>0){
                            $('#change_center').css("display", "block");
                            $('#result_line').html("Новый город добавлен в базу данных.");
                            $('#select_city').empty();
                            $('#select_city').append("<option value='-1'>Добавить новый город</option>");
                            $.each(cities, function(key, city){
                                $('#select_city').append("<option value='" + city.id + "'>" + city.cityName + "</option>");
                            });
                            let myKey = Object.keys(cities).find(key => cities[key].cityName===$('#city_name').val());
                            $('#select_city').val(cities[myKey].id);
                            $('#btn_city').val("Изменить");
                            $('#btn_del_city').prop("type", "button");
                            $('#select_mc').empty();
                            $('#select_mc').append("<option value='-1'>Добавить новый мед.центр</option>");
                        } else {
                            $('#result_line').html("Город с таким названием уже имеется в базе данных.");
                        }
                        $('#city_name').val("");
                    },
                    error:  function(response) {
                        $('#btn_city').prop("type", "button");
                        $('#btn_mc').prop("type", "button");
                        $('#result_line').html("Ошибка обращения в базу данных. Перегрузите страницу.");
                    }
                });
            }
        } else {
            $('#result_line').html("Внесите название города в поле ввода нового названия ");
        }
    });

    $('#btn_del_city').on('click', function(){
        if($('#select_city').val() > 0 ){
            let x = confirm("ВНИМАНИЕ!!!\nИз базы данных будут удалены все записи, связанные с данным городом.\n" +
                            "ЭТА ОПЕРАЦИЯ НЕ ВОССТАНОВИМА!!!\n\nПродолжить операцию удаления?");
            if(x){
                $('#btn_city').prop("type", "hidden");
                $('#btn_del_city').prop("type", "hidden");
                $('#btn_mc').prop("type", "hidden");
                $.ajax({
                    url: 'editor/del-city',
                    method: 'POST',
                    dataType: 'json',
                    data: {cityId: $('#select_city').val()},
                    success: function(cities) {
                        $('#btn_city').prop("type", "button");
                        $('#btn_del_city').prop("type", "hidden");
                        $('#btn_mc').prop("type", "button");
                        $('#select_city').empty();
                        $('#select_city').append("<option value='-1'>Добавить новый город</option>");
                        $.each(cities, function(key, city){
                            $('#select_city').append("<option value='" + city.id + "'>" + city.cityName + "</option>");
                        });
                        $('#select_city').val('-1');
                        $('#btn_city').val("Создать");
                        $('#change_center').css("display", "none");
                    },
                    error:  function(response) {
                        $('#btn_city').prop("type", "button");
                        $('#btn_del_city').prop("type", "button");
                        $('#btn_mc').prop("type", "button");
                        $('#result_line').html("Ошибка обращения в базу данных. Перегрузите страницу.");
                    }
                });
            }
        } else {
            $('#result_line').html("Выберите удаляемый город.");
        }
    });

    $('#btn_mc').on('click', function(){
        if($('#select_mc').val() > 0 ){
           $('#show_center').css("display", "block");
        } else {
            if($('#mc_name').val().length > 0 ){
                $('#change_city').css("display", "none");
                $('#btn_mc').prop("type", "hidden");
                $('#btn_del_mc').prop("type", "hidden");
                $.ajax({
                    url: 'editor/add-center',
                    method: 'POST',
                    dataType: 'json',
                    data: {cityId: $('#select_city').val(), centerName: $('#mc_name').val()},
                    success: function(centers) {
                        $('#btn_mc').prop("type", "button");
                        $('#change_mc').css("display", "block");
                        $('#new_name_line').css("display", "block");
                        $('#change_city').css("display", "block");
                        if(centers!=null && centers.length>0){
                            $('#result_line').html("Новый медицинский центр добавлен в базу данных. Внесите его описание.");
                            $('#select_mc').empty();
                            $('#select_mc').append("<option value='-1'>Добавить новый центр</option>");
                            $.each(centers, function(key, center){
                                $('#select_mc').append("<option value='" + center.id + "'>" + center.centerName + "</option>");
                            });
                            let myKey = Object.keys(centers).find(key => centers[key].centerName===$('#mc_name').val());
                            $('#select_mc').val(centers[myKey].id);
                            $('#btn_mc').val("Редактировать");
                            $('#btn_del_mc').prop("type", "button");
                            $('#show_center').css("display", "block");
                            $('#center_name').val($('#mc_name').val());
                        } else {
                            $('#result_line').html("Медицинский центр с таким названием уже зарегистрирован по городу в базе данных.");
                        }
                        $('#mc_name').val("");
                    },
                    error:  function(response) {
                        $('#btn_mc').prop("type", "button");
                        $('#change_city').css("display", "block");
                        $('#result_line').html("Ошибка обращения в базу данных. Перегрузите страницу.");
                    }
                });
            } else {
                $('#result_line').html("Внесите наименование мед.центра в поле ввода нового названия ");
            }
        }
    });

    $('#btn_del_mc').on('click', function(){
        $('#show_center').css("display", "none");
        if($('#select_mc').val() > 0 ){
            let x = confirm("ВНИМАНИЕ!!!\nИз базы данных будут удалены все записи, связанные с данным медицинским центром.\n" +
                            "ЭТА ОПЕРАЦИЯ НЕ ВОССТАНОВИМА!!!\n\nПродолжить операцию удаления?");
            if(x){
                $('#btn_city').prop("type", "hidden");
                $('#btn_del_mc').prop("type", "hidden");
                $('#btn_mc').prop("type", "hidden");
                $.ajax({
                    url: 'editor/del-center',
                    method: 'POST',
                    dataType: 'json',
                    data: {cityId: $('#select_city').val(), centerId: $('#select_mc').val()},
                    success: function(centers) {
                        $('#btn_city').prop("type", "button");
                        $('#btn_mc').prop("type", "button");
                        $('#select_mc').empty();
                        $('#select_mc').append("<option value='-1'>Добавить новый мед.центр</option>");
                        if(centers!=null && centers.length>0){
                            $.each(centers, function(key, center){
                                $('#select_mc').append("<option value='" + center.id + "'>" + center.centerName + "</option>");
                            });
                        }
                        $('#select_mc').val('-1');
                        $('#select_mc').trigger('change');
                    },
                    error:  function(response) {
                        $('#btn_city').prop("type", "button");
                        $('#btn_mc').prop("type", "button");
                        $('#btn_del_mc').prop("type", "button");
                        $('#show_center').css("display", "block");
                        $('#result_line').html("Ошибка обращения в базу данных. Перегрузите страницу.");
                    }
                });
            }
        } else {
            $('#result_line').html("Выберите удаляемый медицинский центр.");
        }
    });

    $('#close_center_field').on('click', function(){
        $('#change_mc').css("display", "block");
        $('#show_center').css("display", "none");
    });

    $('#btn_change_mc').on('click', function(){
        $('#btn_change_mc').css("display", "none");
        $.ajax({
            url: 'editor/change-center',
            method: 'POST',
            dataType: 'text',
            data: {centerId: $('#select_mc').val(), centerName: $('#center_name').val(), centerFullName: $('#center_full_name').val(),
                    address: $('#address').val(), transport: $('#transport').val(), description: $('#center_description').val()},
            success: function(message) {
                $('#btn_change_mc').css("display", "block");
                $('#result_line').html(message);
                $('#show_center').css("display", "none");
                $('#select_mc option:selected').text($('#center_name').val());
                $('#select_mc').trigger("change");
            },
            error:  function(response) {
                $('#btn_change_mc').css("display", "block");
                $('#result_line').html("Ошибка обращения в базу данных. Перегрузите страницу.");
                $('#change_mc').css("display", "block");
                $('#show_center').css("display", "none");
            }
        });
    });

    $('#select_doctor').change (function(){
        if($('#select_doctor').val()>0){
            $('#btn_del_doctor').prop("type", "button");
            $('#show_description').css("display", "block");
            $('#show_article').css("display", "block");
            $('#btn_doctor').prop("type", "hidden");
            cleanDoctorDescription();
            $.ajax({
                url: 'load-data/doctor',
                method: 'POST',
                dataType: 'json',
                data: {doctorId: $('#select_doctor').val()},
                success: function(doctor) {
                    if(doctor != null){
                        let specialities = document.getElementById("select_speciality");
                        let spId;
                        for(let s=0; s<specialities.length; s++){
                           if(specialities[s].text == doctor.specialityName){
                               spId = specialities[s].value;
                               break;
                           }
                        }
                        $('#select_speciality').val(spId);
                        loadDoctorDescription(doctor);
                    }
                },
                error:  function(response) {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    $('#result_line').html("Ошибка обращения в базу данных. Перегрузите страницу.");
                }
            });
        } else {
            $('#doctor_name').val("");
            cleanDoctorDescription();
            $('#btn_doctor').prop("type", "button");
            $('#btn_del_doctor').prop("type", "hidden");
        }
    });

    function loadDoctorDescription(doctor){
        cleanDoctorDescription();
        let body = document.getElementById("create_table");
        $('#create_table').html("");
        $('#article_id').val("0");
        $('#doctor_name').val(doctor.doctorName);
        $('#experience').val(doctor.experience);
        $('#addition').val(doctor.addition);
        $('#doctor_work_time').val(doctor.workTime);
        let text = doctor.description;
        let col = doctor.col;
        let row = doctor.row;
        $('#cols_number').val(col);
        $('#rows_number').val(row);
        let tbl  = document.createElement('table');
        tbl.style.width  = '100%';
        let begin = 0;
        for(let i = 0; i < row; i++){
            let tr = tbl.insertRow();
            let el, td;
            let start;
            let end;
            for(let j = 0; j < col; j++){
                td = tr.insertCell();
                el = document.createElement('textarea');
                start = text.indexOf("<td>", begin);
                end = text.indexOf("</td>", start);
                el.value = text.substring(start+4, end);
                el.setAttribute('type', 'text');
                el.setAttribute('id', `textarea-${i}-${j}`);
                el.setAttribute('contenteditable', true);
                if(row==1){
                    el.setAttribute('style', 'height: 400px;');
                } else {
                    el.setAttribute('style', 'height: 80px;');
                }
                td.appendChild(el);
                begin = end;
            }
        }
        body.appendChild(tbl);
    }

    function cleanDoctorDescription(){
        $('#doctor_name').val("");
        $('#experience').val("");
        $('#addition').val("");
        $('#doctor_work_time').val("");
        $('#create_table').html("");
        $('#cols_number').val(1);
        $('#rows_number').val(1);
        $('#line_create_table').trigger("click");

    }

    $('#btn_del_doctor').on('click', function(){
        if($('#select_doctor').val() > 0 ){
            let x = confirm("ВНИМАНИЕ!!!\nИз базы данных будет удален выбранный врач.\n" +
                            "ЭТА ОПЕРАЦИЯ НЕ ВОССТАНОВИМА!!!\n\nПродолжить операцию удаления?");
            if(x){
                $('#btn_del_doctor').prop("type", "hidden");
                $.ajax({
                    url: 'editor/del-doctor',
                    method: 'POST',
                    dataType: 'text',
                    data: {doctorId: $('#select_doctor').val()},
                    success: function(message) {
                        $('#result_line').html(message);
                        if(message.indexOf("удален")>0){
                            let delVal = $('#select_doctor').val();
                            $('#select_doctor').val("-1");
                            $('#select_doctor option[value="' + delVal + '"]').remove();
                            $('#select_doctor').trigger("change");
                            cleanDoctorDescription();
                        } else {
                            $('#btn_del_doctor').prop("type", "button");
                        }
                    },
                    error:  function(response) {
                        $('#btn_del_doctor').prop("type", "button");
                        $('#result_line').html("Ошибка обращения в базу данных. Перегрузите страницу.");
                    }
                });
            }
        }
    });

    $('#select_speciality').change (function(){
        if($('#select_speciality').val()>0){
            $('#btn_speciality').val("Изменить");
            $('#btn_del_speciality').prop("type", "button");
        } else {
            $('#btn_speciality').val("Создать");
            $('#speciality_name').val("");
            $('#btn_del_speciality').prop("type", "hidden");
        }
    });

    $('#select_center_service').change (function(){
       cleanDoctorDescription();
       let doctorServiceId = $('#select_center_service option:selected').val();
       let pos = doctorServiceId.indexOf("$");
       if(pos>0 || $('#select_center_service').val()>0){
            $('#choose_doctor').css("display", "block");
            $('#change_service').css("display", "none");
            $('#btn_add_service').prop("type", "hidden");
            $('#btn_remove_service').prop("type", "button");
            $('#service_name_field').css("display", "none");
            $('#btn_service').prop("type", "hidden");
            $('#btn_del_service').prop("type", "hidden");
            $('#show_description').css("display", "block");
            $('#show_article').css("display", "block");
            if(pos>0){
                $('#btn_remove_service').val("Удалить");
                $.ajax({
                    url: 'editor/get-doctor',
                    method: 'POST',
                    dataType: 'json',
                    data: {doctorId: doctorServiceId.substring(0, pos)},
                    success: function(doctor) {
                        $('#select_service_doctor').append("<option value='" + doctorServiceId + "'>" + doctor.doctorName + "</option>");
                        $('#select_service_doctor').val(doctorServiceId);
                        $('#show_description').css("display", "block");
                        $('#show_article').css("display", "block");
                        loadDoctorDescription(doctor);
                    },
                    error:  function(response) {
                        $('#result_line').html("Ошибка обращения в базу данных. Перегрузите страницу.");
                    }
                });
            } else {
                $('#btn_remove_service').val("Убрать");
                $('#select_service_doctor').val('-1');
                $('#select_service_doctor').trigger("change");
            }
       } else {
            $('#choose_doctor').css("display", "none");
            $('#btn_add_service').prop("type", "hidden");
            $('#btn_remove_service').prop("type", "hidden");
            $('#change_service').css("display", "block");
            $('#select_service').val(-1);
            $('#service_name_field').css("display", "block");
            $('#service_name').val("");
            $('#btn_service').prop("type", "button");
            $('#btn_del_service').prop("type", "hidden");
            $('#btn_service').val("Создать");
            $('#show_description').css("display", "none");
            $('#show_article').css("display", "none");
        }
    });

    $('#select_service').change (function(){
        $('#select_center_service').val(-1);
        $('#service_name_field').css("display", "block");
        $('#btn_service').prop("type", "button");
        $('#service_name').val("");
        if($('#select_service').val()>0){
            $('#btn_add_service').prop("type", "button");
            $('#btn_remove_service').prop("type", "hidden");
            $('#btn_add_service').val("Добавить");
            $('#btn_del_service').prop("type", "button");
            $('#btn_service').val("Изменить");
        } else {
            $('#btn_add_service').prop("type", "hidden");
            $('#btn_del_service').prop("type", "hidden");
            $('#btn_service').val("Создать");
        }
    });

    $('#select_service_doctor').change (function(){
        let doctorServiceId = $('#select_service_doctor option:selected').val();
        let pos = doctorServiceId.indexOf("$");
        if(pos > 0){
            $('#choose_service_doctor').css("display", "none");
            $('#btn_service_doctor').prop("type", "hidden");
            $('#btn_del_service_doctor').prop("type", "hidden");
            $.ajax({
                url: 'editor/get-doctor',
                method: 'POST',
                dataType: 'json',
                data: {doctorId: doctorServiceId.substring(0, pos)},
                success: function(doctor) {
                    $('#show_description').css("display", "block");
                    $('#show_article').css("display", "block");
                    loadDoctorDescription(doctor);
                },
                error:  function(response) {
                    $('#result_line').html("Ошибка обращения в базу данных. Перегрузите страницу.");
                }
            });
        } else if($('#select_service_doctor').val()>0 || $('#select_service_doctor').val()<-1){
            $('#choose_service_doctor').css("display", "none");
            $('#show_description').css("display", "block");
            $('#show_article').css("display", "block");
            cleanDoctorDescription();
            $('#btn_service_doctor').prop("type", "hidden");
            $('#btn_del_service_doctor').prop("type", "button");
        } else {
            $('#btn_service_doctor').prop("type", "button");
            $('#btn_del_service_doctor').prop("type", "hidden");
            $('#choose_service_doctor').css("display", "block");
            $('#new_select_doctor_field').css("display", "none");
            $('#new_name_doctor_field').css("display", "none");
            $('#show_description').css("display", "none");
            $('#show_article').css("display", "none");
            $('#select_service_doctor').empty();
            $('#select_service_doctor').append("<option value='-1'>Добавить специалиста</option>");
        }
    });

    $('#select_all_doctors').change (function(){
        if($('#select_all_doctors').val()=='-7'){
            $('#new_select_doctor_field').css("display", "block");
            $('#new_name_doctor_field').css("display", "none");
            $('#btn_service_doctor').prop("type", "hidden");
        } else if($('#select_all_doctors').val()=='-9'){
            $('#new_name_doctor_field').css("display", "block");
            $('#new_select_doctor_field').css("display", "none");
            $('#btn_service_doctor').prop("type", "button");
        } else {
            $('#new_select_doctor_field').css("display", "none");
            $('#new_name_doctor_field').css("display", "none");
            $('#btn_service_doctor').prop("type", "button");
        }
    });

    $('#btn_doctor').on('click', function(){
        $('#show_article').css("display", "block");
        $('#show_description').css("display", "block");
        $('#btn_doctor').prop("type", "hidden");
    });

    $('#select_new_doctor').change (function(){
        if($('#select_new_doctor').val() > 0){
            $('#select_service_doctor').append("<option value='" + $('#select_new_doctor').val() + "'>" + $('#select_new_doctor option:selected').text() + "</option>");
            $('#new_select_doctor_field').css("display", "none");
            $('#choose_service_doctor').css("display", "none");
            $('#select_service_doctor').val($('#select_new_doctor').val());
            $.ajax({
                url: 'editor/get-doctor',
                method: 'POST',
                dataType: 'json',
                data: {doctorId: $('#select_new_doctor').val()},
                success: function(doctor) {
                    $('#show_description').css("display", "block");
                    $('#show_article').css("display", "block");
                    loadDoctorDescription(doctor);
                    $('#select_all_doctors').val('-1');
                    $('#select_new_doctor').val('-1');
                },
                error:  function(response) {
                    $('#result_line').html("Ошибка обращения в базу данных. Перегрузите страницу.");
                }
            });
        } else {
            $('#show_description').css("display", "none");
            $('#show_article').css("display", "none");
            cleanDoctorDescription();
        }
    });

    $('#btn_service_doctor').on('click', function(){
        let isCompleted = false;
        if($('#select_all_doctors').val() == '-9'){
            if($('#new_name_doctor').val().length > 0){
                $('#select_service_doctor').append("<option value='0'>" + $('#new_name_doctor').val() + "</option>");
                $('#select_service_doctor').val('0');
                isCompleted = true;
            } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                $('#result_line').html("Внесите в поле нового специалиста должность и/или ФИО специалиста");
            }
        } else {
            $('#select_service_doctor').append("<option value='" + $('#select_all_doctors').val() + "'>" + $('#select_all_doctors option:selected').text() + "</option>");
            $('#select_service_doctor').val($('#select_all_doctors').val());
            isCompleted = true;
        }
        if(isCompleted){
            $('#choose_service_doctor').css("display", "none");
            $('#select_all_doctors').val('-1');
            $('#select_new_doctor').val('-1');
            $('#new_name_doctor_field').css("display", "none");
            $('#show_description').css("display", "block");
            $('#show_article').css("display", "block");
            $('#btn_service_doctor').prop("type", "hidden");
            $('#btn_del_service_doctor').prop("type", "button");
        }

    });

    $('#btn_del_service_doctor').on('click', function(){
        let delVal = $('#select_service_doctor').val();
        $('#select_service_doctor').val('-1');
        $('#select_service_doctor option[value="' + delVal + '"]').remove();
        $('#select_service_doctor').trigger("change");
    });

    $('#btn_speciality').on('click', function(){
        if($('#speciality_name').val().length>0){
            $('#btn_speciality').prop("type", "hidden");
            $('#btn_del_speciality').prop("type", "hidden");
            if($('#select_speciality').val()>0){
                $.ajax({
                    url: 'editor/change-speciality',
                    method: 'POST',
                    dataType: 'text',
                    data: {specialityId: $('#select_speciality').val(), specialityName: $('#speciality_name').val()},
                    success: function(message) {
                        $('#btn_speciality').prop("type", "button");
                        $('#btn_speciality').val("Изменить");
                        $('#btn_del_speciality').prop("type", "button");
                        if(message.indexOf("изменен")>0){
                            $('#select_speciality option:selected').text($('#speciality_name').val());
                            $('#speciality_name').val("");
                        }
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                        $('#result_line').html(message);
                    },
                    error:  function(response) {
                        $('#btn_speciality').prop("type", "block");
                        $('#btn_del_speciality').prop("type", "block");
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                        $('#result_line').html("Ошибка обращения в базу данных. Перегрузите страницу.");
                    }
                });
            } else {
                $.ajax({
                    url: 'editor/add-speciality',
                    method: 'POST',
                    dataType: 'json',
                    data: {specialityName: $('#speciality_name').val()},
                    success: function(specialities) {
                        $('#btn_speciality').prop("type", "button");
                        if(specialities!=null && specialities.length>0){
                            $('#btn_del_speciality').prop("type", "button");
                            $('#btn_speciality').val("Изменить");
                            $('#select_speciality').empty();
                            $('#select_speciality').append('<option value="-1">Добавить специализацию</option>');
                            $.each(specialities, function(key, speciality){
                                $('#select_speciality').append('<option value="' + speciality.id + '">' + speciality.specialityName + '</option>');
                            });
                            let myKey = Object.keys(specialities).find(key => specialities[key].specialityName===$('#speciality_name').val());
                            $('#select_speciality').val(specialities[myKey].id);
                            $('#speciality_name').val("");
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                            $('#result_line').html("Новое название специализации добавлено");
                        } else{
                            $('#btn_del_speciality').prop("type", "hidden");
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                            $('#result_line').html("В базе данных уже зарегистрирована специализация с таким наименованием.");
                        }
                    },
                    error:  function(response) {
                        $('#btn_speciality').prop("type", "button");
                        $('#btn_del_speciality').prop("type", "hidden");
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                        $('#result_line').html("Ошибка обращения в базу данных. Перегрузите страницу.");
                    }
                });
            }
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            $('#result_line').html("Для создания новой специализации внесите наименование специализации в поле ввода нового названия.");
        }
    });

    $('#btn_del_speciality').on('click', function(){
        if($('#select_speciality').val() > 0 ){
            let x = confirm("ВНИМАНИЕ!!!\nИз базы данных будет удалена специализация врача, а также ВСЕ ВРАЧИ по ВСЕМ ЦЕНТРАМ по ВСЕМ ГОРОДАМ, имеющие удаляемую специализацию врача.\n" +
                            "ЭТА ОПЕРАЦИЯ НЕ ВОССТАНОВИМА!!!\n\nПродолжить операцию удаления?");
            if(x){
                $('#btn_speciality').prop("type", "hidden");
                $('#btn_del_speciality').prop("type", "hidden");
                $.ajax({
                    url: 'editor/del-speciality',
                    method: 'POST',
                    dataType: 'text',
                    data: {specialityId: $('#select_speciality').val()},
                    success: function(message) {
                        $('#btn_speciality').prop("type", "button");
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                        $('#result_line').html(message);
                        if(message.indexOf("удален")>0){
                            let delVal = $('#select_speciality').val();
                            $('#select_speciality').val("-1");
                            $('#select_speciality option[value="' + delVal + '"]').remove();
                            $('#select_mc').trigger("change");
                            $('#select_speciality').trigger("change");
                        }
                    },
                    error:  function(response) {
                        $('#btn_speciality').prop("type", "button");
                        $('#btn_del_speciality').prop("type", "button");
                        $('#result_line').html("Ошибка обращения в базу данных. Перегрузите страницу.");
                    }
                });
            }
        }
    });

    $('#btn_add_service').on('click', function(){
        let doctorServiceId = $('#select_center_service').val();
        let pos = doctorServiceId.indexOf("$");
        if($('#select_service').val()>0){
                $('#select_center_service').append("<option value='" + $('#select_service').val() + "'>" + $('#select_service option:selected').text() + "</option>");
                $('#select_center_service').val($('#select_service').val());
                $('#select_service').val('-1');
                $('#select_service_doctor').val('-1');
                cleanDoctorDescription();
                $('#btn_add_service').prop("type", "hidden");
                $('#btn_remove_service').prop("type", "button");
                $('#btn_remove_service').val("Убрать");
                $('#choose_doctor').css("display", "block");
                $('#change_service').css("display", "none");
                $('#service_name_field').css("display", "none");
                $('#btn_del_service').prop("type", "hidden");
                $('#btn_service').prop("type", "hidden");
                $('#select_service_doctor').trigger("change");
                $('#result_line').html("Выберите врача (специалиста), заполните описание новой услуги и нажмите кнопку внесения в базу данных.");
        } else {
            $('#result_line').html("Выберите новую услугу из списка.");
        }
    });

    $('#btn_remove_service').on('click', function(){
        let doctorServiceId = $('#select_center_service').val();
        let pos = doctorServiceId.indexOf("$");
        if(pos>0){
            let x = confirm("ВНИМАНИЕ!!!\nИз базы данных по медицинскому центру будет удалена выбранная услуга.\n" +
                            "ЭТА ОПЕРАЦИЯ НЕ ВОССТАНОВИМА!!!\n\nПродолжить операцию удаления?");
            if(x){
                $('#btn_remove_service').prop("type", "hidden");
                $.ajax({
                    url: 'editor/del-doctor',
                    method: 'POST',
                    dataType: 'text',
                    data: {doctorId: doctorServiceId.substring(0, pos)},
                    success: function(message) {
                        if(message.indexOf("удален")>0){
                            $('#btn_add_service').prop("type", "button");
                            $('#btn_add_service').val("Добавить");
                            $('#select_center_service').val('-1');
                            $('#select_service').val('-1');
                            $('#select_service_doctor').val("-1");
                            $('#select_service_doctor').trigger("change");
                            $('#select_center_service option[value="' + doctorServiceId + '"]').remove();
                            $('#result_line').html("Услуга и оказывающий ее специалист (врач) удалены из базы данных");
                        } else {
                            $('#result_line').html("Ошибка изменения записей в базе данных. Попробуйте позднее.");
                            $('#btn_remove_service').prop("type", "button");
                        }
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    },
                    error:  function(response) {
                        $('#btn_remove_service').prop("type", "button");
                        $('#result_line').html("Ошибка обращения в базу данных. Перегрузите страницу.");
                    }
                });
            }
        } else {
            if($('#select_center_service').val()>0){
                let delVal = $('#select_center_service').val();
                $('#select_center_service').val('-1');
                $('#select_center_service option[value="' + delVal + '"]').remove();
                $('#show_description').css("display", "none");
                $('#show_article').css("display", "none");
            } else {
                $('#result_line').html("Выберите удаляемую услугу из списка.");
            }
        }
        $('#select_center_service').trigger("change");
        $('#select_service_doctor').trigger("change");
        $('#select_service').trigger("change");
    });

    $('#btn_service').on('click', function(){
        if($('#service_name').val().length>0){
            $('#btn_service').prop("type", "hidden");
            $('#btn_del_service').prop("type", "hidden");
            if($('#select_service').val()>0){
                $.ajax({
                    url: 'editor/change-services',
                    method: 'POST',
                    dataType: 'text',
                    data: {serviceId: $('#select_service').val(), serviceName: $('#service_name').val()},
                    success: function(message) {
                        $('#btn_service').prop("type", "button");
                        $('#btn_service').val("Изменить");
                        $('#btn_del_service').prop("type", "button");
                        if(message.indexOf("изменено")>0){
                            $('#select_service option:selected').text($('#service_name').val());
                            $('#service_name').val("");
                        }
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                        $('#result_line').html(message);
                    },
                    error:  function(response) {
                        $('#btn_service').prop("type", "block");
                        $('#btn_del_service').prop("type", "block");
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                        $('#result_line').html("Ошибка обращения в базу данных. Перегрузите страницу.");
                    }
                });
            } else {
                $.ajax({
                    url: 'editor/add-services',
                    method: 'POST',
                    dataType: 'json',
                    data: {serviceName: $('#service_name').val()},
                    success: function(servicesList) {
                        $('#btn_service').prop("type", "button");
                        if(servicesList!=null && servicesList.length>0){
                            $('#btn_del_service').prop("type", "button");
                            $('#btn_service').val("Изменить");
                            $('#select_service').empty();
                            $('#select_service').append('<option value="-1">Создать новую услугу</option>');
                            $.each(servicesList, function(key, services){
                                $('#select_service').append('<option value="' + services.id + '">' + services.serviceName + '</option>');
                            });
                            let myKey = Object.keys(servicesList).find(key => servicesList[key].serviceName===$('#service_name').val());
                            $('#select_service').val(servicesList[myKey].id);
                            $('#service_name').val("");
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                            $('#result_line').html("Новое название услуги добавлено");
                        } else{
                            $('#btn_del_service').prop("type", "hidden");
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                            $('#result_line').html("В базе данных уже зарегистрирована услуга с таким наименованием.");
                        }
                    },
                    error:  function(response) {
                        $('#btn_service').prop("type", "button");
                        $('#btn_del_service').prop("type", "hidden");
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                        $('#result_line').html("Ошибка обращения в базу данных. Перегрузите страницу.");
                    }
                });
            }
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            $('#result_line').html("Для создания новой услуги внесите наименование услуги в поле ввода нового названия.");
        }
    });

    $('#btn_del_service').on('click', function(){
        if($('#select_service').val() > 0 ){
            let x = confirm("ВНИМАНИЕ!!!\nИз базы данных будет удалена услуга по ВСЕМ ЦЕНТРАМ по ВСЕМ ГОРОДАМ, имеющие удаляемую услугу.\n" +
                            "ЭТА ОПЕРАЦИЯ НЕ ВОССТАНОВИМА!!!\n\nПродолжить операцию удаления?");
            if(x){
                $('#btn_service').prop("type", "hidden");
                $('#btn_del_service').prop("type", "hidden");
                $.ajax({
                    url: 'editor/del-services',
                    method: 'POST',
                    dataType: 'text',
                    data: {serviceId: $('#select_service').val()},
                    success: function(message) {
                        $('#btn_service').prop("type", "button");
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                        $('#result_line').html(message);
                        if(message.indexOf("удален")>0){
                            let delVal = $('#select_service').val();
                            $('#select_service').val("-1");
                            $('#select_service option[value="' + delVal + '"]').remove();
                            $('#select_mc').trigger("change");
                            $('#select_service').trigger("change");
                            $('#btn_service').val("Создать");
                        }
                    },
                    error:  function(response) {
                        $('#btn_service').prop("type", "button");
                        $('#btn_del_service').prop("type", "button");
                        $('#result_line').html("Ошибка обращения в базу данных. Перегрузите страницу.");
                    }
                });
            }
        }
    });

});
