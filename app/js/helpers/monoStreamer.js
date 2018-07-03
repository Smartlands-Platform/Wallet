const streamers = {};

export function newStream(name, stream) {
  if (streamers[name]) {
      if (typeof streamers[name] === "function") {
          streamers[name]();
      }else{
          streamers[name] = stream;
      }

  }
  streamers[name] = stream;
}

export function killStreams() {
  Object.keys(streamers).forEach((k) => {
      if (typeof streamers[k] === "function") {
          streamers[k]();
      }else{
          delete streamers[k];
      }
  });
}
