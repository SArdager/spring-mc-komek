$(document).ready(function(){

    $('#ru_radio').click (function(){
        $('input:radio[name="language"][value="ru"]').click();
    });
    $('#kz_radio').click (function(){
        $('input:radio[name="language"][value="kz"]').click();
    });

    $('#doc_radio').click (function(){
        $('input:radio[name="show"][value="doc"]').click();
    });
    $('#srv_radio').click (function(){
        $('input:radio[name="show"][value="srv"]').click();
    });

    $('input:radio[name="language"]').change (function(){
        if($('input:radio[name="language"]:checked').val() == "ru"){
            $('#info_title').text("Справочная информация");
        } else {
            $('#info_title').text("Aнықтамалық ақпарат");
        }
        $('#select_knowledge').trigger ("change");
    });

    $('input:radio[name="show"]').change (function(){
        $('#close_description_field').trigger("click");
        if($('input:radio[name="show"]:checked').val() == "doc"){
            $('#show_doctor').css("display", "block");
            $('#show_services').css("display", "none");
        } else {
            $('#show_doctor').css("display", "none");
            $('#show_services').css("display", "block");
        }
        $('#select_center').trigger ("change");
    });

    $('#mc_field_line').click(function(){
        if($('#show_mc').css("display") == "none"){
            $('#show_mc').css("display", "block");
            $('#mc_field_line').text("Свернуть информацию о центре");
        } else {
            $('#show_mc').css("display", "none");
            $('#mc_field_line').text("Информация по мед.центру");
        }
    });

    $('#description_field_line').click(function(){
        if($('#show_description').css("display") == "none"){
            $('#show_description').css("display", "block");
            $('#description_field_line').text("Свернуть информацию по врачу");
        } else {
            $('#show_description').css("display", "none");
            $('#description_field_line').text("Информация по врачу(услуге)");
            $('#put_doctor').text('');
            $('#description_table_body').html('<tr><td>Для просмотра кликните в ячейку с фамилией врача (выделено синим цветом и подчеркиванием)</td></tr>');
        }
    });

    $('#close_description_field').click(function(){
        $('#show_description').css("display", "none");
        $('#description_field_line').text("Информация по врачу(услуге)");
        $('#put_doctor').text('');
        $('#description_table_body').html('<tr><td>Для просмотра кликните в ячейку с фамилией врача (выделено синим цветом и подчеркиванием)</td></tr>');
    });

    $('#line_find_words').click (function(){
        if($('#find_words').val().length >0){
            $.ajax({
                url : 'load-data/find-text',
                method: "POST",
                dataType: "json",
                data : {text: $('#find_words').val()},
                success : function(articles) {
                    $('#show_result').css("display", "block");
                    let new_lines_html ="<tbody>";
                    let body = $('#article_table_body');
                    body.html('');
                        $.each(articles, function(key, article){
                            new_lines_html+="<tr class='tr_underline'><td width='20%'>" + article.typeName + "<br>(" + article.knowledgeName +
                                ")</td><td width='80%'>" + article.text.replace(/\n/g, '<br/>') +  "</td></tr>";
                        });
                    new_lines_html+="</tbody>";
                    body.prepend(new_lines_html);
                },
                error:  function(response) {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    $('#result_line').html("Ошибка обращения в базу данных. Перегрузите страницу.");
                }
            });
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            $('#result_line').html("Напишите искомое слово в поле поиска.");
        }
    });

    $('#line_clean_result').click (function(){
        $('#find_words').val("");
        $('#show_result').css("display", "none");
        $('#article_table_body').empty();
    });

      var w = Number(window.innerWidth);
      var h = Number(window.innerHeight);

    $('#btn_left').on('click', function(){
        if($('#right_column').css("display") === "table-cell"){
            $('#right_column').css("width", "100%");
            $('#left_column').css("width", "0");
            $('#left_column').css("display", "none");
            $('#btn_left_pos').css("display", "none");
            if(h>w){
                $('#right_column_').css("width", "100%");
                $('#left_column_').css("width", "0");
                $('#left_column_').css("display", "none");
            }
        } else {
            $('#right_column').css("width", "50%");
            $('#left_column').css("width", "50%");
            $('#right_column').css("display", "table-cell");
            $('#btn_right_pos').css("display", "block");
            if(h>w){
                $('#right_column_').css("width", "50%");
                $('#left_column_').css("width", "50%");
                $('#right_column_').css("display", "table-cell");
            }
        }
    });

    $('#btn_right').on('click', function(){
        if($('#left_column').css("display") === "table-cell"){
            $('#left_column').css("width", "100%");
            $('#right_column').css("width", "0");
            $('#right_column').css("display", "none");
            $('#btn_right_pos').css("display", "none");
            if(h>w){
                $('#left_column_').css("width", "100%");
                $('#right_column_').css("width", "0");
                $('#right_column_').css("display", "none");
            }
        } else {
            $('#right_column').css("width", "50%");
            $('#left_column').css("width", "50%");
            $('#left_column').css("display", "table-cell");
            $('#btn_left_pos').css("display", "block");
            if(h>w){
                $('#right_column_').css("width", "50%");
                $('#left_column_').css("width", "50%");
                $('#left_column_').css("display", "table-cell");
            }
        }
    });

});
