document.addEventListener("DOMContentLoaded", function () {
  const chatbox = document.getElementById("chatbox");
  const sendButton = document.getElementById("send-button");
  const userInput = document.getElementById("user-input");
  const fileInput = document.getElementById("file-input");
  const uploadButton = document.getElementById("upload-button");

  console.log(chatData); // Periksa data chat

  // Menangani tombol upload untuk memilih file
  uploadButton.addEventListener("click", function () {
    fileInput.click();
  });

  // Menangani kiriman file yang dipilih
  fileInput.addEventListener("change", function (event) {
    const file = event.target.files[0];
    if (file) {
      // Anda bisa menambahkan kode untuk mengirim file ke server
      console.log("File yang dipilih:", file.name);
    }
  });

  // Menampilkan pesan di chatbox
  const chatData = {
    results: [
      {
        room: {
          name: "Product A",
          id: 12456,
          image_url: "https://picsum.photos/id/237/200/300",
          participant: [
            { id: "admin@mail.com", name: "Admin", role: 0 },
            { id: "agent@mail.com", name: "Agent A", role: 1 },
            { id: "customer@mail.com", name: "King Customer", role: 2 },
          ],
        },
        comments: [
          {
            id: 1,
            type: "text",
            message: "Hello",
            sender: "customer@mail.com",
          },
          {
            id: 2,
            type: "image",
            url: "https://picsum.photos/200/300",
            message: "Payment proof",
            sender: "customer@mail.com",
          },
        ],
      },
    ],
  };

  // Menampilkan peserta
  const participantsContainer = document.getElementById("participants-list");
  const participants = chatData.results[0].room.participant;
  participants.forEach((p) => {
    const participantEl = document.createElement("li");
    participantEl.textContent = `${p.name} (${
      p.role === 0 ? "Admin" : p.role === 1 ? "Agent" : "Customer"
    })`;
    participantsContainer.appendChild(participantEl);
  });

  // Menampilkan pesan chat
  const messages = chatData.results[0].comments;
  messages.forEach((msg) => {
    const bubble = document.createElement("div");
    bubble.classList.add("chat-bubble");

    const sender = chatData.results[0].room.participant.find(
      (p) => p.id === msg.sender
    );
    const senderName = sender ? sender.name : "Unknown";

    if (msg.type === "text") {
      bubble.textContent = `${senderName}: ${msg.message}`;
    } else if (msg.type === "image") {
      bubble.classList.add("image-bubble");
      bubble.innerHTML = `<img src="${msg.url}" alt="${msg.message}"/>`;
    }

    chatbox.appendChild(bubble);
  });

  // Menangani tombol kirim pesan
  sendButton.addEventListener("click", () => {
    const message = userInput.value.trim();
    if (message) {
      sendMessage(message);
    }
  });

  // Menangani tekan enter untuk mengirim pesan
  userInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      event.preventDefault(); // Mencegah form submit
      const message = userInput.value.trim();
      if (message) {
        sendMessage(message);
      }
    }
  });

  function sendMessage(message) {
    const userBubble = document.createElement("div");
    userBubble.classList.add("chat-bubble", "user-bubble");
    userBubble.textContent = message;
    chatbox.appendChild(userBubble);

    userInput.value = "";
    chatbox.scrollTop = chatbox.scrollHeight;

    // Simulasi respons dari bot
    const botBubble = document.createElement("div");
    botBubble.classList.add("chat-bubble", "bot-bubble");
    botBubble.textContent = "Bot response to: " + message;
    chatbox.appendChild(botBubble);
    chatbox.scrollTop = chatbox.scrollHeight;
  }
});
  