const careerForm = document.getElementById("careerForm");
careerForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const submitBtn = careerForm.querySelector("button[type='submit']");
    submitBtn.disabled = true;
    submitBtn.textContent = "Submitting...";
    const formData = new FormData(careerForm);
    try {
        const response = await fetch("http://localhost:5000/api/career", {
            method: "POST",
            body: formData
        });
        const data = await response.json();
        if (data.success) {
            Swal.fire({
                icon: "success",
                title: "Application Submitted!",
                text: "Your application has been sent successfully.",
                confirmButtonText: "Send on WhatsApp"
            }).then(() => {
                const msg =
                    `*New Tutor Application*
                    👤 Name: ${formData.get("fullName")}
                    📧 Email: ${formData.get("email")}
                    📞 Phone: ${formData.get("phone")}
                    🎓 Qualification: ${formData.get("qualification")}
                    📚 Subjects: ${formData.get("subjects")}
                    📍 Address: ${formData.get("address")}
                    📝 Message:
                    ${formData.get("message")}`;
                window.open(
                    `https://wa.me/919962588807?text=${encodeURIComponent(msg)}`,
                    "_blank"
                );
                careerForm.reset();
            });
        } else {
            Swal.fire(
                "Error",
                data.message,
                "error"
            );
        }
    } catch (err) {
        console.error(err);
        Swal.fire(
            "Error",
            "Something went wrong.",
            "error"
        );
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = "Submit Application";
    }
});