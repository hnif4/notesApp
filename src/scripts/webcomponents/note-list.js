class NoteList extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.notes = [];
  }

  static get observedAttributes() {
    return ["data-color", "data-font-size"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "data-color" || name === "data-font-size") {
      this.render();
    }
  }

  set notesData(notes) {
    this.notes = notes;
    this.render();
  }

  connectedCallback() {
    this.render();
  }

  render() {
    const bgColor = this.getAttribute("data-color") || "white";
    const fontSize = this.getAttribute("data-font-size") || "16px";

    const activeNotes = this.notes.filter((note) => !note.archived);
    const archivedNotes = this.notes.filter((note) => note.archived);

    this.shadowRoot.innerHTML = `
            <style>
                .container {
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                }
                .section {
                    margin-bottom: 20px;
                }
                .title {
                    font-size: 18px;
                    font-weight: bold;
                    margin-bottom: 10px;
                }
                .notes-grid {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 20px;
                    justify-content: center;
                }
            </style>

            <div class="container">
                <div class="section">
                    <div class="title">Catatan Aktif</div>
                    <div class="notes-grid">
                        ${activeNotes.length > 0 ? activeNotes.map(() => `<note-item data-color="${bgColor}" data-font-size="${fontSize}"></note-item>`).join("") : "<p>Tidak ada catatan.</p>"}
                    </div>
                </div>

                <div class="section">
                    <div class="title">Catatan Arsip</div>
                    <div class="notes-grid">
                        ${archivedNotes.length > 0 ? archivedNotes.map(() => `<note-item data-color="${bgColor}" data-font-size="${fontSize}"></note-item>`).join("") : "<p>Tidak ada catatan.</p>"}
                    </div>
                </div>
            </div>
        `;

    // Isi data ke elemen <note-item>
    this.shadowRoot.querySelectorAll("note-item").forEach((element, index) => {
      if (index < activeNotes.length) {
        element.note = activeNotes[index];
      } else {
        element.note = archivedNotes[index - activeNotes.length];
      }
    });
  }
}

customElements.define("note-list", NoteList);
