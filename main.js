(function () {
  "use strict";

  var ENDPOINT = "https://formsubmit.co/ajax/hello@raelix.in";
  var EMAIL = "hello@raelix.in";

  var form = document.getElementById("enquiry-form");
  if (!form) return;

  var statusEl = document.getElementById("form-status");
  var button = document.getElementById("submit-btn");
  var openedAt = Date.now();

  function setStatus(kind, html) {
    statusEl.className = "form-status " + (kind ? "is-" + kind : "");
    statusEl.innerHTML = html;
  }

  function clean(value) {
    return String(value || "").trim();
  }

  function mailtoLink(data) {
    var lines = [
      "Name: " + data.name,
      "Email: " + data.email,
      data.phone ? "Phone: " + data.phone : "",
      data.company ? "Company: " + data.company : "",
      "Need: " + data.need,
      data.budget ? "Budget: " + data.budget : "",
      "",
      data.message
    ].filter(function (l, i) { return l !== "" || i > 5; });
    return "mailto:" + EMAIL +
      "?subject=" + encodeURIComponent("Enquiry from raelix.in") +
      "&body=" + encodeURIComponent(lines.join("\n"));
  }

  function validate(data) {
    var problems = [];
    var fields = {
      name: data.name,
      email: data.email,
      need: data.need,
      message: data.message
    };
    Object.keys(fields).forEach(function (key) {
      var el = form.elements[key];
      var bad = !fields[key];
      if (key === "email" && fields[key]) {
        bad = !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(fields[key]);
      }
      if (bad) {
        el.setAttribute("aria-invalid", "true");
        problems.push(el);
      } else {
        el.removeAttribute("aria-invalid");
      }
    });
    return problems;
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    var data = {
      name: clean(form.elements.name.value),
      email: clean(form.elements.email.value),
      phone: clean(form.elements.phone.value),
      company: clean(form.elements.company.value),
      need: clean(form.elements.need.value),
      budget: clean(form.elements.budget.value),
      message: clean(form.elements.message.value)
    };

    var problems = validate(data);
    if (problems.length) {
      setStatus("error", "Please fill in your name, a valid email, what you need, and a few lines about the project.");
      problems[0].focus();
      return;
    }

    // Bots fill the hidden field or submit instantly. Pretend success, send nothing.
    if (clean(form.elements._honey.value) || Date.now() - openedAt < 2500) {
      setStatus("ok", "Thanks. Your enquiry has been sent.");
      form.reset();
      return;
    }

    button.disabled = true;
    button.textContent = "Sending";
    setStatus("", "");

    var payload = {
      name: data.name,
      email: data.email,
      phone: data.phone || "-",
      company: data.company || "-",
      need: data.need,
      budget: data.budget || "Prefer to discuss",
      message: data.message,
      _subject: "New enquiry from raelix.in: " + data.need,
      _template: "table",
      _honey: ""
    };

    fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify(payload)
    })
      .then(function (res) {
        return res.json().catch(function () { return {}; }).then(function (body) {
          return { ok: res.ok, body: body };
        });
      })
      .then(function (result) {
        var success = result.ok && (result.body.success === true || result.body.success === "true");
        if (!success) throw new Error("send failed");
        setStatus("ok", "Thanks, " + data.name.split(" ")[0] + ". Your enquiry has been sent. We will reply to " + data.email + ".");
        form.reset();
        openedAt = Date.now();
      })
      .catch(function () {
        setStatus("error",
          "We could not send that just now. Please <a href=\"" + mailtoLink(data) +
          "\">email your enquiry to " + EMAIL + "</a> and we will reply.");
      })
      .then(function () {
        button.disabled = false;
        button.textContent = "Send enquiry";
      });
  });
})();
