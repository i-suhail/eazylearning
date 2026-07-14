document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector(".nav-toggle");
  const menu = document.querySelector(".nav-menu");

  if (toggle && menu) {
    toggle.addEventListener("click", () => {
      const isOpen = menu.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(isOpen));
    });

    menu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        menu.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  const revealItems = document.querySelectorAll(".reveal");
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14 });

  revealItems.forEach((item) => revealObserver.observe(item));

  const counters = document.querySelectorAll(".counter");
  const runCounter = (counter) => {
    const target = Number(counter.dataset.target || "0");
    const duration = 1400;
    const startTime = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      counter.textContent = Math.floor(eased * target).toLocaleString("en-IN");

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        counter.textContent = target.toLocaleString("en-IN");
      }
    };

    requestAnimationFrame(tick);
  };

  const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        runCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.45 });

  counters.forEach((counter) => counterObserver.observe(counter));

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (event) => {
      const target = document.querySelector(anchor.getAttribute("href"));
      if (!target) return;

      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  // Active Navigation on Scroll
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-menu a[href^='#']");

  window.addEventListener("scroll", () => {

    let current = "";

    sections.forEach((section) => {

      const sectionTop = section.offsetTop - 100;
      const sectionHeight = section.offsetHeight;

      if (window.scrollY >= sectionTop &&
          window.scrollY < sectionTop + sectionHeight) {
        if (section.id === "about-subjects") {
          current = "about";
        } else if (section.id === "classSelector") {
         current = "curriculum";
        } else {
          current = section.id;
        }
      }

    });

    navLinks.forEach((link) => {

      link.classList.remove("active");

      if (link.getAttribute("href") === "#" + current) {

        link.classList.add("active");

      }

    });

    // Hero Section (Top)
    if (window.scrollY < 150) {

      navLinks.forEach(link => link.classList.remove("active"));

      document
        .querySelector('.nav-menu a[href="#top"]')
        ?.classList.add("active");

    }

  });

  document.querySelectorAll(".btn, .nav-cta").forEach((button) => {
    button.addEventListener("pointerdown", (event) => {
      const ripple = document.createElement("span");
      const rect = button.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);

      ripple.className = "button-ripple";
      ripple.style.width = `${size}px`;
      ripple.style.height = `${size}px`;
      ripple.style.left = `${event.clientX - rect.left - size / 2}px`;
      ripple.style.top = `${event.clientY - rect.top - size / 2}px`;

      button.appendChild(ripple);
      window.setTimeout(() => ripple.remove(), 650);
    });
  });
});

