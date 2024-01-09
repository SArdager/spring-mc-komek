$(document).ready(function(){

    $('#btn_text').click ( function(){
        let col = $('#cols_number').val();
        let row = $('#rows_number').val();
        let text = "";
        let body = document.getElementById("create_table");
        let tbl = body.firstChild;
        for(let i = 0; i < row; i++){
            text += "<tr>";
            let tr = tbl.rows[i];
            for(let j = 0; j < col; j++){
                let td = tr.getElementsByTagName('textarea');
                text += "<td>" + td[j].value + "</td>";
            }
            text += "</tr>";
        }
        if($('#text_mode').val()==='true'){
            if($('#select_type').val()>0) {
                $('#btn_text').css("display", "none");
                $.ajax({
                    url : 'editor/save-text',
                    method: "POST",
                    dataType: "text",
                    data : {typeId: $('#select_type').val(), articleId: $('#article_id').val(),
                            text: text, language: $('input[name="language"]:checked').val(),
                            col: $('#cols_number').val(), row: $('#rows_number').val()},
                    success : function(message) {
                        $('#btn_text').css("display", "block");
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                        $('#result_line').html(message);
                    },
                    error:  function(response) {
                        $('#btn_text').css("display", "block");
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                        $('#result_line').html("Ошибка обращения в базу данных. Перегрузите страницу.");
                    }
                });
            } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                $('#result_line').html("Для записи нового текста необходимо выбрать категорию знаний.");
            }
        } else {
            let data, doctorId, serviceId, doctorName;
            if($('#doctor_mode').val()==='true') {
                doctorId = $('#select_doctor').val();
                specialityId = $('#select_speciality').val();
                serviceId = '1';
                doctorName = $('#doctor_name').val();
            } else {
                let serviceDoctorId = $('#select_center_service').val();
                let doctorServiceId = $('#select_service_doctor').val();
                let pos = serviceDoctorId.indexOf("$");
                specialityId = '1';
                if(pos>0 && serviceDoctorId === doctorServiceId){
                    doctorId = serviceDoctorId.substring(0, pos);
                    serviceId = serviceDoctorId.substring(pos+1);
                } else if(pos>0){
                    doctorId = 0;
                    serviceId = serviceDoctorId.substring(pos+1);
                } else {
                    doctorId = 0;
                    serviceId = $('#select_center_service').val();
                }
                doctorName = $('#select_service_doctor option:selected').text();
            }
            data = {doctorId: doctorId, doctorName: doctorName, specialityId: specialityId, serviceId: serviceId,
                     experience: $('#experience').val(), addition: $('#addition').val(), doctorWorkTime: $('#doctor_work_time').val(),
                     text: text, col: $('#cols_number').val(), row: $('#rows_number').val(), centerId: $('#select_mc').val()};
            if(specialityId>0 && serviceId>0){
                if(doctorName.length>0){
                    $('#btn_text').css("display", "none");
                    $.ajax({
                        url : 'editor/save-description',
                        method: "POST",
                        dataType: "text",
                        data : data,
                        success : function(message) {
                            $('#btn_text').css("display", "block");
                            window.scrollTo({ top: 0, behavior: 'smooth'});
                            $('#result_line').html(message);
                            $('#select_mc').trigger("change");
                        },
                        error:  function(response) {
                            $('#btn_text').css("display", "block");
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                            $('#result_line').html("Ошибка обращения в базу данных. Перегрузите страницу.");
                        }
                    });
                } else {
                    $('#result_line').html("Выберите врача или создайте нового врача (специалиста).");
                }
            } else {
                $('#result_line').html("Выберите специализацию (вид услуги) врача");
            }
        }
    });

    document.onselectionchange = function() {
        let selection = document.getSelection();
        const myTimeout = setTimeout(cleanSelection, 2500, selection);
        if(selection != null){
            let node = selection.anchorNode;
            if(node != null){
                let tagName = node.tagName;
                if(tagName == "TEXTAREA"){
                    this.oninput = function(){
                    node.style.height = 'auto';
                    node.style.height = node.scrollHeight + 'px';
                    };
                }
                if(tagName == "INPUT" || tagName == "TEXTAREA"){
                    this.onselect = function(){
                        $('#line_bold').on('click', function(){
                            accentSelection("b");
                        });
                        $('#line_color').on('click', function(){
                            accentSelection("span");
                        });
                        $('#line_cur').on('click', function(){
                            accentSelection("i");
                        });
                        $('#line_under').on('click', function(){
                            accentSelection("u");
                        });

                        $('#line_bold_article').on('click', function(){
                            accentSelection("b");
                        });
                        $('#line_color_article').on('click', function(){
                            accentSelection("color");
                        });
                        $('#line_background_article').on('click', function(){
                            accentSelection("ground");
                        });
                        $('#line_cur_article').on('click', function(){
                            accentSelection("i");
                        });
                        $('#line_under_article').on('click', function(){
                            accentSelection("u");
                        });

                        function accentSelection(accent){
                            let selStart = node.selectionStart;
                            let selEnd = node.selectionEnd;
                            if(selStart==selEnd){
                                return;
                            }
                            let selected = node.value.slice(selStart, selEnd);
                            if(accent.indexOf("color") == 0){
                                node.setRangeText("<span class='color'>" + selected + "</span>", selStart, selEnd, "end");
                            } else if(accent.indexOf("ground") == 0){
                                node.setRangeText("<span class='ground'>" + selected + "</span>", selStart, selEnd, "end");
                            } else {
                                node.setRangeText("<" + accent + ">" + selected + "</" + accent + ">", selStart, selEnd, "end");
                            }
                        };
                    };
                }
            }
        }
    };

    function cleanSelection(selection){
        if (selection) {
          if (selection.empty) {
            selection.empty();
          } else if (selection.removeAllRanges) {
            selection.removeAllRanges();
          } else {
            selection = null;
          }
        }
    }

    $('#line_clean').on('click', function(){
         let body = document.getElementById("create_table");
         while(body.firstChild) {
             body.firstChild.remove();
         }
         $('#cols_number').val(1);
         $('#rows_number').val(1);
         let tbl = createTable(1, 1, null, null, null);
         body.appendChild(tbl);
     });

    $('#line_create_table').on('click', function(){
        let col = $('#cols_number').val();
        let row = $('#rows_number').val();
        let body = document.getElementById("create_table");
        while(body.firstChild) {
            body.firstChild.remove();
        }
        let tbl = createTable(col, row, null, null, null);

        body.appendChild(tbl);
    });

    $('#line_add_row').on('click', function(){
        let col = $('#cols_number').val();
        let row = $('#rows_number').val();
        let add_row = $('#add_number').val();
        let add_col = null;
        let body = document.getElementById("create_table");
        let tbl = body.firstChild;
        let text = readText(col, row);
        tbl.remove();
        row++;
        tbl = createTable(col, row, text, add_col, add_row);
        body.appendChild(tbl);
        $('#rows_number').val(row);
    });

    $('#line_add_col').on('click', function(){
        let col = $('#cols_number').val();
        let row = $('#rows_number').val();
        let add_col = $('#add_number').val();
        let add_row = null;
        let body = document.getElementById("create_table");
        let tbl = body.firstChild;
        let text = readText(col, row);
        tbl.remove();
        col++;
        tbl = createTable(col, row, text, add_col, add_row);
        body.appendChild(tbl);
        $('#cols_number').val(col);
    });

    $('#line_del_row').on('click', function(){
        let col = $('#cols_number').val();
        let row = $('#rows_number').val();
        let del_row = $('#add_number').val();
        let del_col = null;
        if(del_row==0 ){
            window.scrollTo({ top: 0, behavior: 'smooth' });
            $('#result_line').html("Укажите номер удаляемой строки таблицы!!!");
        } else {
            let x = confirm("ВНИМАНИЕ!!!\nДанные, содержащиеся в удаляемой строке, будут утеряны !!!\n" +
                            "ЭТА ОПЕРАЦИЯ НЕ ВОССТАНОВИМА!!!\n\nПродолжить операцию удаления?");
            if(x){
                let body = document.getElementById("create_table");
                let tbl = body.firstChild;
                if(del_row>row){
                    del_row = row;
                }
                del_row--;
                let text = substringText(col, row, del_col, del_row);
                tbl.remove();
                row--;
                tbl = createTable(col, row, text, null, null);
                body.appendChild(tbl);
                $('#rows_number').val(row);
            }
        }
    });

    $('#line_del_col').on('click', function(){
        let col = $('#cols_number').val();
        let row = $('#rows_number').val();
        let del_col = $('#add_number').val();
        let del_row = null;
        if(del_col==0 ){
            window.scrollTo({ top: 0, behavior: 'smooth' });
            $('#result_line').html("Укажите номер удаляемой колонки таблицы!!!");
        } else {
            let x = confirm("ВНИМАНИЕ!!!\nДанные, содержащиеся в удаляемой колонке, будут утеряны !!!\n" +
                            "ЭТА ОПЕРАЦИЯ НЕ ВОССТАНОВИМА!!!\n\nПродолжить операцию удаления?");
            if(x){
                let body = document.getElementById("create_table");
                let tbl = body.firstChild;
                if(del_col>col){
                    del_col = col;
                }
                del_col--;
                let text = substringText(col, row, del_col, del_row);
                tbl.remove();
                col--;
                tbl = createTable(col, row, text, null, null);
                body.appendChild(tbl);
                $('#cols_number').val(col);
            }
        }
    });



    function createTable(col, row, text, add_col, add_row){
        tbl = document.createElement('table');
        tbl.style.width  = '100%';
        let begin = 0;
        if(add_col!=null){
            if(add_col==0 || add_col>=col){
              add_col = col-1;
            } else {
              add_col--;
            }
        }
        if(add_row!=null){
            if(add_row==0 || add_row>=row){
                add_row = row-1;
            } else {
                add_row--;
            }
        }
        for(var i = 0; i < row; i++){
            var tr = tbl.insertRow();
            let el, td, start, end;
            for(var j = 0; j < col; j++){
                td = tr.insertCell();
                el = document.createElement('textarea');
                if(text!=null && j!=add_col && i!=add_row){
                    start = text.indexOf("<td>", begin);
                    end = text.indexOf("</td>", start);
                    el.value = text.substring(start+4, end);
                    begin = end;
                }
                el.setAttribute('type', 'text');
                el.setAttribute('id', `textarea-${i}-${j}`);
                el.setAttribute('contenteditable', true);
                if(row==1){
                    el.setAttribute('style', 'height: 400px;');
                } else {
                    el.setAttribute('style', 'height: 80px;');
                }
                td.appendChild(el);
            }
        }
        return tbl;
    }

    function readText(col, row){
        let t_body = document.getElementById("create_table");
        let t_tbl = t_body.firstChild;
        text = "";
        for(var r = 0; r < row; r++){
            text = text + "<tr>";
            let tr = t_tbl.rows[r];
            for(var c = 0; c < col; c++){
                let td = tr.getElementsByTagName('textarea');
                text += "<td>" + td[c].value + "</td>";
           }
            text = text + "</tr>";
        }
        return text;
    }

    function substringText(col, row, del_col, del_row){
        let t_body = document.getElementById("create_table");
        let t_tbl = t_body.firstChild;
        text = "";
        for(var r = 0; r < row; r++){
            if(r!=del_row){
                text += "<tr>";
                let tr = t_tbl.rows[r];
                for(var c = 0; c < col; c++){
                    if(c!=del_col){
                        let td = tr.getElementsByTagName('textarea');
                        text += "<td>" + td[c].value + "</td>";
                    }
                }
                text = text + "</tr>";
            }
        }
        return text;
    }


});