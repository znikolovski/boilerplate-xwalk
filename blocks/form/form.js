function constructPayload(form) {
  const payload = {};
  [...form.elements].forEach((fe) => {
    if (fe.type !== "fieldset" && fe.name) {
      if (fe.type === "radio") {
        if (fe.checked) payload[fe.name] = fe.value;
      } else if (fe.type === "checkbox") {
        if (fe.checked)
          payload[fe.name] = payload[fe.name]
            ? `${payload[fe.name]},${fe.value}`
            : fe.value;
      } else {
        payload[fe.name] = fe.value;
      }
    }
  });
  return payload;
}

async function submitForm(form) {
  const payload = constructPayload(form);
  const resp = await fetch(form.dataset.action, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ data: payload }),
  });
  await resp.text();

  return payload;
}

async function handleSubmit(form, redirectTo) {
  if (form.getAttribute("data-submitting") !== "true") {
    form.setAttribute("data-submitting", "true");
    await submitForm(form);
    window.location.href = redirectTo || "/forms/thankyou";
  }
}

function setPlaceholder(element, fd) {
  if (fd.Placeholder) {
    element.setAttribute("placeholder", fd.Placeholder);
  }
}

function setNumberConstraints(element, fd) {
  if (fd.Max) {
    element.max = fd.Max;
  }
  if (fd.Min) {
    element.min = fd.Min;
  }
  if (fd.Step) {
    element.step = fd.Step || 1;
  }
}
function createLabel(fd, tagName = "label") {
  const label = document.createElement(tagName);
  label.setAttribute("for", fd.Id);
  label.className = "field-label";
  updateLabelElement(label, fd);
  if (fd.Mandatory && fd.Mandatory.toLowerCase() === "true") {
    createRequiredTextSpan(label);    
  }
  return label;
}

function createRequiredTextSpan(label) {
  const requiredTextSpan = document.createElement("span");
  requiredTextSpan.className = "required-text";
  requiredTextSpan.textContent = "  *";
  label.append(requiredTextSpan);
}


function removeRequiredTextSpan(label) {
  const requiredTextSpan = label.querySelector(".required-text");
  if (requiredTextSpan) {
    label.removeChild(requiredTextSpan);
  }
}

function updateLabelElement(label, fd) {
  label.textContent = fd.Label || "";
  label.setAttribute('itemprop', 'Label');
  label.setAttribute('itemtype', 'text');
  if (fd.Tooltip) {
    label.title = fd.Tooltip;
  }
}

function createOrUpdateLabel(fieldWrapper, fd) {
  const label = fieldWrapper.querySelector(".field-label");
  if (label) {
    updateLabelElement(label, fd);
    if (fd.Mandatory && String(fd.Mandatory).toLowerCase() === "true") {
      createRequiredTextSpan(label);
    } else {
      removeRequiredTextSpan(label);
    }
  } else {
    fieldWrapper.append(createLabel(fd));
  }
}

function createHelpText(fd) {
  const div = document.createElement("div");
  div.className = "field-description";
  updateHelpTextElement(div, fd);
  return div;
}

function updateHelpText(fieldWrapper, fd) {
  const div = fieldWrapper.querySelector(".field-description");
  updateHelpTextElement(div, fd);
}

function updateHelpTextElement(div, fd) {
  div.setAttribute("aria-live", "polite");
  div.setAttribute('itemtype', 'text');
  div.setAttribute('itemprop', 'Description');
  div.innerText = fd.Description;
  div.id = `${fd.Id}-description`;
}

function createFieldWrapper(fd, tagName = "div") {
  const fieldWrapper = document.createElement(tagName);
  fieldWrapper.classList.add("field-wrapper");
  updateFieldWrapper(fieldWrapper, fd);
  return fieldWrapper;
}

