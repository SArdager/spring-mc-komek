<%@page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags" %>
<%@ taglib prefix="c"  uri="http://java.sun.com/jsp/jstl/core" %>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"
    "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html" charset="UTF-8">
    <title>Knowledge Base Editor</title>
    <script type="text/javascript" src="resources/js/jquery-3.6.0.min.js"></script>
    <script type="text/javascript" src="resources/js/editKnowledge.js"></script>
    <script type="text/javascript" src="resources/js/editCenter.js"></script>
    <script type="text/javascript" src="resources/js/editText.js"></script>
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
        <div class="user_title">
            <a href="worker">Выйти из редактирования</a>
            <sec:authorize access="hasRole('ADMIN')">
                <a href="admin">Администрирование</a>
            </sec:authorize>
        </div>
        <hr>
        <div class="page_column">
          <div class="row_column">
            <div class="item_column">
              <h1>РЕДАКТИРОВАНИЕ БАЗЫ ДАННЫХ "ДИВЕРА-КОМЕК"</h1>
            </div>
            <div class="item_column">
              <div class="row_info">
                <div id="knowledge_edit" class="background_bold" style="margin-right: 20px;"><u>Редактирование базы знаний</u></div>
                <div id="mc_edit" class="background_white"><u>Редактирование мед.центра</u></div>
                <input id="text_mode" type="hidden" value="true" />
              </div>
            </div>
          </div>
        </div
        <hr>
        <h3><div id="result_line"></div></h3>
        <div id="knowledge_field">
          <div class="page_column">
            <div class="row_column">
              <div class="item_column">
                <div class="main_block">
                    <div class="field">
                        <label>Группа знаний</label>
                        <select id="select_knowledge">
                            <option value="-1">Добавить новую группу</option>
                            <c:forEach var="knowledge" items="${knowledgeList}">
                                <option value=${knowledge.id}>${knowledge.knowledgeName}</option>
                            </c:forEach>
                        </select>
                    </div>
                    <div id="change_knowledge">
                        <div class="field">
                            <label>Новое название</label>
                            <input type="text" id="knowledge_name" maxlength="120" />
                        </div>
                        <div class="field">
                            <label></label>
                            <input type="hidden" id="btn_del_knowledge" value="Удалить" />
                            <input type="button" id="btn_knowledge" value="Создать" />
                        </div>
                    </div>
                </div>
                <div id="show_language" style="display: none;">
                  <br><br>
                  <p>
                    <div class="row_info">
                        <div style="margin-right: 40px;">Выберите язык:</div>
                        <div class="radio_name"><input type="radio" name="language" value="kz"><span>- KZ</span></input></div>
                        <div class="radio_name"><input type="radio" name="language" value="ru" checked="checked"><span>- RU</span></input></div>
                    </div>
                  </p>
                </div>
              </div>
              <div class="item_column">
                <div class="main_block">
                    <div id="change_type" style="display: none;">
                        <div class="field">
                            <label>Категория знаний</label>
                            <select id="select_type">
                            </select>
                        </div>
                        <div class="field">
                            <label>Новое название</label>
                            <input type="text" id="type_name" maxlength="120" />
                        </div>
                        <div class="field">
                            <label></label>
                            <input type="hidden" id="btn_del_type" value="Удалить" />
                            <input type="button" id="btn_type" value="Создать" />
                        </div>
                    </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div id="mc_field" style="display: none;">
          <div class="page_column">
            <div class="row_column">
              <div class="item_column">
                <div class="main_block">
                    <div class="field">
                        <label>Выберите город</label>
                        <select id="select_city">
                            <option value="-1">Добавить новый город</option>
                            <c:forEach var="city" items="${cities}">
                                <option value=${city.id}>${city.cityName}</option>
                            </c:forEach>
                        </select>
                    </div>
                    <div id="change_city">
                        <div class="field">
                            <label>Новое название</label>
                            <input type="text" id="city_name" maxlength="120" />
                        </div>
                        <div class="field">
                            <label></label>
                            <input type="hidden" id="btn_del_city" value="Удалить" />
                            <input type="button" id="btn_city" value="Создать" />
                        </div>
                    </div>
                </div>
              </div>
              <div class="item_column">
                <div class="main_block">
                    <div id="change_center" style="display: none;">
                        <div class="field">
                            <label>Медицинский центр</label>
                            <select id="select_mc">
                            </select>
                        </div>
                        <div id="change_mc">
                            <div class="field" id="new_name_line">
                                <label>Новое название</label>
                                <input type="text" id="mc_name" maxlength="120" />
                            </div>
                            <div class="field">
                                <label></label>
                                <input type="hidden" id="btn_del_mc" value="Удалить" />
                                <input type="button" id="btn_mc" value="Создать" />
                            </div>
                        </div>
                    </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <hr>
        <div id="show_center" style="display: none;">
            <div class="page_column">
              <div class="row_column">
                <div class="item_column">
                    <h2>Редактирование медицинского центра</h2>
                    <div class="main_block">
                      <div class="field">
                        <label>Краткое название</label>
                        <input type="text" id="center_name" maxlength="40" style="width: 410px;"/>
                      </div>
                      <div class="field">
                        <label>Адрес, телефоны</label>
                        <textarea id="address" rows="2" maxlength="240" style="width: 420px;"></textarea>
                      </div>
                      <div class="field">
                        <label>Ориентир, транспорт</label>
                        <textarea id="transport" rows="3" maxlength="490" style="width: 420px;"></textarea>
                      </div>
                    </div>
                </div>
                <div class="item_column">
                    <h4  id="close_center_field" style="color: aqua; margin-top: 10px;">Свернуть поле редактирования</h4>
                    <div class="main_block">
                      <div class="field">
                        <label>Полное название</label>
                        <input type="text" id="center_full_name" maxlength="140" style="width: 410px;"/>
                      </div>
                      <div class="field">
                        <label>Описание центра</label>
                        <textarea id="center_description" rows="6" style="width: 420px;"></textarea>
                      </div>
                      <br>
                      <div class="field">
                        <label></label>
                        <button id ="btn_change_mc" >Изменить</button>
                      </div>
                    </div>
                </div>
              </div>
            </div>
            <hr>
        </div>
        <div id="show_doctors" style="display: none;">
            <div class="row_info">
                <div id="speciality_edit" class="background_bold" style="margin-left: 30px;"><u>Редактирование врачей</u></div>
                <div id="service_edit" class="background_white" style="margin-left: 30px;"><u>Редактирование услуг</u></div>
                <input id="doctor_mode" type="hidden" value="true" />
            </div>
            <div id="show_speciality">
              <div class="page_column">
                <div class="row_column">
                  <div class="item_column">
                    <div class="main_block">
                        <div class="field">
                            <label>Выбрать врача</label>
                            <select id="select_doctor">
                            </select>
                        </div>
                        <div class="field">
                            <label>ФИО врача</label>
                            <input type="text" id="doctor_name" maxlength="120" />
                        </div>
                        <div class="field">
                            <label></label>
                            <input type="button" id="btn_doctor" value="Добавить" />
                            <input type="hidden" id="btn_del_doctor" value="Удалить" />
                        </div>
                    </div>
                  </div>
                  <div class="item_column">
                    <div class="main_block">
                      <div class="field">
                        <label>Специализация</label>
                        <select id="select_speciality">
                          <option value="-1">Добавить специализацию</option>
                          <c:forEach var="speciality" items="${specialities}">
                              <option value=${speciality.id}>${speciality.specialityName}</option>
                          </c:forEach>
                        </select>
                      </div>
                      <div class="field">
                            <label>Новое название</label>
                            <input type="text" id="speciality_name" maxlength="120" />
                      </div>
                      <div class="field">
                          <label></label>
                          <input type="hidden" id="btn_del_speciality" value="Удалить" />
                          <input type="button" id="btn_speciality" value="Создать" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div id="show_service" style="display: none;">
              <div class="page_column">
                <div class="row_column">
                  <div class="item_column">
                    <div class="main_block">
                        <div class="field">
                            <label>Выбрать услугу</label>
                            <select id="select_center_service">
                            </select>
                        </div>
                        <div id="change_service">
                            <div class="field">
                                <label>Добавить услугу из списка</label>
                                <select id="select_service">
                                  <option value="-1">Создать новую услугу</option>
                                  <c:forEach var="services" items="${servicesList}">
                                      <option value=${services.id}>${services.serviceName}</option>
                                  </c:forEach>
                                </select>
                            </div>
                        </div>
                        <div class="field">
                            <label></label>
                            <input type="hidden" id="btn_remove_service" value="Убрать" />
                            <input type="button" id="btn_add_service" value="Добавить" />
                        </div>
                        <div class="field" id="service_name_field" style="display: none;">
                            <label>Новое название услуги</label>
                            <input type="text" id="service_name" maxlength="120" />
                        </div>
                        <div class="field">
                            <label></label>
                            <input type="hidden" id="btn_del_service" value="Удалить" />
                            <input type="hidden" id="btn_service" value="Создать" />
                        </div>
                    </div>
                  </div>
                  <div id="choose_doctor">
                    <div class="item_column" >
                      <div class="main_block">
                          <div class="field">
                              <label>Специалист</label>
                              <select id="select_service_doctor">
                              </select>
                          </div>
                          <div id="choose_service_doctor">
                            <div class="field">
                                <label>Выбрать специалиста</label>
                                <select id="select_all_doctors">
                                </select>
                            </div>
                            <div class="field" id="new_select_doctor_field" style="display: none;">
                                <label>Врачи мед.центра</label>
                                <select id="select_new_doctor">
                                </select>
                            </div>
                            <div class="field" id="new_name_doctor_field" style="display: none;">
                                <label>Новый специалист</label>
                                <input type="text" id="new_name_doctor" maxlength="120" />
                                </select>
                            </div>
                          </div>
                          <div class="field">
                              <label></label>
                              <input type="hidden" id="btn_del_service_doctor" value="Убрать" />
                              <input type="button" id="btn_service_doctor" value="Выбрать" />
                          </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div id="show_description" style="display: none;">
                <div class="main_block">
                    <div class="field">
                        <label>Квалификация врача</label>
                        <textarea rows="2" id="experience" maxlength="490" style="width: 900px;" ></textarea>
                    </div>
                    <div class="field">
                        <label>Предоставляемые услуги</label>
                        <textarea id="addition" rows="4" maxlength="1950" style="width: 900px;"></textarea>
                    </div>
                    <div class="field">
                        <label>Время приема</label>
                        <textarea id="doctor_work_time" rows="3" maxlength="490" style="width: 900px;"></textarea>
                    </div>
                </div>
                <br>
                <p><h4>Описание предоставления услуг</h4></p>
            </div>
        </div>
        <div id="show_article" style="display: none;">
            <div class="row_btn">
                <div class="color_line" id ="line_clean" >Очистить поле</div>
                <div class="color_line" id="line_create_table">Создать новое поле</div>
                <label for="cols_number">кол-во колонок</label>
                <input type="number" id="cols_number" size="2" value="1" style="margin-right: 40px;" />
                <label for="rows_number">кол-во строк</label>
                <input type="number" id="rows_number" size="2" value="1" />
            </div>
            <div class="row_btn">
                <div class="color_line" id ="line_add_row" >Вставить строку</div>
                <div class="color_line" id ="line_add_col" >Вставить колонку</div>
                <div class="color_line" id ="line_del_row" >Удалить строку</div>
                <div class="color_line" id ="line_del_col" >Удалить колонку</div>
                <label for="add_number" >номер колонки(строки)</label>
                <input type="number" id="add_number" size="2" value="0" />
            </div>
            <div>
                <div style="display: inline-block; vertical-align: bottom">
                    <div class="write_line" id="line_bold_article" ><b>Полужирный</b></div>
                    <div class="write_line" id="line_cur_article" ><i>Курсив</i></div>
                    <div class="write_line" id="line_under_article" ><u>Подчеркнуть</u></div>
                    <div class="write_line" id="line_color_article" style="color: red;">Выделить цветом</div>
                    <div class="write_line" id="line_background_article" style="color: black; background-color: #ADFF2F;">Выделить фоном</div>
                </div>
                <div style="display: inline-block;margin-left: 30px;">
                    <button id ="btn_text" style="background-color: wheat; margin: 0px">Внести в базу</button>
                </div>
            </div>
            <hr>
            <input type="hidden" id="article_id" />
            <div class = "table_body" id="create_table">
            </div>
        </div>



    </div>
    </section>

    <script>
        $(document).ready(function(){
            $("h1").css("color", "red");
            let name = "${user.userFirstname}";
            $('#user_title_name').text(name.substring(0, 1) + ". ${user.userSurname}");
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
    </body>
</html>

