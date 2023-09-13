# doods-wrapper
A nodejs wrapper for the danilabs doods service

## Usage
```js
import doods from "module-name";
import { createReadStream } from "fs";

// Axios options
const opts = { responseType: "stream" };
const danil = await doods("https://doods.pro/d/3jauj7g67kga", opts);

if (danil.error) {
  console.error(danil);
  return;
}

// write the file to disk
danil.download().then((res) => {
  res.data.pipe(createReadStream("danil-hot.mp4"));
});
```