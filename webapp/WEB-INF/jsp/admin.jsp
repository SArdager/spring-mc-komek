<%@page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"
    "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
    <meta charset="UTF-8">
    <title>Administration</title>
    <script type="text/javascript" src="resources/js/jquery-3.6.0.min.js"></script>
    <script type="text/javascript" src="resources/js/userEditor.js"></script>
    <script>
      var w = Number(window.innerWidth);
      var h = Number(window.innerHeight);
      if (h>w) {
        $('head').append('<link rel="stylesheet" type="text/css" href="resources/css/mobileStyle.css">');
        $('head').append('<meta name="viewport" content="width=device-width, initial-scale=1.0">');
      } else {
        $('head').append('<link rel="stylesheet" type="text/css" href="resources/css/style.css">');
      }
    </script>
</head>
<body>
    <section>
    <div class="container">
        <div class="user_title">
            <span id="user_title_name"></span>
            <a href="logout">Выйти</a>
        </div>
        <hr>
        <h1>АДМИНИСТРИРОВАНИЕ БАЗЫ ДАННЫХ "ДИВЕРА-КОМЕК"</h1>
        <hr>
        <a href="worker">Вернуться</a>
        <br>
        <h3><div id="result_line"></div></h3>
        <h2 id="show_registration">Регистрация нового пользователя</h2>
        <h2 id="show_edit">Редактирование (удаление) пользователя</h2>
        <h2 id="show_search">Поиск логина пользователя</h2>
        <hr>
        <div id="search_form" style="display:none;">
            <div class="cut_field_line" id="cut_find_field" >Скрыть поле поиска пользователей</div>
            <br>
            <p>
                <div class="main_block">
                   <div class="field">
                       <label>Пользователь</label>
                       <input type="text" id="user_name" size="40" placeholder="Первые три буквы фамилии" required/>
                   </div>
                   <input type="hidden" id="user_id" value="0"/>
                   <div class="field" id="show_select" style="display: none; ">
                       <label></label>
                       <select id="select_user">
                       </select>
                   </div>
                   <br>
                </div>
            </p>
        </div>
        <div id="user_form" style="display:none;">
            <div class="cut_field_line" id="cut_user_field" >Скрыть поле ввода пользователей</div>
            <br>
            <p>
                <div class="main_block">
                    <div class="field">
                        <label>Фамилия</label>
                        <input type="text" id="surname" size="40" required />
                    </div>
                    <div class="field">
                        <label>Имя</label>
                        <input type="text" id="firstname" size="40" required />
                    </div>
                    <div class="field">
                        <label>Должность</label>
                        <input type="text" id="position" size="40" required />
                    </div>
                    <div class="field">
                       <label>Выбор из списка</label>
                       <select id="select_position">
                            <option value="0">Кликните из списка</option>
                            <option value="1">Оператор КЦ</option>
                            <option value="2">Оператор КЦ по выездам</option>
                            <option value="3">Оператор по работе с обращениями</option>
                            <option value="4">Оператор КЦ по работе с юр.лицами</option>
                            <option value="5">Старший оператор КЦ</option>
                            <option value="6">Руководитель КЦ</option>
                       </select>
                    </div>
                    <div class="field">
                       <label>Почтовый адрес</label>
                       <input type="email" id="email" size="40" required/>
                    </div>
                    <div class="field">
                        <label>Логин</label>
                      <input type="text" id="username" size="40" required />
                    </div>
                   <u>Права доступа</u>
                   <div class="field">
                       <label>Просмотр записей</label>
                       <input type="radio" id="readerId" name="rights" value="reader" checked="checked"/>
                   </div>
                    <div class="field">
                        <label>Редактирование текста</label>
                        <input type="radio" id="editorId" name="rights" value="editor" />
                    </div>
                    <br>
                    <div class="field">
                        <label>Административные права</label>
                        <input type="radio" id="adminId" name="rights" value="admin" />
                    </div>
                    <br>
                </div>
            </p>
        </div>
        <br>
        <div id="show_reg_btn" style="display:none;">
            <button id="btn_reg" style="margin-left: 160px;">Зарегистрировать</button>
        </div>

        <div id="show_change_btn" style="display:none;">
            <button id="btn_change" style="margin-left: 160px;">Изменить</button>
            <br>
            <p><button id="btn_delete" style="margin-left: 160px;">Удалить</button></p>
        </div>
        <div id="show_remove_btn" style="display:none;">
            <button id="btn_remove" style="margin-left: 160px;">Восстановить</button>
        </div>

        <div id="search_field" style="display:none;">
            <div class="cut_field_line" id="cut_search_field" >Скрыть поле поиска пользователей</div>
            <p class ="prompt_line">При поиске можно пользоваться символом %, заменяющим произвольную последовательность букв в конце слова</p>
            <p>
                <div class="main_block" style="float: left;">
                    <div class="field">
                        <label>Фамилия</label>
                        <input type="text" id="search_surname" size="40" />
                    </div>
                    <div class="field">
                        <label>Имя</label>
                        <input type="text" id="search_name" size="40" />
                    </div>
                    <br>
                </div>
            </p>
            <button id="btn_search_user" style="margin-left: 160px;">Вывести список</button>
            <table border ="1">
                <caption><strong>Таблица пользователей</strong></caption>
                <thead>
                    <th>Логин</th>
                    <th>Фамилия, имя</th>
                    <th>Должность</th>
                    <th>Email</th>
                    <th>Права</th>
                </thead>
                <tbody id="users_table_body">
                </tbody>
            </table>
        </div>

    <script>
      $(document).ready(function(){
        $("h1").css("color", "blue");
        let name = "${user.userFirstname}";
        document.getElementById("user_title_name").textContent = name.substring(0, 1) + ". ${user.userSurname}";
        let resultLineValue;
        let clickNumber = 0;
        window.addEventListener("click", function(){
            clickNumber++;
            resultLineValue = $('#result_line').text();
            if(clickNumber==0){
                $('#result_line').text("");
            }
            if(resultLineValue.length>0){
                clickNumber = -1;
            }
        });
      });
    </script>

    <div class="buffer" style = "height: 5em;">
    </div>
    </div>
    </section>
</body>
</html>