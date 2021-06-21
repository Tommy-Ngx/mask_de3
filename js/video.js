let canvasTemp = document.createElement("canvas");

async function getAllCamera() {
  deviceIDs = [];
  allDevices = await navigator.mediaDevices.enumerateDevices();
  for (let device of allDevices) {
    if (device.kind == 'videoinput') {
      deviceIDs.push(device.deviceId);
    }
  }
  return deviceIDs;
}

async function startVideo(videoElement, switchCamera = false, videoSizeConfig = {}) {
  videoSources = await getAllCamera();
  if (switchCamera) {
    if (videoSources.length == 1) {
      return;
    } else {
      if (videoElement.srcObject) {
        videoElement.srcObject.getTracks().forEach((track) => {
          track.stop();
        });
      }
      if (window.cameraID === undefined) {
        window.cameraID = 0;
      } else {
        window.cameraID = window.cameraID + 1;
      }
      videoSource = videoSources[window.cameraID % videoSources.length];
    }
  } else {
    if (videoSources.length == 0) {
      alert('No camera found.');
      return;
    } else {
      window.cameraID = 0;
      videoSource = videoSources[0];
    }
  }
  videoConfig = {
    audio: false,
    video: {
      deviceId: videoSource ? { exact: videoSource } : undefined,
      width: videoSizeConfig.width || 640,
      height: videoSizeConfig.height,
    },
  };
  return new Promise(function (resolve, reject) {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia(videoConfig)
        .then((stream) => {
          window.stream = stream;
          videoElement.srcObject = stream;
          videoElement.onloadeddata = () => {
            videoElement.play();
            resolve(true);
          };
        })
        .catch(function (err) {
          resolve(false);
        });
    }
  });
}