document.addEventListener("DOMContentLoaded", function () {
    const sections = {
        hero: document.querySelector(".first-fold"),
        form: document.querySelector(".form-section"),
        progress: document.querySelector(".progress-section"),
        final: document.querySelector(".final-section"),
        logos: document.querySelector(".logos")
    };

    const buttons = {
        cta: document.querySelectorAll(".buttons a"),
        next: document.getElementById("nextBtn"),
        prev: document.getElementById("prevBtn")
    };

    const pageIndicator = document.getElementById("pageIndicator");
    const progressBar = document.getElementById("progress");
    const formSteps = document.querySelectorAll(".form-step");

    let currentStep = 0;

    sections.form.style.display = "none";
    sections.progress.style.display = "none";
    sections.final.style.display = "none";

    buttons.cta.forEach(button => {
        button.addEventListener("click", () => {
            sections.hero.style.display = "none";
            sections.form.style.display = "flex";
        });
    });

    const toggleLogos = () => {
        sections.logos.style.display = (sections.form.style.display === "flex" ||
            sections.progress.style.display === "flex" ||
            sections.final.style.display === "flex") ? "none" : "flex";
    };

    new MutationObserver(toggleLogos).observe(document.body, { attributes: true, subtree: true, attributeFilter: ["style"] });

    const updateForm = () => {
        formSteps.forEach((step, index) => {
            step.style.display = index === currentStep ? "block" : "none";
        });

        progressBar.style.width = `${(currentStep + 1) * 20}%`;
        pageIndicator.textContent = `${currentStep + 1}/5`;

        buttons.prev.style.display = currentStep === 0 ? "none" : "inline-block";
        buttons.next.textContent = currentStep === formSteps.length - 1 ? "Submit" : "→";
    };

    const validateStep = () => {
        return Array.from(formSteps[currentStep].querySelectorAll("input[type='radio']")).some(input => input.checked);
    };

    const showAlert = (message) => {
        if (!document.querySelector(".error-message")) {
            const alertBox = document.createElement("div");
            alertBox.className = "error-message";
            alertBox.innerText = message;
            document.querySelector(".form-container").appendChild(alertBox);
        }
    };

    const removeAlert = () => {
        const existingAlert = document.querySelector(".error-message");
        if (existingAlert) existingAlert.remove();
    };

    buttons.next.addEventListener("click", () => {
        if (!validateStep()) {
            showAlert("Please select an option before proceeding.");
            return;
        }

        removeAlert();

        if (currentStep < formSteps.length - 1) {
            currentStep++;
            updateForm();
        } else {
            sections.form.style.display = "none";
            sections.progress.style.display = "flex";

            let progressValue = 0;
            const progressInterval = setInterval(() => {
                progressValue += 5;
                document.querySelector(".progress-circle .percentage").innerText = `${progressValue}%`;
                document.querySelector(".progress-circle").style.background = `conic-gradient(#89cff0 0% ${progressValue}%, #e0e0e0 ${progressValue}% 100%)`;

                if (progressValue >= 100) {
                    clearInterval(progressInterval);
                    setTimeout(() => {
                        sections.progress.style.display = "none";
                        sections.final.style.display = "flex";
                    }, 1000);
                }
            }, 200);
        }
    });

    buttons.prev.addEventListener("click", () => {
        if (currentStep > 0) {
            currentStep--;
            updateForm();
        }
    });

    updateForm();
});