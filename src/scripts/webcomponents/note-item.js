class NoteItem extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  set note(note) {
    this._note = note;
    this.render();
  }

  static get observedAttributes() {
    return ["data-color", "data-font-size"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (this.shadowRoot) {
      const noteCard = this.shadowRoot.querySelector(".note-card");
      if (noteCard) {
        if (name === "data-color") {
          noteCard.style.backgroundColor = newValue;
        }
        if (name === "data-font-size") {
          noteCard.style.fontSize = newValue;
        }
      }
    }
  }

  connectedCallback() {
    this.render();
  }

  render() {
    if (!this._note) return;

    const bgColor = this.getAttribute("data-color") || "white";
    const fontSize = this.getAttribute("data-font-size") || "16px";
    const isArchived = this._note.archived; // Cek apakah catatan diarsipkan

    this.shadowRoot.innerHTML = `
            <style>
                .note-card {
                    background: ${bgColor};
                    border-radius: 10px;
                    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
                    padding: 15px;
                    transition: 0.3s;
                    width: 300px;
                    height: 200px;
                    font-size: ${fontSize};
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    overflow: hidden;
                    animation: fadeInSlide 0.5s ease-out;
                }
                h3 {
                    margin: 0;
                    font-size: 20px;
                }
                .note-body {
                    flex-grow: 1;
                    max-height: 100px;
                    overflow-y: auto;
                }
                small {
                    color: gray;
                    display: block;
                    margin-top: 5px;
                }
                .btn-group {
                    display: flex;
                    justify-content: space-between;
                    margin-top: 10px;
                }
                .btn {
                    border: none;
                    padding: 5px 10px;
                    cursor: pointer;
                    color: white;
                    border-radius: 5px;
                    transition: transform 0.2s ease, box-shadow 0.2s ease;
                }
                .btn-delete {
                    background-color: #dc3545;
                }
                .btn-archive {
                    background-color: ${isArchived ? "#28a745" : "#ffc107"};
                    transition: background-color 0.3s ease;
                }
                .btn:hover {
                    transform: scale(1.1);
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                }

                @keyframes fadeInSlide {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            </style>

            <div class="note-card">
                <h3>${this._note.title}</h3>
                <div class="note-body">${this._note.body}</div>
                <small>${new Date(this._note.createdAt).toLocaleDateString()}</small>
                <div class="btn-group">
                    <button class="btn btn-archive">${isArchived ? "Kembalikan" : "Arsipkan"}</button>
                    <button class="btn btn-delete">Hapus</button>
                </div>
            </div>
        `;

    this.shadowRoot
      .querySelector(".btn-delete")
      .addEventListener("click", () => {
        this.dispatchEvent(
          new CustomEvent("delete-note", {
            detail: {
              id: this._note.id,
              title: this._note.title,
            },
            bubbles: true,
            composed: true,
          })
        );
      });

    this.shadowRoot
      .querySelector(".btn-archive")
      .addEventListener("click", () => {
        this.dispatchEvent(
          new CustomEvent("toggle-archive", {
            detail: { id: this._note.id },
            bubbles: true,
            composed: true,
          })
        );
      });
  }
}

customElements.define("note-item", NoteItem);
