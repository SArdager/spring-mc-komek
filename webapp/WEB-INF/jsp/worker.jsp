<%@page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags" %>
<%@ taglib prefix="c"  uri="http://java.sun.com/jsp/jstl/core" %>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"
    "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html" charset="UTF-8">
    <title>Knowledge Base Work</title>
    <script type="text/javascript" src="resources/js/jquery-3.6.0.min.js"></script>
    <script type="text/javascript" src="resources/js/work.js"></script>
    <script type="text/javascript" src="resources/js/selectLoader.js"></script>
    <script type="text/javascript" src="resources/js/eventLoader.js"></script>
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
          <a href="change-password">Сменить пароль</a>
          <a href="logout">Выйти</a>
      </div>
      <div class="user_title">
          <span id="editor_show_href" style="display:none;">
              <a href="editor">Редактирование записей</a>
          </span>
          <sec:authorize access="hasRole('ADMIN')">
              <a href="admin">Администрирование</a>
          </sec:authorize>
      </div>
      <hr>
      <div class="page_column">
        <div class="row_column">
          <div class="item_column">
            <h1>БАЗА ДАННЫХ "ДИВЕРА-КОМЕК"</h1>
          </div>
          <div class="item_column">
            <div class="row_info">
              <div id="btn_left_pos" >
                <span class="arr_left" id="btn_left"></span>
              </div>
              <div id="btn_right_pos" >
                <span class="arr_right" id="btn_right"></span>
              </div>
            </div>
          </div>
        </div>
      </div
      <hr>
      <h3><div id="result_line"></div></h3>
      <div class="page_column">
        <div class="row_column">
          <div class="item_column" id ="left_column_">
              <div class="main_block">
                  <div class="field">
                      <label>Группа знаний</label>
                      <select id="select_knowledge">
                          <c:forEach var="knowledge" items="${knowledgeList}">
                              <option value=${knowledge.id}>${knowledge.knowledgeName}</option>
                          </c:forEach>
                      </select>
                  </div>
                  <div class="field">
                      <label>Категория знаний</label>
                      <select id="select_type">
                      </select>
                  </div>
                  <div class = "field" >
                      <label>Поиск слов по базе</label>
                      <input type="text" id="find_words" style="width: 240px;"/>
                  </div>
              </div>
              <p>
                <div class="row_info">
                    <div class="radio_name"><input type="radio" name="language" value="kz"><span id="kz_radio" class="background_white">- KZ</span></input></div>
                    <div class="radio_name"><input type="radio" name="language" value="ru" checked="checked"><span id="ru_radio" class="background_white">- RU</span></input></div>
                    <div class="btn_line" id="line_find_words"><b>Произвести поиск</b></div>
                    <div class="btn_line" id="line_clean_result">Очистить поле</div>
                </div>
              </p>
          </div>

          <div class="item_column" id ="right_column_">
              <div class="main_block">
                  <div class="field">
                      <label style="margin-right: 30px;">Город</label>
                      <select id="select_city" >
                        <c:forEach var="city" items="${cities}">
                          <option value=${city.id}>${city.cityName}</option>
                        </c:forEach>
                      </select>
                  </div>
                  <div class="field">
                      <label style="margin-right: 30px;">Мед.центр</label>
                      <select id="select_center">
                        <option value="-1">Нет медицинских центров</option>
                      </select>
                  </div>
                  <div class="field" id="show_doctor">
                      <label>Специализация</label>
                      <select id="select_speciality">
                        <c:forEach var="speciality" items="${specialities}">
                            <option value=${speciality.id}>${speciality.specialityName}</option>
                        </c:forEach>
                      </select>
                  </div>
                  <div class="field" id="show_services" style="display: none">
                      <label>Выбор услуги</label>
                      <select id="select_services">
                        <c:forEach var="services" items="${servicesList}">
                            <option value=${services.id}>${services.serviceName}</option>
                        </c:forEach>
                      </select>
                  </div>
              </div>
              <p>
                <div class="row_info">
                    <div class="radio_name"><input type="radio" name="show" value="doc" checked="checked"><span id="doc_radio" class="background_white">- врачи</span></input></div>
                    <div class="radio_name"><input type="radio" name="show" value="srv" ><span id="srv_radio" class="background_white">- услуги</span></input></div>
                    <div class="btn_line" id="mc_field_line">Информация по мед.центру</div>
                    <div class="btn_line" id="description_field_line">Информация по врачу(услуге)</div>
                </div>
              </p>
          </div>
        </div>
      </div>
      <hr>
      <div class="page_column">
        <div class="row_column">
          <div class="item_column" id = "left_column">
              <div class = "shot_table_body" id="show_result" style = "max-height: 360px; overflow-y: auto; display:none;">
                 <div class = "table_title"><strong><u>Результаты поиска</u></strong></div>
                 <table>
                    <thead>
                      <tr>
                        <th width="20%">Категория (группа)</th>
                        <th width="80%">Информация по поиску</th>
                      </tr>
                    </thead>
                 </table>
                 <div style="border-collapse: separate;">
                    <table class="tr_underline" id = "article_table_body">
                    </table>
                 </div>
              <hr>
              </div>
              <h2 id="info_title">Справочная информация</h2>
                  <div style="border-collapse: separate;">
                    <div class="type_title" id="put_type_name"></div>
                    <table class="tr_underline" id = "text_table_body">
                    </table>
                  </div>
          </div>
          <div class="item_column" id = "right_column">
              <div class="shot_table_body" id="show_mc" style = "max-height: 250px; overflow-y: auto; display:none">
                <h3>Информация по медицинскому центру</h3>
                <table>
                    <thead >
                       <tr>
                        <th width="20%">Адрес</th>
                        <th width="30%">Транспорт</th>
                        <th width="50%">Описание</th>
                       </tr>
                    </thead>
                    <tbody id = "center_table_body">
                    </tbody>
                </table>
                <br>
              </div>
              <div class = "shot_table_body" id = "show_description" style = "max-height: 360px; overflow-y: auto; display:none">
                    <div class="row_info" style="margin-top: 4px">
                        <div class="doctor_title">Описание предоставления услуг врачом: </div>
                        <div class="doctor_name" id="put_doctor"></div>
                        <div class = "field_line" id="close_description_field">Свернуть поле описания</div>
                    </div>
                    <table>
                        <tbody id = "description_table_body">
                        </tbody>
                    </table>
                  <hr>
              </div>
              <div class="row_info">
                  <h2>Врачи по специализации:<h2>
                  <div class="speciality_name" id="put_speciality"></div>
              </div>
              <table style = "overflow-y: auto;">
                  <tbody id = "doctors_table_body">
                  </tbody>
              </table>
          </div>
        </div>
      </div>
    </div>
    </section>

    <script>
        $(document).ready(function(){
            $("h1").css("color", "blue");
            let name = "${user.userFirstname}";
            $('#user_title_name').text(name.substring(0, 1) + ". ${user.userSurname}");
            let editor = "${user.editor}";
            if(editor){
                $('#editor_show_href').css("display", "block");
            }
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
            $('#select_knowledge').trigger("change");
        });
    </script>

    <div class="buffer" style = "height: 5em;">
    </div>
    </div>
  </body>
</html>


