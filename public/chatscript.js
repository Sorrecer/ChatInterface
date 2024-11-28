$(document).ready(function () {
  // Initial data setup from chatData
  const chatData = {
    results: [
      {
        room: {
          name: "Product A",
          id: 12456,
          image_url: "https://picsum.photos/id/237/200/300",
          participant: [
            {
              id: "admin@mail.com",
              name: "Admin",
              role: 0,
            },
            {
              id: "agent@mail.com",
              name: "Agent A",
              role: 1,
            },
            {
              id: "customer@mail.com",
              name: "king customer",
              role: 2,
            },
          ],
        },
        comments: [
          {
            id: 885512,
            type: "text",
            message: "Selamat malam",
            sender: "customer@mail.com",
          },
          {
            id: 885513,
            type: "text",
            message: "Malam",
            sender: "agent@mail.com",
          },
          {
            id: 885514,
            type: "text",
            message: "Ada yang bisa saya bantu?",
            sender: "agent@mail.com",
          },
          {
            id: 885515,
            type: "text",
            message:
              "Saya ingin mengirimkan bukti pembayaran, karena diaplikasi selalu gagal",
            sender: "customer@mail.com",
          },
          {
            id: 885516,
            type: "text",
            message: "Baik, silahkan kirimkan lampiran bukti pembayarannya",
            sender: "agent@mail.com",
          },
          {
            id: 885517,
            type: "image",
            url: "https://picsum.photos/200/300",
            message: "Bukti pembayaran",
            sender: "customer@mail.com",
          },
          {
            id: 885518,
            type: "video",
            url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            thumbnail_url: "https://picsum.photos/200/100",
            message: "Video penjelasan produk",
            sender: "agent@mail.com",
          },
          {
            id: 885519,
            type: "pdf",
            url: "https://example.com/document.pdf",
            file_name: "Invoice_12456.pdf",
            sender: "customer@mail.com",
          },
          {
            id: 885520,
            type: "text",
            message: "Terima kasih, sudah saya terima.",
            sender: "agent@mail.com",
          },
        ],
      },
    ],
  };

  // // Populate chat participants and messages
  // const participantsContainer = $("#participants-list");
  // const participants = chatData.results[0].room.participant;

  const messages = chatData.results[0].comments;
  messages.forEach((msg) => {
    const sender = chatData.results[0].room.participant.find(
      (p) => p.id === msg.sender
    );
    const senderName = sender ? sender.name : "Unknown";

    // Menambahkan pesan sesuai dengan jenisnya (teks, gambar, video, atau pdf)
    if (msg.type === "text") {
      appendMessage(
        senderName === "king customer" ? "user-bubble" : "bot-bubble",
        `${msg.message}`,
        senderName
      );
    } else if (msg.type === "image") {
      appendMessage(
        "image-bubble",
        `<img src="${msg.url}" alt="${msg.message}"/>`,
        senderName
      );
    } else if (msg.type === "video") {
      appendMessage(
        "video-bubble",
        `<iframe width="320" height="240" src="https://www.youtube.com/embed/dQw4w9WgXcQ" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`,
        senderName
      );
    } else if (msg.type === "pdf") {
      appendMessage(
        "pdf-bubble",
        `<a href="samplepdf.pdf" target="_blank">Download PDF: Invoice_12456.pdf.pdf</a>`,
        senderName
      );
    }
  });

  // Handle send message
  $("#send-button").click(sendMessage);
  $("#user-input").keypress(function (event) {
    if (event.which === 13) {
      event.preventDefault();
      sendMessage();
    }
  });

  function sendMessage() {
    const message = $("#user-input").val().trim();
    if (message) {
      appendMessage("user-bubble", message, "king customer");
      $("#user-input").val(""); // Clear input field
      scrollToBottom();

      const loaderId = appendLoader();
      scrollToBottom();

      $.ajax({
        url: "/api/chat",
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify({ message }),
        success: function (response) {
          removeLoader(loaderId);
          appendMessage("bot-bubble", response.response, "Admin");
          scrollToBottom();
        },
        error: function (error) {
          alert("Error communicating with the server. Please try again later.");
          console.error(error);
          removeLoader(loaderId);
        },
      });
    }
  }

  function appendMessage(className, message, senderName = "Unknown") {
    const messageContainer = $("<div>").addClass("message-container");

    // Menambahkan nama pengirim di atas pesan
    const senderNameElement = $("<div>")
      .addClass("sender-name")
      .text(senderName);
    messageContainer.append(senderNameElement);

    // Menambahkan chat bubble
    const bubble = $("<div>")
      .addClass(`chat-bubble ${className}`)
      .html(message);
    messageContainer.append(bubble);

    // Menambahkan seluruh elemen ke chatbox
    $("#chatbox").append(messageContainer);
  }

  function appendLoader() {
    const loaderId = "loader-" + Date.now();
    $("#chatbox").append(
      `<div class="chat-bubble bot-bubble" id="${loaderId}">
         <div class="loader"><span></span><span></span><span></span></div>
       </div>`
    );
    return loaderId;
  }

  function removeLoader(loaderId) {
    $("#" + loaderId).remove();
  }

  function scrollToBottom() {
    $("#chatbox").scrollTop($("#chatbox")[0].scrollHeight);
  }
});