// Courses page curriculum selection
(function () {
  const selector = document.getElementById("classSelector");
  const grid = document.getElementById("classCardGrid");
  const title = document.getElementById("selectedCurriculumTitle");
  const curriculumCards = document.querySelectorAll(".curriculum-card");

  if (!selector || !grid || !title || curriculumCards.length === 0) return;

  const classDescriptions = {
    1: "Foundation support for early school learners.",
    2: "Gentle concept building with guided practice.",
    3: "Stronger basics across core school subjects.",
    4: "Regular practice for better classroom confidence.",
    5: "Upper-primary preparation with clear fundamentals.",
    6: "Middle-school concepts with structured revision.",
    7: "Deeper subject clarity and weekly practice.",
    8: "Pre-board foundation for higher classes.",
    9: "Board-oriented basics with chapter-wise practice.",
    10: "Exam-focused preparation and mock test support.",
    11: "Stream-specific academic excellence support.",
    12: "Board success coaching with revision planning."
  };

  const buildClassCards = (curriculum) => {
    grid.innerHTML = "";

    for (let classNumber = 1; classNumber <= 12; classNumber += 1) {
      const card = document.createElement("article");
      card.className = "class-card reveal is-visible";

      const params = new URLSearchParams({
        curriculum,
        class: `Class ${classNumber}`
      });

      card.innerHTML = `
        <strong>${classNumber}</strong>
        <h3>Class ${classNumber}</h3>
        <p>${classDescriptions[classNumber]}</p>
        <a class="btn" href="enrollment.html?${params.toString()}">Enroll Now</a>
      `;

      grid.appendChild(card);
    }
  };

  curriculumCards.forEach((card) => {
    const button = card.querySelector(".curriculum-btn");
    if (!button) return;

    button.addEventListener("click", () => {
      const curriculum = card.dataset.curriculum || "Selected Curriculum";

      curriculumCards.forEach((item) => item.classList.remove("is-selected"));
      card.classList.add("is-selected");

      title.textContent = `${curriculum} Classes`;
      buildClassCards(curriculum);
      selector.hidden = false;
      selector.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}());
// Enrollment page multi-step form
let requestType = "Enrollment";
(function () {
  const form = document.getElementById("enrollmentForm");
  if (!form) return;

  const steps = Array.from(form.querySelectorAll(".form-step"));
  const progress = Array.from(form.querySelectorAll(".progress-step"));
  const prev = document.getElementById("prevStep");
  const next = document.getElementById("nextStep");
  const submit = document.getElementById("submitEnrollment");
  const demoSubmit = document.getElementById("bookDemoEnrollment");
  if (submit) {
    submit.addEventListener("click", () => {
        requestType = "Enrollment";
    });
}

if (demoSubmit) {
    demoSubmit.addEventListener("click", () => {
        requestType = "Demo";
    });
}
  const confirmation = document.getElementById("confirmationBox");
  const params = new URLSearchParams(window.location.search);
  let activeStep = 1;

  const fields = {
    class: document.getElementById("enrollClass"),
    curriculum: document.getElementById("enrollCurriculum"),
    mode: document.getElementById("enrollLearningMode"),
    subjects: Array.from(form.querySelectorAll('[name="subjects"]'))
  };

  const summary = {
    class: document.getElementById("summaryClass"),
    curriculum: document.getElementById("summaryCurriculum"),
    mode: document.getElementById("summaryMode"),
    subjectCount: document.getElementById("summarySubjectCount"),
    subjects: document.getElementById("summarySubjects"),
  };

  const setSelectValue = (select, value) => {
    if (!select || !value) return;
    const match = Array.from(select.options).find((option) => option.value === value || option.text === value);
    if (match) select.value = match.value;
  };

  setSelectValue(fields.curriculum, params.get("curriculum"));
  setSelectValue(fields.class, params.get("class"));
  setSelectValue(fields.mode, params.get("learningMode"));

  const selectedSubjects = () => fields.subjects.filter((subject) => subject.checked);

  const syncSubjectValidity = () => {
    if (fields.subjects.length === 0) return true;
    const hasSubject = selectedSubjects().length > 0;
    fields.subjects[0].setCustomValidity(hasSubject ? "" : "Please select at least one subject.");
    return hasSubject;
  };

  const updateSummary = () => {
    summary.class.textContent = fields.class.value || "Not selected";
    summary.curriculum.textContent = fields.curriculum.value || "Not selected";
    summary.mode.textContent = fields.mode.value || "Not selected";

    const checked = selectedSubjects();
    summary.subjectCount.textContent = checked.length;

    if (checked.length === 0) {
      summary.subjects.innerHTML = "<span>No subjects selected</span>";
    } else {
      summary.subjects.innerHTML = checked
        .map(subject => `<div><span>${subject.value}</span></div>`)
        .join("");
    }
  };

  const controlsForStep = (stepNumber) => {
    const step = steps.find((item) => Number(item.dataset.step) === stepNumber);
    if (!step) return [];
    return Array.from(step.querySelectorAll("input, select, textarea"));
  };

  const validateStep = (stepNumber) => {
    if (stepNumber === 3) syncSubjectValidity();

    const controls = controlsForStep(stepNumber);
    const invalid = controls.find((control) => !control.checkValidity());

    if (invalid) {
      invalid.reportValidity();
      return false;
    }

    return true;
  };

  const validateThroughStep = (targetStep) => {
    for (let stepNumber = 1; stepNumber < targetStep; stepNumber += 1) {
      if (!validateStep(stepNumber)) {
        showStep(stepNumber, false);
        return false;
      }
    }
    return true;
  };

  function showStep(stepNumber, shouldValidate = true) {
    const requestedStep = Math.min(Math.max(stepNumber, 1), steps.length);

    if (shouldValidate && requestedStep > activeStep && !validateThroughStep(requestedStep)) {
      updateSummary();
      return;
    }

    activeStep = requestedStep;

    steps.forEach((step) => {
      step.classList.toggle("is-active", Number(step.dataset.step) === activeStep);
    });

    progress.forEach((item) => {
      const stepTarget = Number(item.dataset.stepTarget);
      item.classList.toggle("is-active", stepTarget === activeStep);
      item.classList.toggle("is-complete", stepTarget < activeStep);
    });

    prev.hidden = activeStep === 1;
    next.hidden = activeStep === steps.length;
    submit.hidden = activeStep !== steps.length;
    if (demoSubmit) demoSubmit.hidden = activeStep !== steps.length;
    updateSummary();
  }

  progress.forEach((item) => {
    item.addEventListener("click", () => showStep(Number(item.dataset.stepTarget)));
  });

  prev.addEventListener("click", () => showStep(activeStep - 1, false));
  next.addEventListener("click", () => showStep(activeStep + 1));

  form.addEventListener("input", () => {
    syncSubjectValidity();
    updateSummary();
  });

  form.addEventListener("change", () => {
    syncSubjectValidity();
    updateSummary();
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!validateThroughStep(steps.length + 1)) return;

    confirmation.hidden = false;
    confirmation.scrollIntoView({ behavior: "smooth", block: "nearest" });
  });

  syncSubjectValidity();
  showStep(1, false);
  updateSummary();
}());

// Study Materials page filters and pagination
(function () {
  const grid = document.getElementById("materialsGrid");
  if (!grid) return;

  const materials = [
    ["Quadratic Equations - Complete Notes", "CBSE", "Class 10", "Mathematics", "Notes", 25, 2.4, "10 May 2024"],
    ["Linear Equations - Practice Worksheets", "CBSE", "Class 8", "Mathematics", "Worksheets", 18, 1.8, "09 May 2024"],
    ["Science Chapter 5 Question Bank", "CBSE", "Class 9", "Science", "Question Banks", 32, 3.1, "08 May 2024"],
    ["Class 10 Mathematics Sample Paper 2023-24", "CBSE", "Class 10", "Mathematics", "Sample Papers", 12, 1.2, "06 May 2024"],
    ["Photosynthesis - Revision Notes", "ICSE", "Class 7", "Science", "Revision Notes", 10, 1.1, "05 May 2024"],
    ["Maths Formula Sheet - Class 9", "CBSE", "Class 9", "Mathematics", "Formula Sheets", 6, 0.8, "04 May 2024"],
    ["The National Movement - Detailed Notes", "CBSE", "Class 8", "Social Science", "Notes", 20, 2.0, "03 May 2024"],
    ["English Grammar Question Bank", "CBSE", "Class 6", "English", "Question Banks", 15, 1.3, "02 May 2024"],
    ["Physics Motion Worksheet", "IGCSE", "Class 11", "Physics", "Worksheets", 14, 1.5, "28 Apr 2024"],
    ["Chemistry Bonding Notes", "ICSE", "Class 10", "Chemistry", "Notes", 22, 2.1, "26 Apr 2024"],
    ["International Maths Practice Set", "International", "Class 7", "Mathematics", "Worksheets", 16, 1.6, "24 Apr 2024"],
    ["State Board English Sample Paper", "State Board", "Class 12", "English", "Sample Papers", 18, 2.2, "21 Apr 2024"]
  ].map((item, index) => ({ id: index + 1, title: item[0], curriculum: item[1], className: item[2], subject: item[3], type: item[4], pages: item[5], size: item[6], updated: item[7] }));

  const search = document.getElementById("materialSearch");
  const searchBtn = document.getElementById("materialSearchBtn");
  const filters = {
    curriculum: document.getElementById("filterCurriculum"),
    className: document.getElementById("filterClass"),
    subject: document.getElementById("filterSubject"),
    type: document.getElementById("filterType"),
    sort: document.getElementById("materialSort")
  };
  const pills = document.getElementById("typePills");
  const count = document.getElementById("materialsCount");
  const pagination = document.getElementById("materialsPagination");
  const perPage = 8;
  let page = 1;

  const colors = {
    "Notes": "#2F6EEB",
    "Worksheets": "#43A047",
    "Question Banks": "#7E55D9",
    "Sample Papers": "#D98A22",
    "Revision Notes": "#D957B5",
    "Formula Sheets": "#1F9BA5"
  };

  const matches = (material) => {
    const query = search.value.trim().toLowerCase();
    return (!query || `${material.title} ${material.subject} ${material.curriculum}`.toLowerCase().includes(query)) &&
      (filters.curriculum.value === "all" || material.curriculum === filters.curriculum.value) &&
      (filters.className.value === "all" || material.className === filters.className.value) &&
      (filters.subject.value === "all" || material.subject === filters.subject.value) &&
      (filters.type.value === "all" || material.type === filters.type.value);
  };

  const sorted = (items) => {
    return [...items].sort((a, b) => {
      if (filters.sort.value === "title") return a.title.localeCompare(b.title);
      if (filters.sort.value === "pages") return b.pages - a.pages;
      if (filters.sort.value === "size") return b.size - a.size;
      return b.id - a.id;
    });
  };

  const render = () => {
    const filtered = sorted(materials.filter(matches));
    const pages = Math.max(1, Math.ceil(filtered.length / perPage));
    page = Math.min(page, pages);
    const visible = filtered.slice((page - 1) * perPage, page * perPage);

    count.textContent = `Showing ${filtered.length} Results`;
    grid.innerHTML = visible.map((material) => `
      <article class="material-card reveal is-visible">
        <span class="material-badge" style="background:${colors[material.type] || '#163A70'}">${material.type}</span>
        <div class="material-thumb">PDF</div>
        <h3>${material.title}</h3>
        <p>${material.curriculum} material for ${material.className} ${material.subject}.</p>
        <div class="material-meta"><span>${material.curriculum}</span><span>${material.className}</span><span>${material.subject}</span></div>
        <div class="material-stats"><span>${material.pages} Pages</span><span>${material.size.toFixed(1)} MB</span></div>
        <div class="material-updated">Updated: ${material.updated}</div>
        <div class="material-actions"><a class="btn preview-btn" href="#">Preview</a><a class="btn download-btn" href="#">Download</a></div>
      </article>
    `).join("") || '<p class="material-empty">No materials found.</p>';

    pagination.innerHTML = Array.from({ length: pages }, (_, index) => {
      const number = index + 1;
      return `<button type="button" class="${number === page ? 'is-active' : ''}" data-page="${number}">${number}</button>`;
    }).join("");
  };

  const resetAndRender = () => { page = 1; render(); };

  Object.values(filters).forEach((control) => control.addEventListener("change", resetAndRender));
  search.addEventListener("input", resetAndRender);
  searchBtn.addEventListener("click", resetAndRender);

  pills.addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (!button) return;
    pills.querySelectorAll("button").forEach((item) => item.classList.remove("is-active"));
    button.classList.add("is-active");
    filters.type.value = button.dataset.type;
    resetAndRender();
  });

  pagination.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-page]");
    if (!button) return;
    page = Number(button.dataset.page);
    render();
  });

  render();
}());

