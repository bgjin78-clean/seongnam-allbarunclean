(function () {
  const EMAILJS_PUBLIC_KEY = "JKsVOKPtnWHIr2BCV";
  const EMAILJS_SERVICE_ID = "allbarunclean";
  const EMAILJS_TEMPLATE_ID = "template_b4ox5js";

  function initContactForm() {
    const form = document.getElementById("contactForm");
    if (!form || typeof emailjs === "undefined") return;

    emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const privacyCheck = document.getElementById("privacyCheck");
      if (!privacyCheck || !privacyCheck.checked) {
        alert("개인정보 수집 및 이용 동의가 필요합니다.");
        return;
      }

      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = "전송 중...";

      const fd = new FormData(form);
      const templateParams = {
        name: fd.get("name") || fd.get("from_name") || "",
        phone: fd.get("phone") || "",
        region: fd.get("region") || "",
        service: fd.get("service") || "",
        message: fd.get("message") || "",
      };

      emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
        .then(function () {
          alert("상담 신청이 완료되었습니다. 확인 후 연락드리겠습니다.");
          form.reset();
        })
        .catch(function (err) {
          console.error("EmailJS error:", err);
          alert("전송에 실패했습니다. 전화 상담(010-4393-2414)을 이용해 주세요.");
        })
        .finally(function () {
          submitBtn.disabled = false;
          submitBtn.textContent = originalText;
        });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initContactForm);
  } else {
    initContactForm();
  }
})();
