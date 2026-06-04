var form = document.querySelector("form");
var complete_section = document.querySelector(".complete--section");
var form_section = document.querySelector(".form--section");
var cvc_dom = document.getElementById("cvc_dom");
var cvc = document.getElementById("cvc");
var month = document.querySelector('[name="exp_month"]');
var year = document.querySelector('[name="exp_year"]');
var cnumber_input = document.getElementById("cnumber");
var card_number_re = /\d{4}\s\d{4}\s\d{4}\s\d{4}/;
var startIndex = 0;
var endIndex = 4;
form === null || form === void 0 ? void 0 : form.setAttribute("novalidate", "");
function getDomPairField(field) {
    var field_pair;
    switch (field.name) {
        case "cardholder_name":
            field_pair = document.getElementById("cardholder_name_dom");
            break;
        case "card_number":
            field_pair = document.getElementById("card_number_dom");
            break;
        case "exp_month":
            field_pair = document.getElementById("card_month_dom");
            break;
        case "exp_year":
            field_pair = document.getElementById("card_year_dom");
            break;
        case "cvc_number":
            field_pair = document.getElementById("cvc_dom");
    }
    return field_pair;
}
function autoCorrectNums(field) {
    if (field instanceof HTMLInputElement) {
        if (+field.value < 10 && field.value.length === 1) {
            field.value = "0" + field.value;
        }
    }
}
function valditateField(field) {
    var _a;
    var errorEl = (_a = field.parentElement) === null || _a === void 0 ? void 0 : _a.querySelector(".error-text");
    if (errorEl) {
        if (field.validity.valueMissing && errorEl) {
            errorEl.textContent = errorEl.dataset.error || "Can´t be blank";
            return false;
        }
        if (field.name === "card_number" && field.validity.patternMismatch) {
            errorEl.textContent = "Wrong format, numbers only";
            return false;
        }
        if (field.name === "exp_month") {
            if (!/\d{2}/.test(field.value) || +field.value < 1 || +field.value > 12) {
                errorEl.textContent = "The month number must be between 1-12";
                return false;
            }
        }
        if (field.name === "exp_year") {
            if (!/\d{2}/.test(field.value)) {
                errorEl.textContent = "The value must be a number between 0-99";
                return false;
            }
        }
        if (field.name === "cvc_number") {
            var re = /\d{3}/;
            if (!re.test(field.value)) {
                errorEl.textContent = "The value must be 3 digit number";
                return false;
            }
        }
        errorEl.textContent = "";
    }
    return true;
}
form === null || form === void 0 ? void 0 : form.querySelectorAll("input").forEach(function (input) {
    input.addEventListener("blur", function () {
        valditateField(input);
    });
});
[month, year].forEach(function (field) {
    field === null || field === void 0 ? void 0 : field.addEventListener("blur", function (e) {
        if (e.target)
            autoCorrectNums(e.target);
    });
});
if (cnumber_input) {
    cnumber_input.addEventListener("input", function (e) {
        var cnumber_value = cnumber_input.value;
        var cnumber_arr = [];
        var cnumber_nospace = cnumber_input.value.replaceAll(" ", "");
        if (cnumber_nospace.length && cnumber_nospace.length % 4 === 0) {
            var cnumber_substr = cnumber_nospace.slice(startIndex, endIndex);
            if (/\d{4}/gi.test(cnumber_substr)) {
                startIndex += 4;
                endIndex += 4;
                if (endIndex < 19)
                    cnumber_input.value += " ";
            }
        }
        if (card_number_re.test(cnumber_input.value)) {
        }
    });
}
if (form) {
    form.querySelectorAll("input").forEach(function (field) {
        field.addEventListener("blur", function (e) {
            var field_pair = getDomPairField(e.target);
            if (field_pair instanceof HTMLElement) {
                if (e.target instanceof HTMLInputElement && e.target.value.length) {
                    field_pair.textContent = e.target.value;
                }
                else {
                    field_pair.textContent = field_pair.dataset.placeholder;
                }
            }
        });
    });
    form.addEventListener("submit", function (e) {
        e.preventDefault();
        var formValid = true;
        var fields = form.querySelectorAll("input");
        fields.forEach(function (field) {
            var fieldValid = valditateField(field);
            if (!fieldValid) {
                formValid = false;
            }
        });
        if (formValid) {
            console.log("Submitting...");
            if (form_section)
                form_section.style.display = "none";
            if (complete_section)
                complete_section.style.display = "grid";
        }
        else {
            var invalid_item = form.querySelector(":invalid");
            if (invalid_item)
                invalid_item.focus();
            console.log("Error");
        }
    });
}