// Student dashboard announcement expander
(function () {
  const panel = document.getElementById("announcementsPanel");
  const button = document.getElementById("toggleAnnouncements");
  if (!panel || !button) return;

  button.addEventListener("click", () => {
    const expanded = panel.classList.toggle("is-expanded");
    button.textContent = expanded ? "Show Less" : "View All";
  });
}());

// Student portal mobile sidebar
(function () {
  const body = document.querySelector('.student-portal-body');
  const button = document.querySelector('.student-sidebar-toggle');
  const sidebar = document.querySelector('.student-portal-sidebar');
  if (!body || !button || !sidebar) return;

  const setOpen = (isOpen) => {
    body.classList.toggle('student-sidebar-open', isOpen);
    button.setAttribute('aria-expanded', String(isOpen));
  };

  button.addEventListener('click', () => {
    setOpen(!body.classList.contains('student-sidebar-open'));
  });

  sidebar.addEventListener('click', (event) => {
    if (event.target.closest('a')) setOpen(false);
  });

  document.addEventListener('click', (event) => {
    if (!body.classList.contains('student-sidebar-open')) return;
    if (event.target.closest('.student-portal-sidebar') || event.target.closest('.student-sidebar-toggle')) return;
    setOpen(false);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') setOpen(false);
  });
}());

