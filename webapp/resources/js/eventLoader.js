window.addEventListener("load", function(){

    $('#doctors_table_body').on('click', function(event){
        let elem = event.target || event.srcElement;
        let tdId = elem.closest('td').id;
        $('#show_description').css("display", "block");
        $('#description_field_line').text("Свернуть информацию по врачу");

        if(tdId.length > 0){
            let doctorId = tdId.substring(4);
            $.ajax({
                url: 'load-data/doctor',
                method: 'POST',
                dataType: 'json',
                data: {doctorId: doctorId},
                success: function(doctor) {
                    window.scrollTo({ top: 40, behavior: 'smooth' });
                    $('#put_doctor').text(doctor.doctorName);
                    $('#description_table_body').html("<tr><td>" + doctor.description.replace(/\n/g, '<br/>') + "</td></tr>");
                },
                error:  function(response) {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    $('#result_line').html("Ошибка обращения в базу данных. Перегрузите страницу.");
                }
            });
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            $('#result_line').html("Для просмотра кликните в ячейку с фамилией врача (выделено синим цветом и подчеркиванием)");
        }
    });
});