function updateFieldWrapper(fieldWrapper, fd) {
  fieldWrapper.setAttribute('itemtype', 'component');
  fieldWrapper.setAttribute('itemid', generateItemId(fd.Id));
  fieldWrapper.setAttribute('itemscope', '');
  fieldWrapper.setAttribute('data-editor-itemlabel', fd.Label || fd.Name);
  fieldWrapper.setAttribute('data-editor-itemmodel', fd.Type);
  const nameStyle = fd.Name ? ` form-${fd.Name}` : "";
  const fieldId = `form-${fd.Type}-wrapper${nameStyle}`;
  fieldWrapper.className = fieldId;
  fieldWrapper.dataset.fieldset = fd.Fieldset ? fd.Fieldset : "";
  createOrUpdateLabel(fieldWrapper, fd);
}

function createButton(fd) {
  const wrapper = createFieldWrapper(fd);
  const button = document.createElement("button");
  button.classList.add("button");
  wrapper.replaceChildren(button);
  updateButton(wrapper, fd);
  return wrapper;
}

function updateButton(wrapper, fd) {
  const button = wrapper.querySelector('button');
  button.textContent = fd.Label;
  button.type = fd.Type;
  button.dataset.redirect = fd.Extra || "";
  button.id = fd.Id;
  button.name = fd.Name;
}

function createInput(fd) {
  const input = document.createElement("input");
  updateInputElement(input, fd);
  return input;
}

function updateInputElement(input, fd) {
  input.type = fd.Type;
  setPlaceholder(input, fd);
  setNumberConstraints(input, fd);
}

function updateInput(fieldWrapper, fd) {
  const input = fieldWrapper.querySelector('input');
  updateInputElement(input, fd);
}

const withFieldWrapper = (element) => (fd) => {
  const wrapper = createFieldWrapper(fd);
  wrapper.append(element(fd));
  return wrapper;
};

const createTextArea = withFieldWrapper((fd) => {
  const input = document.createElement("textarea");
  setPlaceholder(input, fd);
  return input;
});

const updateTextArea = function(wrapper, fd) {
  const input = wrapper.querySelector('textarea');
  setPlaceholder(input, fd);
  return input;
};

const createSelect = withFieldWrapper((fd) => {
  const select = document.createElement("select");
  if (fd.Placeholder) {
    const ph = document.createElement("option");
    ph.textContent = fd.Placeholder;
    ph.setAttribute("disabled", "");
    ph.setAttribute("selected", "");
    select.append(ph);
  }
  fd.Options.split(",").forEach((o) => {
    const option = document.createElement("option");
    option.textContent = o.trim();
    option.value = o.trim();
    select.append(option);
  });
  select.selectedIndex = 0;
  return select;
});

const updateSelect = function(fieldWrapper, fd) {
  console.log('updateSelect no-op');
}

function createRadio(fd) {
  const wrapper = createFieldWrapper(fd);
  wrapper.insertAdjacentElement("afterbegin", createInput(fd));
  return wrapper;
}

function updateRadio(wrapper, fd) {
  const input = wrapper.querySelector('input');
  updateInputElement(input, fd);
}

const createOutput = withFieldWrapper((fd) => {
  const output = document.createElement("output");
  updateOutputElement(output, fd);
  return output;
});

const updateOutput = function(fieldWrapper, fd) {
  const output = fieldWrapper.querySelector('output');
  updateOutputElement(output, fd);
};

const updateOutputElement = function(output, fd) {
  output.name = fd.Name;
  output.dataset.fieldset = fd.Fieldset ? fd.Fieldset : "";
  output.innerText = fd.Value;
};

function createHidden(fd) {
  const input = document.createElement("input");
  updateHidden(input, fd);
  return input;
}

function updateHidden(input, fd) {
  input.type = "hidden";
  input.id = fd.Id;
  input.name = fd.Name;
  input.value = fd.Value;
}

function createLegend(fd) {
  return createLabel(fd, "legend");
}

function createFieldSet(fd) {
  const wrapper = createFieldWrapper(fd, "fieldset");
  updateFieldSet(wrapper, fd);
  //   wrapper.replaceChildren(createLegend(fd));
  return wrapper;
}

