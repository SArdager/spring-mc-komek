$(document).ready(function(){
    $('#select_knowledge').change (function(){
        $.ajax({
            url: 'load-data/types',
            method: 'POST',
            dataType: 'json',
            data: {knowledgeId: $('#select_knowledge').val()},
            success: function(types) {
                $('#select_type').empty();
                $.each(types, function(key, type){
                    $('#select_type').append('<option value="' + type.id + '">' + type.typeName + '</option>');
                });
                $('#select_type').trigger("change");
            },
            error:  function(response) {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                $('#result_line').html("Ошибка обращения в базу данных. Перегрузите страницу.");
            }
        });
    });

    $('#select_type').change ( function(){
        $.ajax({
            url: 'load-data/text',
            method: 'POST',
            dataType: 'json',
            data: {typeId: $('#select_type').val(), language: $('input[name="language"]:checked').val(),
                    words: $('#find_words').val()},
            success: function(article) {
                $('#put_type_name').text($('#select_type option:selected').text());
                let text_body = $('#text_table_body');
                text_body.html('');
                let text_lines_html = "<tbody>" + article.text.replace(/\n/g, '<br/>') + "</tbody>";
                text_body.prepend(text_lines_html);
            },
            error:  function(response) {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                $('#result_line').html("Ошибка обращения в базу данных. Перегрузите страницу.");
            }
        });
    });

    $('#select_speciality').change (function(){
        $('#select_center').trigger ("change");
    });

    $('#select_services').change ( function(){
        $('#select_center').trigger ("change");
    });

    $('#select_city').change(function(){
        let isDoc;
        if($('input:radio[name="show"]:checked').val() == "doc"){
            $('#put_speciality').text("Все врачи");
            isDoc = true;
        } else {
            $('#put_speciality').text("Все услуги");
            isDoc = false;
        }
        $('#close_description_field').trigger("click");
        if($('#select_city').val()>1){
            $.ajax({
                url : 'load-data/city-centers',
                method: "POST",
                dataType: "json",
                data : {cityId: $('#select_city').val(), isDoc: isDoc},
                success : function(centers) {
                    $('#select_center').empty();
                    $('#select_speciality').val(1);
                    $('#select_services').val(1);
                    $('#center_table_body').html('');
                    $('#doctors_table_body').html('');
                    if(centers[0] != null){
                        $('#select_center').append("<option value='0'>Все центры</option>");
                        let center_html = "";
                        let doctors_html = "<tr><th width='15%'>Врач</th><th width='50%'>Услуга</th><th width='20%'>Время</th><th width='15%'>Мед.центр</th></tr>";
                        let description_html = '';
                        let visItems = [];
                        $.each(centers, function(key, center){
                            $('#select_center').append("<option value='" + center.id + "'>" + center.centerName + "</option>");
                            center_html+="<tr><td style='width: 20%;  border-bottom: none; color: cornsilk'>" + center.centerName +
                                  "</td><td colspan='2' class='title_html' style='border-bottom: none'><b>" + center.centerFullName + "</b></td></tr>" +
                                  "<tr><td width: 20%'>" + center.centerAddress.replace(/\n/g, '<br/>') +
                                  "</td><td width: 30%'>" + center.transport.replace(/\n/g, '<br/>') +
                                  "</td><td width: 50%'>" + center.centerDescription.replace(/\n/g, '<br/>') + "</td></tr>";
                            let doctors = new Array();
                            doctors = center.doctors;
                            if(doctors[0] != null){
                                $.each(doctors, function(key, doctor){
                                    let itemId;
                                    if(isDoc){
                                        itemId = doctor.specialityId;
                                        doctors_html+="<tr><td width='15%' class='title_html' >" + doctor.specialityName +
                                            "</td><td  colspan='3' style='border-bottom: 1px solid black; font-size: 0.85em;'>" + doctor.experience.replace(/\n/g, ' ')  +
                                            "</td></tr><tr><td width='15%' class='doctor_html' id='doc_" + doctor.id + "'>" + doctor.doctorName +
                                            "</td><td  width='50%' style='font-size: 0.9em;'>" + doctor.addition.replace(/\n/g, '<br/>') +
                                            "</td><td width='20%' style='font-size: 0.9em;'>" + doctor.workTime.replace(/\n/g, '<br/>') +
                                            "</td><td width='15%' style='font-size: 0.85em;'>" +  doctor.centerName + "</td></tr><tr><td colspan='4'><hr></td></tr>";
                                    } else {
                                        itemId = doctor.serviceId;
                                        doctors_html+="<tr><td width='15%' class='title_html' >" + doctor.serviceName +
                                            "</td><td colspan='3' style='border-bottom: 1px solid black; font-size: 0.85em;'> " + doctor.experience.replace(/\n/g, ' ')  +
                                            "</td></tr><tr><td width='15%' class='doctor_html' id='doc_" + doctor.id + "'>" + doctor.doctorName +
                                            "</td><td  width='50%' style='font-size: 0.9em;'>" + doctor.addition.replace(/\n/g, '<br/>') +
                                            "</td><td width='20%' style='font-size: 0.9em;'>" + doctor.workTime.replace(/\n/g, '<br/>') +
                                            "</td><td width='15%' style='font-size: 0.85em;'>" +  doctor.centerName + "</td></tr><tr><td colspan='4'><hr></td></tr>";
                                    }
                                    if(visItems.length > 0){
                                        visItems = addItem(visItems, itemId);
                                    } else {
                                        visItems.push(itemId);
                                    }
                                });
                            }
                        });
                        if(visItems.length>0){
                            removeFromSelectList(visItems, isDoc);
                        } else {
                            restoreSelectList();
                        }
                        $('#center_table_body').prepend(center_html);
                        $('#doctors_table_body').prepend(doctors_html);
                    } else {
                        $('#select_center').append("<option value='-1'>Нет медицинских центров</option>");
                        $('#center_table_body').html('');
                        $('#doctors_table_body').html('');
                    }
                },
                error:  function(response) {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    $('#result_line').html("Ошибка обращения в базу данных. Перегрузите страницу.");
                }
            });
        } else {
            $('#center_table_body').html('');
            $('#doctors_table_body').html('');
            $('#select_center').empty();
            $('#select_center').append('<option value="-1">Выберите город</option>');
            $('#put_speciality').text('');
        }
    });

    function addItem(visItems, itemId){
        let isExists = false;
        for(let i=0; i<visItems.length; i++){
            if(visItems[i] == itemId){
                isExists = true;
                break;
            }
        }
        if(!isExists){
            visItems.push(itemId);
        }
        return visItems;
    }

    function removeFromSelectList(visItems, isDoc){
        if(isDoc){
            $('#select_speciality option').each(function(){
                if($(this).val() != "1"){
                    $(this).css("display", "none");
                }
            });
            for(let i=0; i<visItems.length; i++){
                let itemId = visItems[i];
                $('#select_speciality option').each(function(){
                    if($(this).val() == itemId){
                        $(this).css("display", "block");
                    }
                });
            }
        } else {
            $('#select_services option').each(function(){
                if($(this).val() != "1"){
                    $(this).css("display", "none");
                }
            });
            for(let i=0; i<visItems.length; i++){
                let itemId = visItems[i];
                $('#select_services option').each(function(){
                    if($(this).val() == itemId){
                        $(this).css("display", "block");
                    }
                });
            }
        }
    }

    function restoreSelectList(){
        $('#select_speciality option').each(function(){
            $(this).css("display", "block");
        });
        $('#select_services option').each(function(){
            $(this).css("display", "block");
        });
    }

    $('#select_center').change(function(){
        let center_html = "";
        let doctors_html = "<tr><th width='15%'>Врач</th><th width='50%'>Услуга</th><th width='20%'>Время</th><th width='15%'>Мед.центр</th></tr>";
        $('#center_table_body').html('');
        $('#doctors_table_body').html('');
        $('#close_description_field').trigger("click");
        let isDoc;
        if($('input:radio[name="show"]:checked').val() == "doc"){
            $('#put_speciality').text($('#select_speciality option:selected').text());
            isDoc = true;
        } else {
            $('#put_speciality').text($('#select_services option:selected').text());
            isDoc = false;
        }
        if($('#select_city').val() > 1){
            if($('#select_center').val() < 0){
                center_html = '<tr><td>Для просмотра выберите медицинский центр</td></tr>';
                $('#result_line').html("Отсутствуют медицинские центры.");
            } else {
                $.ajax({
                    url: 'load-data/center-doctors',
                    method: 'POST',
                    dataType: 'json',
                    data: {cityId: $('#select_city').val(), centerId: $('#select_center').val(), isDoc: isDoc},
                    success: function(centers) {
                        let visItems = [];
                        let specialityId = $('#select_speciality').val();
                        let serviceId = $('#select_services').val();
                        $.each(centers, function(key, center){
                            center_html+="<tr><td style='width: 20%;  border-bottom: none; color: cornsilk'>" + center.centerName +
                                  "</td><td colspan='2' class='title_html' style='border-bottom: none'><b>" + center.centerFullName + "</b></td></tr>" +
                                  "<tr><td width: 20%'>" + center.centerAddress.replace(/\n/g, '<br/>') +
                                  "</td><td width: 30%'>" + center.transport.replace(/\n/g, '<br/>') +
                                  "</td><td width: 50%'>" + center.centerDescription.replace(/\n/g, '<br/>') + "</td></tr>";

                            let doctors = new Array();
                            doctors = center.doctors;
                            if(doctors != null && doctors[0] != null){
                                let itemId;
                                $.each(doctors, function(key, doctor){
                                    if(isDoc){
                                        itemId = doctor.specialityId;
                                        if(specialityId == '1' || specialityId == itemId){
                                            doctors_html+="<tr><td width='15%' class='title_html'>" + doctor.specialityName +
                                                "</td><td  colspan='3' style='border-bottom: 1px solid black; font-size: 0.85em;'>" + doctor.experience.replace(/\n/g, ' ')  +
                                                "</td></tr><tr><td width='15%' class='doctor_html' id='doc_" + doctor.id + "'>" + doctor.doctorName +
                                                "</td><td  width='50%' style='font-size: 0.9em;'>" + doctor.addition.replace(/\n/g, '<br/>') +
                                                "</td><td width='20%' style='font-size: 0.9em;'>" + doctor.workTime.replace(/\n/g, '<br/>') +
                                                "</td><td width='15%' style='font-size: 0.85em;'>" +  doctor.centerName + "</td></tr><tr><td colspan='4'><hr></td></tr>";
                                        }
                                    } else {
                                        itemId = doctor.serviceId;
                                        if(serviceId == '1' || serviceId == itemId){
                                            doctors_html+="<tr><td width='15%' class='title_html'>" + doctor.serviceName +
                                                "</td><td colspan='3' style='border-bottom: 1px solid black; font-size: 0.85em;'> " + doctor.experience.replace(/\n/g, ' ')  +
                                                "</td></tr><tr><td width='15%' class='doctor_html' id='doc_" + doctor.id + "'>" + doctor.doctorName +
                                                "</td><td  width='50%' style='font-size: 0.9em;'>" + doctor.addition.replace(/\n/g, '<br/>') +
                                                "</td><td width='20%' style='font-size: 0.9em;'>" + doctor.workTime.replace(/\n/g, '<br/>') +
                                                "</td><td width='15%' style='font-size: 0.85em;'>" +  doctor.centerName + "</td></tr><tr><td colspan='4'><hr></td></tr>";
                                        }
                                    }
                                    if(visItems.length > 0){
                                        visItems = addItem(visItems, itemId);
                                    } else {
                                        visItems.push(itemId);
                                    }
                                });
                            }
                        });
                        if(visItems.length>0){
                            removeFromSelectList(visItems, isDoc);
                        } else {
                            restoreSelectList();
                        }
                        $('#center_table_body').prepend(center_html);
                        $('#doctors_table_body').prepend(doctors_html);
                   },
                   error:  function(response) {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                        $('#result_line').html("Ошибка обращения в базу данных. Перегрузите страницу.");
                   }
               });
            }
        } else {
            $('#result_line').html("Выберите город.");
        }
    });

});


