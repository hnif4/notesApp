import notesData from "./data/notes-data.js";
import "../scripts/webcomponents/app-bar.js";
import "../scripts/webcomponents/note-form.js";
import "../scripts/webcomponents/note-item.js";
import "../scripts/webcomponents/note-list.js";
import "./webcomponents/loading-indicator.js";
import "../styles/styles.css";

function getNotesFromStorage() {
  const storedNotes = localStorage.getItem("notesData");
  return storedNotes ? JSON.parse(storedNotes) : [];
}

function saveNotesToStorage(notes) {
  localStorage.setItem("notesData", JSON.stringify(notes));
}

let notes = getNotesFromStorage();
const noteList = document.querySelector("note-list");
if (noteList) {
  noteList.notesData = notes;
} else {
  console.error("Element <note-list> tidak ditemukan.");
}

async function fetchNotesFromAPI() {
  const loadingIndicator = document.querySelector("loading-indicator");
  const notesContainer = document.querySelector("#notes-container");

  if (loadingIndicator) {
    console.log("Menampilkan loading...");
    loadingIndicator.style.display = "block";
  }

  if (notesContainer) {
    notesContainer.innerHTML = "";
  }

  try {
    const response = await fetch("https://notes-api.dicoding.dev/v2/notes");
    const result = await response.json();

    if (result.status === "success") {
      console.log("Data berhasil diambil");
      return result.data;
    } else {
      console.error("Gagal mengambil data:", result.message);
      return [];
    }
  } catch (error) {
    console.error("Terjadi kesalahan saat mengambil data dari API:", error);
    return [];
  } finally {
    if (loadingIndicator) {
      loadingIndicator.style.display = "none";
      console.log("Menyembunyikan loading...");
    }
  }
}

async function loadAndDisplayNotes() {
  const loadingIndicator = document.querySelector("loading-indicator");
  const notesContainer = document.querySelector("#notes-container");
  const noteList = document.querySelector("note-list");

  if (loadingIndicator) loadingIndicator.show();

  const notes = await fetchNotesFromAPI();

  saveNotesToStorage(notes);

  if (notesContainer) {
    notesContainer.innerHTML = notes
      .map((note) => `<div>${note.title}</div>`)
      .join("");
  }

  if (noteList) {
    noteList.notesData = notes;
  }

  if (loadingIndicator) loadingIndicator.hide();
}

document.addEventListener("add-note", async (event) => {
  const loadingIndicator = document.querySelector("loading-indicator");
  if (loadingIndicator) loadingIndicator.show(); 

  const newNote = {
    title: event.detail.title,
    body: event.detail.body,
  };

  try {
    const response = await fetch("https://notes-api.dicoding.dev/v2/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newNote),
    });

    const result = await response.json();

    if (result.status === "success") {
      notes.push(result.data);
      saveNotesToStorage(notes);
      if (noteList) noteList.notesData = [...notes];

      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Catatan berhasil ditambahkan.",
        timer: 2000,
        showConfirmButton: false,
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Gagal menambahkan catatan: " + result.message,
      });
    }
  } catch (error) {
    console.error("Error saat menambahkan catatan:", error);
  } finally {
    if (loadingIndicator) loadingIndicator.hide();
  }
});

document.addEventListener("search-note", (event) => {
  const loadingIndicator = document.querySelector("loading-indicator");
  if (loadingIndicator) loadingIndicator.show();

  const searchText = event.detail.searchText.toLowerCase();
  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchText) ||
      note.body.toLowerCase().includes(searchText)
  );

  if (noteList) noteList.notesData = filteredNotes;

  if (loadingIndicator) loadingIndicator.hide();
});

document.addEventListener("filter-notes", (event) => {
  const loadingIndicator = document.querySelector("loading-indicator");
  if (loadingIndicator) loadingIndicator.show();

  const filterType = event.detail.filterType;
  let filteredNotes = [...notes];

  if (filterType === "alphabetical") {
    filteredNotes.sort((a, b) => a.title.localeCompare(b.title));
  } else if (filterType === "latest") {
    filteredNotes = filteredNotes
      .filter((note) => note.createdAt)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  if (noteList) noteList.notesData = [...filteredNotes];

  if (loadingIndicator) loadingIndicator.hide();
});

document.addEventListener("delete-note", async (event) => {
  const loadingIndicator = document.querySelector("loading-indicator");
  if (loadingIndicator) loadingIndicator.show();

  const noteId = event.detail.id;
  const noteTitle = event.detail.title;

  const isConfirmed = await Swal.fire({
    title: `Yakin ingin menghapus catatan?`,
    text: `Judul: "${noteTitle}"`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Ya, hapus!",
    cancelButtonText: "Batal",
  });

  if (!isConfirmed.isConfirmed) {
    if (loadingIndicator) loadingIndicator.hide();
    return;
  }

  try {
    const response = await fetch(
      `https://notes-api.dicoding.dev/v2/notes/${noteId}`,
      {
        method: "DELETE",
      }
    );
    const result = await response.json();

    if (result.status === "success") {
      notes = notes.filter((note) => note.id !== noteId);
      saveNotesToStorage(notes);
      if (noteList) noteList.notesData = [...notes];

      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Catatan berhasil dihapus.",
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Gagal menghapus catatan!",
        text: result.message || "Terjadi kesalahan. Silakan coba lagi.",
      });
    }
  } catch (error) {
    console.error("Error saat menghapus catatan:", error);
    Swal.fire({
      icon: "error",
      title: "Terjadi Kesalahan!",
      text: "Tidak dapat menghapus catatan. Periksa koneksi internet Anda.",
    });
  } finally {
    if (loadingIndicator) loadingIndicator.hide(); // Sembunyikan loading setelah selesai
  }
});

const noteListElement = document.querySelector("note-list");

if (noteListElement) {
  noteListElement.addEventListener("toggle-archive", async (event) => {
    const loadingIndicator = document.querySelector("loading-indicator");
    if (loadingIndicator) loadingIndicator.show(); // Tampilkan loading

    const noteId = event.detail.id;

    try {
      const response = await fetch(
        `https://notes-api.dicoding.dev/v2/notes/${noteId}/archive`,
        {
          method: "POST",
        }
      );

      const result = await response.json();

      if (result.status === "success") {
        notes = notes.map((note) =>
          note.id === noteId ? { ...note, archived: !note.archived } : note
        );

        saveNotesToStorage(notes);
        noteListElement.notesData = [...notes];

        Swal.fire({
          icon: "success",
          title: "Berhasil!",
          text: notes.find((n) => n.id === noteId).archived
            ? "Catatan diarsipkan."
            : "Catatan dikembalikan.",
        });
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error("Error saat mengarsipkan catatan:", error);
      Swal.fire({
        icon: "error",
        title: "Terjadi Kesalahan!",
        text: "Gagal mengarsipkan catatan.",
      });
    } finally {
      if (loadingIndicator) loadingIndicator.hide();
    }
  });
} else {
  console.error("Element <note-list> tidak ditemukan.");
}

document.addEventListener("DOMContentLoaded", () => {
  const noteList = document.querySelector("note-list");
  const loadingIndicator = document.querySelector("loading-indicator");

  if (!loadingIndicator) {
    console.error("Element <loading-indicator> tidak ditemukan.");
  }

  if (noteList) {
    const observer = new MutationObserver(() => {
      gsap.from(".note-card", {
        opacity: 0,
        y: 20,
        duration: 0.5,
        ease: "power2.out",
      });
    });

    observer.observe(noteList, { childList: true });
  }
});