// Admin panel mobile sidebar and modals
(function () {
  const body = document.querySelector('.admin-panel-body');
  const button = document.querySelector('.admin-sidebar-toggle');
  const sidebar = document.querySelector('.admin-panel-sidebar');

  if (body && button && sidebar) {
    const setOpen = (isOpen) => {
      body.classList.toggle('admin-sidebar-open', isOpen);
      button.setAttribute('aria-expanded', String(isOpen));
    };

    button.addEventListener('click', () => setOpen(!body.classList.contains('admin-sidebar-open')));
    sidebar.addEventListener('click', (event) => {
      if (event.target.closest('a')) setOpen(false);
    });
    document.addEventListener('click', (event) => {
      if (!body.classList.contains('admin-sidebar-open')) return;
      if (event.target.closest('.admin-panel-sidebar') || event.target.closest('.admin-sidebar-toggle')) return;
      setOpen(false);
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') setOpen(false);
    });
  }

  document.querySelectorAll('.admin-open-modal').forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const modal = document.getElementById(trigger.dataset.modal);
      if (modal) modal.hidden = false;
    });
  });

  document.querySelectorAll('.admin-modal').forEach((modal) => {
    modal.addEventListener('click', (event) => {
      if (event.target === modal || event.target.closest('.admin-modal-close')) modal.hidden = true;
    });
  });
}());

