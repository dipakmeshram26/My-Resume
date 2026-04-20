var home = document.querySelector(".home");
var dot = document.querySelector(".dot");

if (home && dot) {
    var rafId = null;

    home.addEventListener("mousemove", function (event) {
        if (rafId) {
            return;
        }

        rafId = requestAnimationFrame(function () {
            dot.style.left = event.clientX + "px";
            dot.style.top = event.clientY + "px";
            rafId = null;
        });
    }, { passive: true });
}

var contactForm = document.getElementById("contact-form");
var submitBtn = document.getElementById("contact-submit-btn");
var formStatus = document.getElementById("form-status");

var EMAILJS_PUBLIC_KEY = "lx9wGx3f2rTCa8rty";
var EMAILJS_SERVICE_ID = "service_zzy8s2d";
var EMAILJS_TEMPLATE_ID = "template_x0yu2yw";

if (window.emailjs && EMAILJS_PUBLIC_KEY) {
    window.emailjs.init(EMAILJS_PUBLIC_KEY);
}

function setFormStatus(message, type) {
    if (!formStatus) {
        return;
    }

    formStatus.textContent = message;
    formStatus.classList.remove("success", "error");

    if (type) {
        formStatus.classList.add(type);
    }
}

function validateContactForm(name, email, message) {
    if (!name || name.length < 2) {
        return "Please enter your name.";
    }

    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        return "Please enter a valid email address.";
    }

    if (!message || message.length < 10) {
        return "Please enter at least 10 characters in message.";
    }

    return "";
}

if (contactForm && submitBtn && formStatus) {
    contactForm.addEventListener("submit", function (event) {
        event.preventDefault();

        var formData = new FormData(contactForm);
        var honeypot = String(formData.get("company_website") || "").trim();

        if (honeypot) {
            setFormStatus("Request blocked.", "error");
            return;
        }

        var name = String(formData.get("name") || "").trim();
        var email = String(formData.get("email") || "").trim();
        var message = String(formData.get("message") || "").trim();

        var validationError = validateContactForm(name, email, message);
        if (validationError) {
            setFormStatus(validationError, "error");
            return;
        }

        if (
            EMAILJS_PUBLIC_KEY === "YOUR_EMAILJS_PUBLIC_KEY" ||
            EMAILJS_SERVICE_ID === "YOUR_EMAILJS_SERVICE_ID" ||
            EMAILJS_TEMPLATE_ID === "YOUR_EMAILJS_TEMPLATE_ID"
        ) {
            setFormStatus("EmailJS IDs are missing. Add them in script.js first.", "error");
            return;
        }

        if (!window.emailjs) {
            setFormStatus("Email service not loaded. Please refresh and try again.", "error");
            return;
        }

        submitBtn.disabled = true;
        submitBtn.textContent = "Sending...";
        setFormStatus("Sending your message...", "");

        window.emailjs
            .send(
                EMAILJS_SERVICE_ID,
                EMAILJS_TEMPLATE_ID,
                {
                    from_name: name,
                    reply_to: email,
                    from_email: email,
                    message: message,
                    to_name: "Dipak"
                }
            )
            .then(function () {
                setFormStatus("Message sent successfully. I will get back to you soon.", "success");
                contactForm.reset();
            })
            .catch(function (error) {
                console.error("EmailJS send failed:", error);
                setFormStatus("Failed to send message. Please try again.", "error");
            })
            .finally(function () {
                submitBtn.disabled = false;
                submitBtn.textContent = "Submit";
            });
    });
}