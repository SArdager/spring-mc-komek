$(document).ready(function(){

    $('#knowledge_edit').click(function(){
        $('#knowledge_field').css("display", "block");
        $('#mc_field').css("display", "none");
        $('#show_center').css("display", "none");
        $('#show_doctors').css("display", "none");
        $('#show_description').css("display", "none");
        $('#show_article').css("display", "none");
        $('#knowledge_edit').attr("class", "background_bold");
        $('#mc_edit').attr("class", "background_white");
        $('#text_mode').val("true");
        $('#select_knowledge').val('-1');
    });
    $('#mc_edit').click(function(){
        $('#knowledge_field').css("display", "none");
        $('#mc_field').css("display", "block");
        $('#change_city').css("display", "block");
        $('#show_center').css("display", "none");
        $('#change_center').css("display", "none");
        $('#show_doctors').css("display", "none");
        $('#show_description').css("display", "none");
        $('#show_article').css("display", "none");
        $('#knowledge_edit').attr("class", "background_white");
        $('#mc_edit').attr("class", "background_bold");
        $('#text_mode').val("false");
        $('#select_city').val('-1');
    });

    $('#select_knowledge').change (function(){
        $('#change_type').css("display", "none");
        $('#show_article').css("display", "none");
        $('#show_language').css("display", "none");
        $('#change_knowledge').css("display", "block");

        if($('#select_knowledge').val()>0){
            $('#btn_knowledge').val("Изменить");
            $('#btn_del_knowledge').prop("type", "button");
            $.ajax({
                url: 'load-data/types',
                method: 'POST',
                dataType: 'json',
                data: {knowledgeId: $('#select_knowledge').val()},
                success: function(types) {
                    $('#change_type').css("display", "block");
                    $('#select_type').empty();
                    $('#select_type').append('<option value="-1">Добавить новую категорию</option>');
                    if(types!=null && types.length>0){
                        $.each(types, function(key, type){
                            $('#select_type').append('<option value="' + type.id + '">' + type.typeName + '</option>');
                        });
                    }
                },
                error:  function(response) {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    $('#result_line').html("Ошибка обращения в базу данных. Перегрузите страницу.");
                }
            });
        } else {
            $('#btn_knowledge').val("Создать");
            $('#btn_del_knowledge').prop("type", "hidden");
            $('#change_type').css("display", "none");
        }
    });

    $('#select_type').change ( function(){
        if($('#select_type').val()>0){
            $('#btn_type').val("Изменить");
            $('#btn_del_type').prop("type", "button");
            $('#change_knowledge').css("display", "none");
            $.ajax({
                url: 'load-data/text',
                method: 'POST',
                dataType: 'json',
                data: {typeId: $('#select_type').val(), language: $('input[name="language"]:checked').val()},
                success: function(article) {
                    $('#show_article').css("display", "block");
                    $('#show_language').css("display", "block");

                    let body = document.getElementById("create_table");
                    body.innerHTML = '';
                    $('#article_id').val(article.id);
                    let text = article.text;
                    let col;
                    let row;
                    if(article.id>0){
                        col = article.col;
                        row = article.row;
                    } else {
                        col = 1;
                        row = 1;
                   }
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
                },
                error:  function(response) {
                    $('#select_type').val('-1');
                    $('#show_article').css("display", "none");
                    $('#show_language').css("display", "none");
                    $('#btn_type').val("Создать");
                    $('#btn_del_type').prop("type", "hidden");
                    $('#change_knowledge').css("display", "block");
                    $('#btn_knowledge').val("Изменить");
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    $('#result_line').html("Ошибка обращения в базу данных. Перегрузите страницу.");
                }
            });
        } else {
            $('#show_article').css("display", "none");
            $('#show_language').css("display", "none");
            $('#btn_type').val("Создать");
            $('#btn_del_type').prop("type", "hidden");
            $('#change_knowledge').css("display", "block");
            $('#btn_knowledge').val("Изменить");
        }
    });

    $('input:radio[name="language"]').change (function(){
        $('#select_type').trigger ("change");
    });

    $('#btn_knowledge').on('click', function(){
        $('#btn_knowledge').prop("type", "hidden");
        $('#btn_del_knowledge').prop("type", "hidden");
        $('#btn_type').prop("type", "hidden");
        $('#show_article').css("display", "none");
        $('#show_language').css("display", "none");
        if($('#knowledge_name').val().length > 0 ){
            if($('#select_knowledge').val() > 0 ){
                $.ajax({
                    url: 'editor/change-knowledge',
                    method: 'POST',
                    dataType: 'json',
                    data: {knowledgeId: $('#select_knowledge').val(), knowledgeName: $('#knowledge_name').val()},
                    success: function(knowledge) {
                        $('#btn_knowledge').prop("type", "button");
                        $('#btn_del_knowledge').prop("type", "button");
                        $('#btn_type').prop("type", "button");
                        if(knowledge!=null && knowledge.id!=null){
                            $('#select_knowledge option:selected').text(knowledge.knowledgeName);
                        } else {
                            $('#result_line').html("Ошибка записи. Возможно новое название уже имеется в базе данных.");
                        }
                        $('#knowledge_name').val("");
                    },
                    error:  function(response) {
                        $('#btn_knowledge').prop("type", "button");
                        $('#btn_del_knowledge').prop("type", "button");
                        $('#btn_type').prop("type", "button");
                        $('#result_line').html("Ошибка обращения в базу данных. Перегрузите страницу.");
                    }
                });
            } else {
                $.ajax({
                    url: 'editor/add-knowledge',
                    method: 'POST',
                    dataType: 'json',
                    data: {knowledgeName: $('#knowledge_name').val()},
                    success: function(knowledgeList) {
                        $('#btn_knowledge').prop("type", "button");
                        $('#btn_type').prop("type", "button");
                        if(knowledgeList!=null && knowledgeList.length>0){
                            $('#change_type').css("display", "block");
                            $('#result_line').html("Новая группа знаний добавлена в базу данных.");
                            $('#select_knowledge').empty();
                            $('#select_knowledge').append("<option value='-1'>Добавить новую группу</option>");
                            $.each(knowledgeList, function(key, knowledge){
                                $('#select_knowledge').append("<option value='" + knowledge.id + "'>" + knowledge.knowledgeName + "</option>");
                            });
                            let myKey = Object.keys(knowledgeList).find(key => knowledgeList[key].knowledgeName===$('#knowledge_name').val());
                            $('#select_knowledge').val(knowledgeList[myKey].id);
                            $('#btn_knowledge').val("Изменить");
                            $('#btn_del_knowledge').prop("type", "button");
                            $('#select_type').empty();
                            $('#select_type').append("<option value='-1'>Добавить новую категорию</option>");
                        } else {
                            $('#result_line').html("Группа знаний с таким названием уже имеется в базе данных.");

                        }
                        $('#knowledge_name').val("");
                    },
                    error:  function(response) {
                        $('#btn_knowledge').prop("type", "button");
                        $('#btn_type').prop("type", "button");
                        $('#result_line').html("Ошибка обращения в базу данных. Перегрузите страницу.");
                    }
                });
            }
        } else {
            $('#result_line').html("Для создания новой группы знаний внесите наименование группы в поле ввода нового названия ");
        }
    });

    $('#btn_del_knowledge').on('click', function(){
        $('#btn_knowledge').prop("type", "hidden");
        $('#btn_del_knowledge').prop("type", "hidden");
        $('#btn_type').prop("type", "hidden");
        if($('#select_knowledge').val() > 0 ){
            let x = confirm("ВНИМАНИЕ!!!\nИз базы данных будут удалены все записи, связанные с данной группой знаний.\n" +
                            "ЭТА ОПЕРАЦИЯ НЕ ВОССТАНОВИМА!!!\n\nПродолжить операцию удаления?");
            if(x){
                $.ajax({
                    url: 'editor/del-knowledge',
                    method: 'POST',
                    dataType: 'json',
                    data: {knowledgeId: $('#select_knowledge').val()},
                    success: function(knowledgeList) {
                        $('#btn_knowledge').prop("type", "button");
                        $('#btn_del_knowledge').prop("type", "hidden");
                        $('#btn_type').prop("type", "button");
                        $('#select_knowledge').empty();
                        $('#select_knowledge').append("<option value='-1'>Добавить новую группу</option>");
                        $.each(knowledgeList, function(key, knowledge){
                            $('#select_knowledge').append("<option value='" + knowledge.id + "'>" + knowledge.knowledgeName + "</option>");
                        });
                        $('#select_knowledge').val('-1');
                        $('#btn_knowledge').val("Создать");
                        $('#change_type').css("display", "none");
                    },
                    error:  function(response) {
                        $('#btn_knowledge').prop("type", "button");
                        $('#btn_del_knowledge').prop("type", "button");
                        $('#btn_type').prop("type", "button");
                        $('#result_line').html("Ошибка обращения в базу данных. Перегрузите страницу.");
                    }
                });
            }
        } else {
            $('#result_line').html("Выберите удаляемую группу знаний.");
        }
    });

    $('#btn_type').on('click', function(){
        $('#change_knowledge').css("display", "none");
        $('#btn_type').prop("type", "hidden");
        $('#btn_del_type').prop("type", "hidden");
        $('#btn_text').css("display", "none");
        if($('#type_name').val().length > 0 ){
            if($('#select_type').val() > 0 ){
                $.ajax({
                    url: 'editor/change-type',
                    method: 'POST',
                    dataType: 'json',
                    data: {typeId: $('#select_type').val(), typeName: $('#type_name').val()},
                    success: function(type) {
                        $('#btn_type').prop("type", "button");
                        $('#btn_del_type').prop("type", "button");
                        $('#btn_text').css("display", "block");
                        if(type!=null && type.id!=null){
                            $('#select_type option:selected').text(type.typeName);
                        } else {
                            $('#result_line').html("Ошибка записи. Возможно новое название уже имеется в базе данных.");
                        }
                        $('#type_name').val("");
                    },
                    error:  function(response) {
                        $('#btn_type').prop("type", "button");
                        $('#btn_del_type').prop("type", "button");
                        $('#btn_text').css("display", "block");
                        $('#result_line').html("Ошибка обращения в базу данных. Перегрузите страницу.");
                    }
                });
            } else {
                $.ajax({
                    url: 'editor/add-type',
                    method: 'POST',
                    dataType: 'json',
                    data: {knowledgeId: $('#select_knowledge').val(), typeName: $('#type_name').val()},
                    success: function(types) {
                        $('#btn_type').prop("type", "button");
                        $('#btn_text').css("display", "block");
                        $('#change_knowledge').css("display", "none");
                        if(types!=null && types.length>0){
                            $('#result_line').html("Новая категория знаний добавлена в базу данных.");
                            $('#select_type').empty();
                            $('#select_type').append("<option value='-1'>Добавить новую категорию</option>");
                            $.each(types, function(key, type){
                                $('#select_type').append("<option value='" + type.id + "'>" + type.typeName + "</option>");
                            });
                            let myKey = Object.keys(types).find(key => types[key].typeName===$('#type_name').val());
                            $('#select_type').val(types[myKey].id);
                            $('#btn_type').val("Изменить");
                            $('#btn_del_type').prop("type", "button");
                            $('#show_article').css("display", "block");
                            $('#show_language').css("display", "block");
                            $('#line_clean').trigger("click");
                        } else {
                            $('#result_line').html("Категория знаний с таким названием уже имеется в базе данных.");
                        }
                        $('#type_name').val("");
                    },
                    error:  function(response) {
                        $('#btn_type').prop("type", "button");
                        $('#btn_text').css("display", "block");
                        $('#change_knowledge').css("display", "block");
                        $('#result_line').html("Ошибка обращения в базу данных. Перегрузите страницу.");
                    }
                });
            }
        } else {
            $('#result_line').html("Для создания новой категории внесите наименование категории в поле ввода нового названия ");
        }
    });

    $('#btn_del_type').on('click', function(){
        $('#btn_knowledge').prop("type", "hidden");
        $('#btn_del_type').prop("type", "hidden");
        $('#btn_type').prop("type", "hidden");
        $('#show_article').css("display", "none");
        $('#show_language').css("display", "none");
        if($('#select_type').val() > 0 ){
            let x = confirm("ВНИМАНИЕ!!!\nИз базы данных будут удалены все записи, связанные с данной категорией знаний.\n" +
                            "ЭТА ОПЕРАЦИЯ НЕ ВОССТАНОВИМА!!!\n\nПродолжить операцию удаления?");
            if(x){
                $.ajax({
                    url: 'editor/del-type',
                    method: 'POST',
                    dataType: 'json',
                    data: {knowledgeId: $('#select_knowledge').val(), typeId: $('#select_type').val()},
                    success: function(types) {
                        $('#btn_knowledge').prop("type", "button");
                        $('#btn_type').prop("type", "button");
                        $('#select_type').empty();
                        $('#select_type').append("<option value='-1'>Добавить новую категорию</option>");
                        $.each(types, function(key, type){
                            $('#select_type').append("<option value='" + type.id + "'>" + type.typeName + "</option>");
                        });
                        $('#select_type').val('-1');
                        $('#btn_type').val("Создать");
                        $('#change_knowledge').css("display", "block");
                    },
                    error:  function(response) {
                        $('#btn_type').prop("type", "button");
                        $('#btn_del_type').prop("type", "button");
                        $('#btn_type').prop("type", "button");
                        $('#show_article').css("display", "block");
                        $('#show_language').css("display", "block");
                        $('#result_line').html("Ошибка обращения в базу данных. Перегрузите страницу.");
                    }
                });
            }
        } else {
            $('#result_line').html("Выберите удаляемую категорию знаний.");
        }
    });






});
