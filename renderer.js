const videoElement = document.getElementById("video");
const startButton = document.getElementById("start");
const stopButton = document.getElementById("stop");
const fs = require("fs");
let mediaRecorder;
let recordedChunks = [];

navigator.mediaDevices
  .getUserMedia({ video: true, audio: true })
  .then((stream) => {
    videoElement.srcObject = stream;

    mediaRecorder = new MediaRecorder(stream);

    mediaRecorder.ondataavailable = function (event) {
      if (event.data.size > 0) {
        recordedChunks.push(event.data);
      }
    };

    mediaRecorder.onstop = function () {
      const blob = new Blob(recordedChunks, {
        type: "video/webm",
      });
      recordedChunks = [];

      const reader = new FileReader();
      reader.readAsArrayBuffer(blob);
      reader.onloadend = () => {
        const buffer = Buffer.from(reader.result);

        const date = new Date();

        const tempWebmPath = "D:/" + date.getMilliseconds() + ".mp4";
        fs.writeFile(tempWebmPath, buffer, () => {
          alert("save successfully");
          console.log("Conversion Finished");
        });
      };
    };

    startButton.onclick = () => {
      mediaRecorder.start();
      startButton.disabled = true;
      stopButton.disabled = false;
    };

    stopButton.onclick = () => {
      mediaRecorder.stop();
      startButton.disabled = false;
      stopButton.disabled = true;
    };
  })
  .catch((error) => {
    console.log(error);
    alert("connect device!!!");
  });