// Website management edit mode and signup Google mode
(function () {
  document.querySelectorAll('.website-edit-toggle').forEach((button) => {
    button.addEventListener('click', () => {
      const card = button.closest('.website-edit-card, .website-social-card');
      const form = card ? card.querySelector('[data-editable-form]') : null;
      if (!form) return;
      form.classList.add('is-editing');
      form.querySelectorAll('input, textarea').forEach((field) => field.removeAttribute('readonly'));
    });
  });

  document.querySelectorAll('.website-edit-actions .discard').forEach((button) => {
    button.addEventListener('click', () => {
      const form = button.closest('[data-editable-form]');
      if (!form) return;
      form.classList.remove('is-editing');
      form.querySelectorAll('input, textarea').forEach((field) => field.setAttribute('readonly', 'readonly'));
    });
  });

  document.querySelectorAll('.website-edit-actions .primary').forEach((button) => {
    button.addEventListener('click', () => {
      const form = button.closest('[data-editable-form]');
      if (!form) return;
      form.classList.remove('is-editing');
      form.querySelectorAll('input, textarea').forEach((field) => field.setAttribute('readonly', 'readonly'));
    });
  });

  const googleButton = document.querySelector('[data-google-signup]');
  const signupForm = document.querySelector('.signup-form');
  if (googleButton && signupForm) {
    googleButton.addEventListener('click', () => {
      signupForm.classList.add('is-google-mode');
      signupForm.querySelectorAll('[data-password-fields] input').forEach((input) => {
        input.required = false;
        input.value = '';
      });
      const submit = signupForm.querySelector('button[type="submit"]');
      if (submit) submit.textContent = 'Continue';
      googleButton.textContent = 'Google mode enabled';
    });
  }
}());

const form = document.getElementById("adminLoginForm");

if (form) {
    form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("adminEmail").value;
    const password = document.getElementById("adminPassword").value;
    const response = await fetch("http://localhost:5000/api/admin/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email,
            password
        })
    });
    const data = await response.json();
    if (data.success) {
      Swal.fire({
        icon: "success",
        title: "Welcome!",
        text: "Login Successful",
        timer: 1500,
        showConfirmButton: false
      }).then(() => {
        window.location.href = "manage-enrollments.html";
      });
    } else {
        Swal.fire({
    icon: "error",
    title: "Oops!",
    text: data.message
});
    }
  });
}
const enrollmentForm = document.getElementById("enrollmentForm");

