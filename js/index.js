const id2class = { 0: 'With Mask', 1: 'No Mask' };

async function detectFrame(video, outputCanvas) {
  detect(video).then((results) => {
    outputCanvas.width = video.width;
    outputCanvas.height = video.height;
    ctx = outputCanvas.getContext('2d');
    ctx.clearRect(0, 0, outputCanvas.width, outputCanvas.height);
    ctx.drawImage(video, 0, 0, outputCanvas.width, outputCanvas.height );
    for (bboxInfo of results) {
      bbox = bboxInfo[0];
      classID = bboxInfo[1];
      score = bboxInfo[2];

      ctx.beginPath();
      ctx.lineWidth = '4';
      if (classID == 0) {
        ctx.strokeStyle = 'green';
        ctx.fillStyle = 'green';
      } else {
        ctx.strokeStyle = 'red';
        ctx.fillStyle = 'red';
      }

      ctx.rect(bbox[0], bbox[1], bbox[2] - bbox[0], bbox[3] - bbox[1]);
      ctx.stroke();

      ctx.font = '30px Arial';

      let content = id2class[classID] + ' ' + score.toFixed(2);
      ctx.fillText(content, bbox[0], bbox[1] < 20 ? bbox[1] + 30 : bbox[1] - 5);
    }
  });
}

function startVideoAnalysis(target, outputCanvas) {
  if (!target.paused) {
    detectFrame(target, outputCanvas);
    setTimeout(() => {
      startVideoAnalysis(target, outputCanvas);
    }, 10);
  }
}

function downloadImage() {
  var link = document.createElement('a');
  link.download = 'Violation.png';
  link.href = document.getElementById('main-canvas').toDataURL()
  link.click();
}

function switchCamera() {
  const mainVideo = document.getElementById('main-video');
  const mainCanvas = document.getElementById('main-canvas');
  startVideo(mainVideo, true).then((x) => {
    startVideoAnalysis(mainVideo, mainCanvas);
  });
}

async function setup() {
  await loadModel();

  const mainVideo = document.getElementById('main-video');
  const mainCanvas = document.getElementById('main-canvas');
  startVideo(mainVideo).then((x) => {
    startVideoAnalysis(mainVideo, mainCanvas);
  });
}

setup();
