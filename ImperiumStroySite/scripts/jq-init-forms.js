function initForms(selector) {
    var forms = $(selector);
    forms.each(function () {
        var $form = $(this);
        $form.submit(function (e) {
            e.preventDefault();
            var $button = $form.find("button[type=submit]");
            var $inputs = $form.find("input, textarea, select, button:not([type='reset'])");

            // var data = $form.serializeArray();
            // data.push({ name: "Url", value: window.location },{ name: "Type", value: $form.data("type") });

            var data = new FormData(this);
            data.append("Url", window.location);
            data.append("Type", $form.data("type"));

            $.ajax({
                type: "POST",
                url: $form.attr("action"),
                data: data,
                contentType: false,
                processData: false,
                beforeSend: function () {
                    $inputs.attr("disabled", true);
                    $button.addClass("loading");
                },
                success: function (data, textStatus, xhr) {
                    $inputs.attr("disabled", true);
                    $form.find(".form-default__message").addClass("show");
                    $button.text("Отправлено");
                },
                error: function (data, textStatus, xhr) {
                    $inputs.attr("disabled", false);
                    $button.removeClass("loading");
                    alert("Все плохо");
                }
            });
        });
    });
}

function initValidator() {
    if ($.validate) {
        $.validate({
            lang: document.documentElement.lang,
            errorMessageClass: 'input-container__error',
            scrollToTopOnError: false
        });
    }
    else console.log("jquery-form-validator is missing");
}

$(document).ready(function () {
    initValidator();
    initForms("form");
});