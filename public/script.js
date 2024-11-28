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
