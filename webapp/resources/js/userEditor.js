$(document).ready(function(){

    function closeAll(){
        $('#search_form').css("display", "none");
        $('#user_form').css("display", "none");
        $('#show_reg_btn').css("display", "none");
        $('#show_change_btn').css("display", "none");
        $('#show_remove_btn').css("display", "none");
        $('#search_field').css("display", "none");
    }
    $('#show_registration').on("click", function(){
        closeAll();
        $('#user_form').css("display", "block");
        $('#show_reg_btn').css("display", "block");
    });

    $('#show_edit').on("click", function(){
        closeAll();
        $('#search_form').css("display", "block");
    });

    $('#show_search').on("click", function(){
        closeAll();
        $('#search_field').css("display", "block");
    });

    $('#cut_user_field').on("click", function(){
        closeAll();
    });

    $('#cut_find_field').on("click", function(){
        closeAll();
    });

    $('#cut_search_field').on("click", function(){
        closeAll();
    });

    $('#select_position').on('change', function(){
        $('#position').val($('#select_position option:selected').text());
        $('#select_position').val("0");
    });


    $('#btn_reg').on("click", function(){
        let surname = $('#surname').val();
        let firstname = $('#firstname').val();
        let position = $('#position').val();
        let email = $('#email').val();
        let username = $('#username').val();
        let role;
        let editor;
        if($('#adminId').is(':checked')==true){
            role = "ADMIN";
            editor = true;
        } else {
            role = "USER";
            if($('#editorId').is(':checked')==true){
                editor = true;
            } else {
                editor = false;
            }
        }

        function checkLogin(){
            if(username.length>4){
                if(position.length > 4 && email.length > 6 && surname.length > 0){
                    return true;
                } else {
                    $('#result_line').html("Проверьте заполнение всех полей формы !!! \n Фамилия должна содержать символы.\n \n Перегрузите страницу ввода!!!");
                    return false;
                }
            } else {
                $('#result_line').html("Логин пользователя должен быть длинее 5 символов.");
                return false;
            }
        }
        if(checkLogin()){
            $('#btn_reg').css("display", "none");
            $.ajax({
                url : 'admin/add-user',
                method: 'POST',
                dataType: 'text',
                data : {userSurname: $('#surname').val(), userFirstname: $('#firstname').val(), position: $('#position').val(),
                    email: $('#email').val(), username: $('#username').val(), role: role, editor: editor},
                success : function(message) {
                    $('#btn_reg').css("display", "block");
                    $('#result_line').html(message);
                    if(message.indexOf("добавлен")>0){
                        $('#surname').val("");
                        $('#firstname').val("");
                        $('#position').val("");
                        $('#email').val("");
                        $('#username').val("");
                        $('#readerId').attr('checked', true);
                    }
                },
                error:  function(response) {
                    $('#btn_reg').css("display", "block");
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    $('#result_line').html("Ошибка обращения в базу данных. Перегрузите страницу.");
                }
            });
        }
    });

    let user_name = document.getElementById("user_name");
    user_name.oninput = function(){
        let textValue = $('#user_name').val();
        $('#user_id').val(0);
        if(textValue.length>2){
            $('#user_name').attr("readonly", true);
            $.ajax({
                url : 'admin/search-user',
                method: 'POST',
                dataType: 'json',
                data : {text: textValue},
                success : function(users) {
                    $('#select_user').empty();
                    $('#show_select').css("display", "block");
                    $.each(users, function(key, user){
                        $('#select_user').append('<option value="-1">Выберите пользователя</option>');
                        $('#select_user').append('<option value="' + user.id + '">' +
                            user.userSurname + ' ' + user.userFirstname + '; ' +
                            user.username + '</option>');
                    });
                    $('#user_name').attr("readonly", false);
                },
                error:  function(response) {
                    $('#user_name').attr("readonly", false);
                    $('#result_line').html(response);
                }
            });
        } else {
            $('#show_select').css("display", "none");
            $('#user_form').css("display", "none");
            $('#user_name').attr("readonly", false);
            $('#surname').val("");

            $('#position').val("");
            $('#email').val("");
            $('#username').val("");
            document.getElementById("readerId").attr('checked', true);
        }
    };

    $('#select_user').on('click', function(){
        let userId = $('#select_user').val();
        if(userId>0){
            $('#user_id').val(userId);
            $('#search_form').css("display", "none");
            $('#show_reg_btn').css("display", "none");
            $('#user_form').css("display", "block");
            $.ajax({
                url : 'load-data/user',
                method: 'POST',
                dataType: 'json',
                data : {id: userId},
                success : function(user) {
                    $('#surname').val(user.userSurname);
                    $('#firstname').val(user.userFirstname);
                    $('#position').val(user.position);
                    $('#email').val(user.email);
                    $('#username').val(user.username);
                    if(user.role == "ADMIN"){
                        $('#adminId').attr('checked', true);
                    } else {
                        if(user.editor == 'true'){
                            $('#editorId').attr('checked', true);
                        } else {
                            $('#readerId').attr('checked', true);
                        }
                    }
                    if(user.isEnabled){
                        $('#show_change_btn').css("display", "block");
                        $('#show_remove_btn').css("display", "none");
                    } else {
                        $('#show_change_btn').css("display", "none");
                        $('#show_remove_btn').css("display", "block");
                    }
                },
                error:  function(response) {
                    $('#user_name').attr("readonly", false);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    $('#result_line').html("Ошибка обращения в базу данных. Перегрузите страницу.");
                }
            });
        }
    });

    $('#btn_change').on('click', function(){
        let userId = $('#user_id').val();
        if(userId > 0){
            $('#btn_change').css("display", "none");
            let role;
            let editor;
            if($('#adminId').is(':checked')==true){
                role = "ADMIN";
                editor = true;
            } else {
                role = "USER";
                if($('#editorId').is(':checked')==true){
                    editor = true;
                } else {
                    editor = false;
                }
            }
            $.ajax({
                url: 'admin/edit-user',
                method: 'POST',
                dataType: 'text',
                data: {id: $('#user_id').val(), userSurname: $('#surname').val(),
                    userFirstname: $('#firstname').val(), position: $('#position').val(),
                    email: $('#email').val(), username: $('#username').val(), role: role, editor: editor},
                success: function(message) {
                    $('#btn_change').css("display", "block");
                    $('#result_line').html(message);
                    $('#user_name').val("");
                    $('#surname').val("");
                    $('#firstname').val("");
                    $('#position').val("");
                    $('#email').val("");
                    $('#username').val("");
                    $('#readerId').is(':checked') = true;
                    closeAll();
                },
                error:  function(response) {
                    $('#btn_change').css("display", "block");
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    $('#result_line').html("Ошибка обращения в базу данных. Перегрузите страницу.");
                }
            });
        } else {
            $('#result_line').html("Выберите пользователя из списка");
        }
    });

    $('#btn_delete').on('click', function(){
        let userId = $('#user_id').val();
        if(userId > 0){
            $('#btn_delete').css("display", "none");
            $.ajax({
                url: 'admin/del-user',
                method: 'POST',
                dataType: 'text',
                data: {id: $('#user_id').val()},
                success: function(message) {
                    $('#btn_delete').css("display", "block");
                    $('#result_line').html(message);
                    $('#user_name').val("");
                    $('#surname').val("");
                    $('#firstname').val("");
                    $('#position').val("");
                    $('#email').val("");
                    $('#username').val("");
                    $('#readerId').attr('checked', true);
                    closeAll();
                },
                error:  function(response) {
                    $('#btn_delete').css("display", "block");
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    $('#result_line').html("Ошибка обращения в базу данных. Перегрузите страницу.");
                }
            });
        } else {
            $('#result_line').html("Выберите пользователя из списка");
        }
    });

    $('#btn_remove').on('click', function(){
        let userId = $('#user_id').val();
        if(userId > 0){
            $('#btn_remove').css("display", "none");
            $.ajax({
                url: 'admin/remove-user',
                method: 'POST',
                dataType: 'text',
                data: {id: $('#user_id').val()},
                success: function(message) {
                    $('#btn_remove').css("display", "block");
                    $('#result_line').html(message);
                    $('#user_name').val("");
                    $('#surname').val("");
                    $('#firstname').val("");
                    $('#position').val("");
                    $('#email').val("");
                    $('#username').val("");
                    $('#readerId').attr('checked', true);
                    closeAll();
                },
                error:  function(response) {
                    $('#btn_remove').css("display", "block");
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    $('#result_line').html("Ошибка обращения в базу данных. Перегрузите страницу.");
                }
            });
        } else {
            $('#result_line').html("Выберите пользователя из списка");
        }
    });

    $('#btn_search_user').on('click', function(){
        $('#btn_search_user').css("display", "none");
        $.ajax({
            url: 'admin/search-users',
            method: 'POST',
            dataType: 'json',
            data: {userSurname: $('#search_surname').val(), userFirstname: $('#search_name').val()},
            success: function(users) {
                $('#btn_search_user').css("display", "block");
                let new_lines_html ='';
                let body = $('#users_table_body');
                body.html('');
                if(!$.isArray(users)|| !users.length){
                    $('#result_line').html("Пользователь не найден в базе. Возможно из-за наличия букв казахского алфавита.");
                } else {
                    $.each(users, function(key, user){
                        let rights = "";
                        if(user.isEnabled == "false") {
                            rights = "нет доступа";
                        } else if(user.role == "ADMIN"){
                            rights = "администратор";
                        } else if(user.editor == true) {
                            rights = "редактор";
                        } else {
                            rights = "оператор";
                        }
                        new_lines_html+="<tr><td style='color: blue; text-decoration: underline'>"+ user.username + "</td><td>" +
                            user.userSurname + " " + user.userFirstname + "</td><td>" + user.position + "</td><td>" +
                            user.email + "</td><td>" + rights + "</td></tr>";
                    });
                }
                body.prepend(new_lines_html);
            },
            error:  function(response) {
                $('#btn_search_user').css("display", "block");
                window.scrollTo({ top: 0, behavior: 'smooth' });
                $('#result_line').html("Ошибка обращения в базу данных. Перегрузите страницу.");
            }
        });
    });


});
