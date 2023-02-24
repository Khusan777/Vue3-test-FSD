import { createWebWorker } from './createWebWorker';

export const getBase64Image = createWebWorker(function (self, file) {
  const fileReader = new FileReader();
  fileReader.readAsDataURL(file);
  fileReader.onload = ({ target: { result } }) => {
    self.postMessage(result);
  };
}, window);
