class LoadingIndicator extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    this.shadowRoot.innerHTML = `
            <style>
                .loading {
                    display: none;
                    text-align: center;
                    font-size: 16px;
                    font-weight: bold;
                    color: blue;
                    margin-top: 10px;
                }
                .loading.active {
                    display: block;
                }
            </style>
            <div class="loading">Loading...</div>
        `;
  }

  show() {
    const loadingElement = this.shadowRoot.querySelector(".loading");
    if (loadingElement) {
      console.log("Loading ditampilkan.");
      loadingElement.classList.add("active");
    }
  }

  hide() {
    const loadingElement = this.shadowRoot.querySelector(".loading");
    if (loadingElement) {
      console.log("Loading disembunyikan.");
      loadingElement.classList.remove("active");
    }
  }
}

customElements.define("loading-indicator", LoadingIndicator);
