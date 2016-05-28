export default new Promise((resolve) => {
  window.gapi_onload = () => resolve(window.gapi);
});