function updateFieldSet(wrapper, fd) {
  wrapper.setAttribute('itemtype', 'container');
  wrapper.setAttribute('data-editor-behavior', 'component');
  wrapper.name = fd.Name;
}

function groupFieldsByFieldSet(form) {
  const fieldsets = form.querySelectorAll("fieldset");
  fieldsets?.forEach((fieldset) => {
    const fields = form.querySelectorAll(`[data-fieldset="${fieldset.name}"`);
    fields?.forEach((field) => {
      fieldset.append(field);
    });
    if (fieldset.getAttribute("required") !== null) {
      fieldset.append(createErrorText(fieldset));
    }
  });
}

function createPlainText(fd) {
  const paragraph = document.createElement("p");
  updatePlainText(paragraph, fd);
  return paragraph;
}

function updatePlainText(paragraph, fd) {
  const nameStyle = fd.Name ? `form-${fd.Name}` : "";
  paragraph.className = nameStyle;
  paragraph.dataset.fieldset = fd.Fieldset ? fd.Fieldset : "";
  paragraph.textContent = fd.Label;
}

const getId = (function getId() {
  const ids = {};
  return (name) => {
    ids[name] = ids[name] || 0;
    const idSuffix = ids[name] ? `-${ids[name]}` : "";
    ids[name] += 1;
    return `${name}${idSuffix}`;
  };
})();

const fieldRenderers = {
  radio: createRadio,
  checkbox: createRadio,
  submit: createButton,
  textarea: createTextArea,
  select: createSelect,
  button: createButton,
  output: createOutput,
  hidden: createHidden,
  fieldset: createFieldSet,
  plaintext: createPlainText,
};

const fieldUpdaters = {
  radio: updateRadio,
  checkbox: updateRadio,
  submit: updateButton,
  textarea: updateTextArea,
  select: updateSelect,
  button: updateButton,
  output: updateOutput,
  hidden: updateHidden,
  fieldset: updateFieldSet,
  plaintext: updatePlainText,
};

function renderField(fd) {
  const renderer = fieldRenderers[fd.Type.toLowerCase()];
  let field;
  if (typeof renderer === "function") {
    field = renderer(fd);
  } else {
    field = createFieldWrapper(fd);
    field.append(createInput(fd));
  }
  if (fd.Description) {
    field.append(createHelpText(fd));
  }
  return field;
}


function updateField(fieldWrapper, fd) {
  const updater = fieldUpdaters[fd.Type.toLowerCase()];
  if (typeof updater === "function") {
    updater(fieldWrapper, fd);
  } else {
    updateFieldWrapper(fieldWrapper, fd);
    updateInput(fieldWrapper, fd);
  }
  if (fd.Description) {
    updateHelpText(fieldWrapper, fd);
  }
  const input = fieldWrapper.querySelector("input,textarea,select");
  if (fd.Type === "submit") {
    updateErrorText(fieldWrapper, content);
  }
  if (fd.Mandatory && String(fd.Mandatory).toLowerCase() === "true") {
    if (input !== null) {
      input.setAttribute("required", "required");
      updateErrorText(fieldWrapper, fd);
    } else {
      fieldWrapper.setAttribute("required", "required");
    }
  } else {
    if (input !== null) {
      input.removeAttribute('required');
      removeErrorText(fieldWrapper);
    } else {
      fieldWrapper.removeAttribute('required');
    }
  }
}

function createErrorText(fd) {
  const div = document.createElement("div");
  div.className = "field-required-error";
  updateErrorTextElement(div, fd);
  return div;
}

function removeErrorText(fieldWrapper) {
  let div = fieldWrapper.querySelector(".field-required-error");
  if (div) {
    fieldWrapper.removeChild(div);
  }
}

