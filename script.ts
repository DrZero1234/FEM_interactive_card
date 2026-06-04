const form = document.querySelector("form");
const complete_section: HTMLElement | null =
  document.querySelector(".complete--section");
const form_section: HTMLElement | null =
  document.querySelector(".form--section");

const cvc_dom = document.getElementById("cvc_dom");
const cvc = document.getElementById("cvc");

const month: HTMLElement | null = document.querySelector('[name="exp_month"]');
const year: HTMLElement | null = document.querySelector('[name="exp_year"]');

const cnumber_input = document.getElementById(
  "cnumber",
) as HTMLInputElement | null;

const card_number_re = /\d{4}\s\d{4}\s\d{4}\s\d{4}/;

let startIndex = 0;
let endIndex = 4;

form?.setAttribute("novalidate", "");

function getDomPairField(field: HTMLInputElement) {
  let field_pair;
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
  return field_pair as HTMLElement | null;
}

function autoCorrectNums(field: HTMLInputElement | EventTarget) {
  if (field instanceof HTMLInputElement) {
    if (+field.value < 10 && field.value.length === 1) {
      field.value = "0" + field.value;
    }
  }
}

function valditateField(field: HTMLInputElement) {
  const errorEl: HTMLElement | null | undefined =
    field.parentElement?.querySelector(".error-text");
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
      const re = /\d{3}/;
      if (!re.test(field.value)) {
        errorEl.textContent = "The value must be 3 digit number";
        return false;
      }
    }

    errorEl.textContent = "";
  }
  return true;
}

form?.querySelectorAll("input").forEach((input) => {
  input.addEventListener("blur", () => {
    valditateField(input);
  });
});

[month, year].forEach((field) => {
  field?.addEventListener("blur", (e) => {
    if (e.target) autoCorrectNums(e.target);
  });
});

if (cnumber_input) {
  cnumber_input.addEventListener("input", (e) => {
    let cnumber_value = cnumber_input.value;
    let cnumber_arr = [];

    const cnumber_nospace = cnumber_input.value.replaceAll(" ", "");

    if (cnumber_nospace.length && cnumber_nospace.length % 4 === 0) {
      const cnumber_substr = cnumber_nospace.slice(startIndex, endIndex);
      if (/\d{4}/gi.test(cnumber_substr)) {
        startIndex += 4;
        endIndex += 4;
        if (endIndex < 19) cnumber_input.value += " ";
      }
    }

    if (card_number_re.test(cnumber_input.value)) {
    }
  });
}

if (form) {
  form.querySelectorAll("input").forEach((field) => {
    field.addEventListener("blur", (e) => {
      const field_pair = getDomPairField(e.target as HTMLInputElement);
      if (field_pair instanceof HTMLElement) {
        if (e.target instanceof HTMLInputElement && e.target.value.length) {
          field_pair.textContent = e.target.value;
        } else {
          field_pair.textContent = field_pair.dataset.placeholder as string;
        }
      }
    });
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    let formValid = true;

    const fields = form.querySelectorAll("input");

    fields.forEach((field) => {
      const fieldValid = valditateField(field);
      if (!fieldValid) {
        formValid = false;
      }
    });

    if (formValid) {
      console.log("Submitting...");
      if (form_section) form_section.style.display = "none";
      if (complete_section) complete_section.style.display = "grid";
    } else {
      const invalid_item: HTMLElement | null = form.querySelector(":invalid");
      if (invalid_item) invalid_item.focus();
      console.log("Error");
    }
  });
}
