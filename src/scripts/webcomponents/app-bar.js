class AppBar extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
    this.updateTime();
    setInterval(() => this.updateTime(), 1000);
    this.addEventListeners();
  }

  render() {
    this.shadowRoot.innerHTML = `
            <style>
                .app-bar {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                background: linear-gradient(135deg, rgb(104, 6, 241), rgb(45, 0, 135));
                color: white;
                padding: 15px;
                text-align: center;
                font-size: 1.5em;
                font-weight: bold;
                font-family: 'Poppins', sans-serif;
                box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
                border-radius: 0 0 10px 10px;
                z-index: 1000;
            }

                .time-display {
                    font-size: 1em;
                    margin-top: 5px;
                    font-weight: normal;
                    color: #ffcc00; 
                }
                    

                .search-filter-container {
                    margin-top: 15px;
                    display: flex;
                    justify-content: center;
                    gap: 10px;
                }

                .search-input {
                    width: 60%;
                    max-width: 300px;
                    padding: 10px;
                    border: 2px solid white;
                    border-radius: 5px;
                    background: rgba(255, 255, 255, 0.1);
                    color: white;
                    outline: none;
                    transition: 0.3s;
                }

                .search-input::placeholder {
                    color: rgba(255, 255, 255, 0.7);
                }

                .search-input:focus {
                    background: rgba(255, 255, 255, 0.2);
                    border-color: #ffcc00;
                }

                .filter-select {
                    padding: 10px;
                    border-radius: 5px;
                    border: none;
                    background: white;
                    color: rgb(104, 6, 241);
                    font-weight: bold;
                    cursor: pointer;
                    transition: 0.3s;
                }

                .filter-select:hover {
                    background: #ffcc00;
                    color: black;
                }
            </style>
            <div class="app-bar">
                Notes App - Ramadan Kareem
                <div class="time-display"></div>
                
                <div class="search-filter-container">
                    <input type="text" class="search-input" placeholder="Cari catatan...">
                    <select class="filter-select">
                        <option value="all">Semua</option>
                        <option value="latest">Terbaru</option>
                        <option value="alphabetical">Berdasarkan Abjad</option>
                    </select>
                </div>
            </div>
        `;
  }

  updateTime() {
    const now = new Date();
    const days = [
      "Minggu",
      "Senin",
      "Selasa",
      "Rabu",
      "Kamis",
      "Jumat",
      "Sabtu",
    ];
    const months = [
      "Januari",
      "Februari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "September",
      "Oktober",
      "November",
      "Desember",
    ];

    const day = days[now.getDay()];
    const date = now.getDate();
    const month = months[now.getMonth()];
    const year = now.getFullYear();
    const timeString = now.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    const fullDateTime = `🕒 ${day}, ${date} ${month} ${year} - ${timeString}`;
    this.shadowRoot.querySelector(".time-display").textContent = fullDateTime;
  }

  addEventListeners() {
    this.shadowRoot
      .querySelector(".search-input")
      .addEventListener("input", (event) => {
        const searchText = event.target.value.toLowerCase();
        this.dispatchEvent(
          new CustomEvent("search-note", {
            detail: { searchText },
            bubbles: true,
            composed: true,
          })
        );
      });

    this.shadowRoot
      .querySelector(".filter-select")
      .addEventListener("change", (event) => {
        const filterType = event.target.value;
        this.dispatchEvent(
          new CustomEvent("filter-notes", {
            detail: { filterType },
            bubbles: true,
            composed: true,
          })
        );
      });
  }
}

customElements.define("app-bar", AppBar);