function updateErrorText(fieldWrapper, fd) {
  let div = fieldWrapper.querySelector(".field-required-error");
  if (!div) {
    div = document.createElement("div");
    div.className = "field-required-error";
  }
  updateErrorTextElement(div, fd);
}

function updateErrorTextElement(div, fd) {
  div.innerText =
    fd.Type === "submit"
      ? "Fill the required fields"
      : "This field is required";
  div.id = `${fd.Id}-error-text`;
}

async function fetchData(url) {
  const resp = await fetch(url);
  const json = await resp.json();
  window.formId = json.Id;
  return json.data.map((fd) => ({
    ...fd,
    Id: fd.Id || getId(fd.Name),
    Value: fd.Value || "",
  }));
}

async function fetchForm(pathname) {
  // get the main form
  const jsonData = await fetchData(pathname);
  return jsonData;
}

async function createForm(formURL) {
  const { pathname } = new URL(formURL);
  window.formPath = pathname;
  const data = await fetchForm(pathname);
  const form = document.createElement("form");
  form.noValidate = true;
  form.setAttribute('itemid', generateItemId(window.formId));
  form.setAttribute('itemtype', 'container');
  form.setAttribute('itemscope', '');
  form.setAttribute('data-editor-itemlabel', "Form Container");
  form.setAttribute('data-editor-itemmodel', "form");
  data.forEach((fd) => {
    const el = renderField(fd);
    const input = el.querySelector("input,textarea,select");
    if (fd.Type === "submit") {
      el.append(createErrorText(fd));
    }
    if (fd.Mandatory && fd.Mandatory.toLowerCase() === "true") {
      if (input !== null) {
        input.setAttribute("required", "required");
        el.append(createErrorText(fd));
      } else {
        el.setAttribute("required", "required");
      }
    }
    if (input) {
      input.id = fd.Id;
      input.name = fd.Name;
      input.value = fd.Value;
      if (fd.Description) {
        input.setAttribute("aria-describedby", `${fd.Id}-description`);
      }
    }
    form.append(el);
  });
  groupFieldsByFieldSet(form);
  // eslint-disable-next-line prefer-destructuring
  form.dataset.action = pathname.split(".json")[0];
  form.addEventListener("submit", (event) =>
    formsubmissionHandler(form, event)
  );
  return form;
}

function formsubmissionHandler(form, e) {
  e.preventDefault();
  if (validateFormElements(form)) {
    e.submitter.setAttribute("disabled", "");
    handleSubmit(form, e.submitter.dataset?.redirect);
  } else {
    const submitField = document.querySelector("button[type=submit]");
    submitField.parentElement.lastElementChild.style.display = "block";
    setTimeout(() => {
      document
        .querySelectorAll(".field-required-error")
        .forEach((errorElement) => {
          errorElement.style.display = "none";
        });
    }, 5000);
  }
}

function validateFormElements(form) {
  let validate = true;
  [...form.elements].forEach((fe) => {
    let isRequired = fe.getAttribute("required") === "required";
    if (isRequired) {
      if (fe.type === "fieldset") {
        let inputElements = fe.querySelectorAll("input");
        let isEmp = true;
        for (let ele of inputElements) {
          if (ele.checked === true) {
            isEmp = false;
            break;
          }
        }
        if (isEmp) {
          fe.lastElementChild.style.display = "block";
          validate = false;
        }
      } else if (fe.value.trim() === "") {
        fe.parentElement.lastElementChild.style.display = "block";
        validate = false;
      }
    }
  });

  return validate;
}

function topFormExpressBox() {
  const formExpressBoxDiv = document.createElement("div");
  formExpressBoxDiv.className = "neeraj";
  return formExpressBoxDiv;
}

function generateItemId(id) {
  if (id) {
    return `urn:aemconnection:${id}`;
  } else {
    return `urn:aemconnection`;
  }
}

export default async function decorate(block) {
  const formLink = block.querySelector('a[href$=".json"]');
  if (formLink) {
    const form = await createForm(formLink.href);
    formLink.replaceWith(form);
  }
}