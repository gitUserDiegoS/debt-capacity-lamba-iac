function info(message, obj) {
  console.log(`INFO: ${message}`, obj || "");
}

function error(message, err) {
  console.error(`ERROR: ${message}`, err);
}

module.exports = { info, error };