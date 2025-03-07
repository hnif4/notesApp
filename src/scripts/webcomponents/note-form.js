class NoteForm extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
    this.addValidation();
  }

  render() {
    this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
            <style>
                .form-container {
                    max-width: 600px;
                    width: 100%;
                    margin: 120px auto 30px auto;
                    padding: 80px;
                    background: white;
                    border-radius: 12px;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                    border: 2px solid rgb(104, 6, 241);
                }

                .form-title {
                    text-align: center;
                    font-size: 1.5em;
                    font-weight: bold;
                    color: rgb(104, 6, 241);
                    margin-bottom: 15px;
                }

                label {
                    font-size: 1em;
                    font-weight: bold;
                    color: black;
                    display: block;
                    margin-bottom: 5px;
                }

                .form-control {
                    background: white;
                    border: 2px solid rgb(104, 6, 241);
                    color: black;
                    font-weight: bold;
                    padding: 10px;
                    border-radius: 6px;
                    transition: 0.3s;
                }

                .form-control:focus {
                    border-color: #ffcc00;
                    background: #f9f9f9;
                }

                .is-invalid {
                    border-color: red !important;
                    background: #ffe6e6;
                }

                .error-message {
                    color: red;
                    font-size: 0.9em;
                    margin-top: 5px;
                }

                textarea {
                    resize: none;
                    min-height: 120px;
                }

                .btn-submit {
                    width: 100%;
                    padding: 10px;
                    font-size: 1.1em;
                    font-weight: bold;
                    background: rgb(104, 6, 241);
                    color: white;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    transition: 0.3s;
                }

                .btn-submit:hover {
                    background: #ffcc00;
                    color: black;
                }

                .btn-submit:disabled {
                    background: gray;
                    cursor: not-allowed;
                }
            </style>

            <div class="form-container">
                <div class="form-title">Form Tambah Catatan</div>
                <form id="noteForm">
                    <div class="mb-3">
                        <label for="title">Judul Catatan</label>
                        <input type="text" id="title" name="title" class="form-control form-control-lg" required>
                        <div class="error-message" id="titleError"></div>
                    </div>
                    <div class="mb-3">
                        <label for="body">Isi Catatan</label>
                        <textarea id="body" name="body" class="form-control form-control-lg" required></textarea>
                        <div class="error-message" id="bodyError"></div>
                    </div>
                    <button type="submit" class="btn-submit" disabled>Tambah Catatan</button>
                </form>
            </div>
        `;
  }

  addValidation() {
    const form = this.shadowRoot.querySelector("#noteForm");
    const titleInput = this.shadowRoot.querySelector("#title");
    const bodyInput = this.shadowRoot.querySelector("#body");
    const submitButton = this.shadowRoot.querySelector(".btn-submit");

    const titleError = this.shadowRoot.querySelector("#titleError");
    const bodyError = this.shadowRoot.querySelector("#bodyError");

    const validateForm = () => {
      let isValid = true;

      if (titleInput.value.trim().length < 3) {
        titleError.textContent = "Judul minimal 3 karakter.";
        titleInput.classList.add("is-invalid");
        isValid = false;
      } else {
        titleError.textContent = "";
        titleInput.classList.remove("is-invalid");
      }

      if (bodyInput.value.trim().length < 10) {
        bodyError.textContent = "Isi catatan minimal 10 karakter.";
        bodyInput.classList.add("is-invalid");
        isValid = false;
      } else {
        bodyError.textContent = "";
        bodyInput.classList.remove("is-invalid");
      }

      submitButton.disabled = !isValid;
    };

    titleInput.addEventListener("input", validateForm);
    bodyInput.addEventListener("input", validateForm);

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (submitButton.disabled) return;

      const title = titleInput.value.trim();
      const body = bodyInput.value.trim();

      const newNote = {
        id: `notes-${Date.now()}`,
        title,
        body,
        createdAt: new Date().toISOString(),
        archived: false,
      };

      document.dispatchEvent(new CustomEvent("add-note", { detail: newNote }));
      form.reset();
      validateForm();
    });
  }
}

customElements.define("note-form", NoteForm);