if (enrollmentForm) {
  enrollmentForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const subjects = [...document.querySelectorAll('input[name="subjects"]:checked')]
    .map(subject => subject.value);
    const enrollmentData = {
      student_name: enrollmentForm.studentName.value,
      dob: enrollmentForm.dob.value,
      gender: enrollmentForm.gender.value,
      school_name: enrollmentForm.school_name.value,
      city: enrollmentForm.city.value,

      parent_name: enrollmentForm.parentName.value,
      relationship: enrollmentForm.relationship.value,
      mobile: enrollmentForm.mobile.value,
      whatsapp: enrollmentForm.whatsapp.value,
      email: enrollmentForm.email.value,

      class: enrollmentForm.class.value,
      curriculum: enrollmentForm.curriculum.value,
      learning_mode: enrollmentForm.learningMode.value,

      subjects: subjects,

      message: enrollmentForm.message.value,

      request_type: requestType
    };
    const response = await fetch("http://localhost:5000/api/enroll", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify(enrollmentData)
    });
    const data = await response.json();
    if (data.success) {
      Swal.fire({
      icon: "success",
      title: "Enrollment Submitted!",
      text: "Thank you. Our team will contact you soon.",
      confirmButtonColor: "#163A70"
    });
    } else {
      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: data.message
      });
    }
  });
}
const enrollmentTableBody = document.getElementById("enrollmentTableBody");
let allEnrollments = [];
if (enrollmentTableBody) {
  loadDashboardStats();
  loadEnrollments();
}

async function loadDashboardStats() {
    try {
        const response = await fetch("http://localhost:5000/api/dashboard/stats");
        const stats = await response.json();
        document.getElementById("totalEnrollments").textContent = stats.total;
        document.getElementById("pendingEnrollments").textContent = stats.pending;
        document.getElementById("approvedEnrollments").textContent = stats.approved;
        document.getElementById("demoEnrollments").textContent = stats.demo;
    } catch (err) {
        console.error(err);
    }
}

function renderEnrollments(enrollments) {
  enrollmentTableBody.innerHTML = "";
  enrollments.forEach((student, index) => {
    enrollmentTableBody.innerHTML += `
    <tr>
      <td>${index + 1}</td>
      <td>${student.student_name}</td>
      <td>${student.parent_name}</td>
      <td>${student.curriculum}</td>
      <td>${student.class}</td>
      <td>${Array.isArray(student.subjects) ? student.subjects.join(", ") : student.subjects}</td>
      <td>${student.learning_mode}</td>
      <td>${student.request_type || "Enrollment"}</td>
      <td>${student.mobile}</td>
      <td>${new Date(student.created_at).toLocaleDateString()}</td>
      <td>
        ${student.request_type === "Demo"
        ?
        `
        <select class="admin-status-select"
                data-id="${student.id}">
            <option ${student.status==="Pending"?"selected":""}>Pending</option>
            <option ${student.status==="Demo Scheduled"?"selected":""}>Demo Scheduled</option>
            <option ${student.status==="Rejected"?"selected":""}>Rejected</option>
        </select>
        `
        :
        `
        <select class="admin-status-select"
                data-id="${student.id}">
            <option ${student.status==="Pending"?"selected":""}>Pending</option>
            <option ${student.status==="Approved"?"selected":""}>Approved</option>
            <option ${student.status==="Rejected"?"selected":""}>Rejected</option>
        </select>
        `}
      </td>
      <td><button class="admin-icon-btn view viewEnrollmentBtn" data-id="${student.id}">👁</button></td>
      <td><button class="admin-icon-btn edit editEnrollmentBtn" data-id="${student.id}">✎</button></td>
      <td><button class="admin-icon-btn delete deleteEnrollmentBtn" data-id="${student.id}">⌫</button></td>
    </tr> `;
  });
}

async function loadEnrollments() {
  const loader = document.getElementById("tableLoader");
  loader.style.display = "flex";
  enrollmentTableBody.style.display = "none";
  try {
    const response = await fetch("http://localhost:5000/api/enrollments");
    const enrollments = await response.json();
    allEnrollments = enrollments;

    const pagination = document.getElementById("tablePagination");
    if (pagination) {
      pagination.style.display = enrollments.length > 15 ? "flex" : "none";
    }
    loader.style.display = "none";
    enrollmentTableBody.style.display = "";
    renderEnrollments(enrollments);
  } catch (error) {
    console.error(error);
  }
}
document.addEventListener("change", async (e) => {
  if (!e.target.classList.contains("admin-status-select")) return;
    const id = e.target.dataset.id;
    const status = e.target.value;
    const response = await fetch(`http://localhost:5000/api/enrollments/${id}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      status
  })
});

const data = await response.json();
  if (data.success) {
    Swal.fire({
      icon: "success",
      title: "Status Updated",
      toast: true,
      position: "top-end",
      timer: 1800,
      showConfirmButton: false
    });loadDashboardStats();
  } else {
    alert("Update Failed");
  }
});

let editingEnrollmentId = null;

document.addEventListener("click", async (e) => {
    if (!e.target.classList.contains("editEnrollmentBtn")) return;
    editingEnrollmentId = e.target.dataset.id;
    const response = await fetch(`http://localhost:5000/api/enrollments/${editingEnrollmentId}`);
    const student = await response.json();
    document.getElementById("editEmail").value = student.email || "";
    document.getElementById("editStudentName").value = student.student_name || "";
    document.getElementById("editDob").value = student.dob ? student.dob.split("T")[0] : "";
    document.getElementById("editGender").value = student.gender || "";
    document.getElementById("editSchool").value = student.school_name || "";
    document.getElementById("editParentName").value = student.parent_name || "";
    document.getElementById("editRelationship").value = student.relationship || "";
    document.getElementById("editMobile").value = student.mobile || "";
    document.getElementById("editWhatsapp").value = student.whatsapp || "";
    document.getElementById("editEmail").value = student.email || "";
    document.getElementById("editCity").value = student.city || "";
    document.getElementById("editClass").value = student.class || "";
    document.getElementById("editCurriculum").value = student.curriculum || "";
    document.getElementById("editLearningMode").value = student.learning_mode || "";
    document.getElementById("editStatus").value = student.status || "Pending";
    document.getElementById("editRequestType").value = student.request_type || "Enrollment";
    const statusSelect = document.getElementById("editStatus");
    if (student.request_type === "Demo") {
        statusSelect.innerHTML = `
            <option>Pending</option>
            <option>Demo Scheduled</option>
            <option>Rejected</option>
        `;
    } else {
        statusSelect.innerHTML = `
            <option>Pending</option>
            <option>Approved</option>
            <option>Rejected</option>
        `;
    }
    statusSelect.value = student.status;
    document.getElementById("editSubjects").value = Array.isArray(student.subjects) ? student.subjects.join(", ") : (student.subjects || "");
    document.getElementById("editMessage").value = student.message || "";
    document.getElementById("enrollmentEditModal").hidden = false;
});
document.addEventListener("click", async (e) => {
    if (!e.target.classList.contains("deleteEnrollmentBtn")) return;
    const result = await Swal.fire({
      title: "Delete Enrollment?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#163A70",
      confirmButtonText: "Delete"
    });
    if (!result.isConfirmed) return;
    const id = e.target.dataset.id;
    const response = await fetch(
        `http://localhost:5000/api/enrollments/${id}`,
        {
            method: "DELETE"
        }
    );
    const data = await response.json();
    if (data.success) {
      Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "Enrollment removed successfully.",
        timer: 1500,
        showConfirmButton: false
      });
      loadEnrollments();
    } else {
        Swal.fire({
    icon: "error",
    title: "Oops!",
    text: data.message
});
    }
});
document.addEventListener("click", async (e) => {
  if (!e.target.classList.contains("viewEnrollmentBtn")) return;
  const id = e.target.dataset.id;
  const response = await fetch(`http://localhost:5000/api/enrollments/${id}`);
  const student = await response.json();
  const content = document.getElementById("viewEnrollmentContent");
  content.innerHTML = `
    <div class="view-grid">
      <section class="view-card">
        <h3>👤 Student Information</h3>
        <div class="view-row"><span>Name</span><strong>${student.student_name}</strong></div>
        <div class="view-row"><span>DOB</span><strong>${student.dob ? student.dob.split("T")[0] : "-" || "-"}</strong></div>
        <div class="view-row"><span>Gender</span><strong>${student.gender || "-"}</strong></div>
        <div class="view-row"><span>School</span><strong>${student.school_name || "-"}</strong></div>
        <div class="view-row"><span>Class</span><strong>${student.class}</strong></div>
        <div class="view-row"><span>Curriculum</span><strong>${student.curriculum}</strong></div>
      </section>
      <section class="view-card">
        <h3>👨‍👩‍👧 Parent Information</h3>
        <div class="view-row"><span>Parent</span><strong>${student.parent_name}</strong></div>
        <div class="view-row"><span>Relationship</span><strong>${student.relationship || "-"}</strong></div>
        <div class="view-row"><span>Mobile</span><strong>${student.mobile}</strong></div>
        <div class="view-row"><span>WhatsApp</span><strong>${student.whatsapp || "-"}</strong></div>
        <div class="view-row"><span>Email</span><strong>${student.email || "-"}</strong></div>
        <div class="view-row"><span>City</span><strong>${student.city || "-"}</strong></div>
      </section>
      <div class="bottom-grid">
        <section class="view-card">
          <h3>📚 Academic Details</h3>
          <div class="view-row">
            <span>Learning Mode</span>
            <strong>${student.learning_mode}</strong>
          </div>
          <div class="view-row">
            <span>Request Type</span>
            <strong>${student.request_type}</strong>
          </div>
          <div class="view-row">
            <span>Status</span>
            <strong>${student.status}</strong>
          </div>
          <div class="view-row">
            <span>Subjects</span>
            <strong>${Array.isArray(student.subjects) ? student.subjects.join(", ") : student.subjects}</strong>
          </div>
        </section>
        <section class="view-card">
          <h3>💬 Message</h3>
          <div class="message-box">
            ${student.message || "No message provided."}
          </div>
        </section>
      </div>
    </div>
  `;
  document.getElementById("viewEnrollmentModal").hidden = false;
});
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("admin-modal-close")) {
    e.target.closest(".admin-modal").hidden = true;
  }
});
const editEnrollmentForm = document.getElementById("editEnrollmentForm");
if (editEnrollmentForm) {
    editEnrollmentForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const updatedStudent = {
            student_name: document.getElementById("editStudentName").value,
            parent_name: document.getElementById("editParentName").value,
            dob: document.getElementById("editDob").value,
            gender: document.getElementById("editGender").value,
            school_name: document.getElementById("editSchool").value,
            city: document.getElementById("editCity").value,
            relationship: document.getElementById("editRelationship").value,
            whatsapp: document.getElementById("editWhatsapp").value,
            mobile: document.getElementById("editMobile").value,
            email: document.getElementById("editEmail").value,
            class: document.getElementById("editClass").value,
            curriculum: document.getElementById("editCurriculum").value,
            learning_mode: document.getElementById("editLearningMode").value,
            subjects: document
                .getElementById("editSubjects")
                .value
                .split(",")
                .map(s => s.trim()),
            message: document.getElementById("editMessage").value,
            request_type: document.getElementById("editRequestType").value,
            status: document.getElementById("editStatus").value
        };
        const response = await fetch(
            `http://localhost:5000/api/enrollments/${editingEnrollmentId}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(updatedStudent)
            }
        );
        const data = await response.json();
        if (data.success) {
          Swal.fire({
          icon: "success",
          title: "Changes Saved",
          text: "Student details updated successfully.",
          timer: 1800,
          showConfirmButton: false
          });
          document.getElementById("enrollmentEditModal").hidden = true;
          loadEnrollments();
        } else {
         Swal.fire({
    icon: "error",
    title: "Oops!",
    text: data.message
});
        }
    });
}

const searchEnrollment = document.getElementById("searchEnrollment");
if (searchEnrollment) {
    searchEnrollment.addEventListener("input", () => {
        const keyword = searchEnrollment.value.toLowerCase();
        const filtered = allEnrollments.filter(student => {
            return (
                student.student_name.toLowerCase().includes(keyword) ||
                student.parent_name.toLowerCase().includes(keyword) ||
                student.mobile.includes(keyword) ||
                (student.email || "").toLowerCase().includes(keyword) ||
                student.class.toLowerCase().includes(keyword)
            );
        });
        renderEnrollments(filtered);
    });
}
const contactForm = document.getElementById("contactForm");
if (contactForm) {
    contactForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const formData = {
            name: contactForm.name.value,
            email: contactForm.email.value,
            message: contactForm.message.value
        };
        try {
            const response = await fetch("http://localhost:5000/api/contact", {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify(formData)
            });
            const data = await response.json();
            if (data.success) {
                Swal.fire({
                    icon: "success",
                    title: "Message Sent!",
                    text: "Thank you. We'll get back to you soon."
                });
                contactForm.reset();
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Oops!",
                    text: data.message
                });
            }
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Server Error",
                text: "Unable to send your message."
            });
        }
    });
}