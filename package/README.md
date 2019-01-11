# Noisadelic


## Getting started

### Install noisadelic
```bash
npm i noisadelic
```

#### Basic implementation
This example create a new noise, convert it to an image and add it to the body

```javascript
import {Brownian} from "noisadelic"

var noise = new Brownian({
    size: 1024,
    rgb: true
});

var image = noise.convertImage();
document.body.appendChild(image);
```

#### THREE.js example
```javascript
import {Brownian} from "noisadelic"

var noise = new Brownian({
    size: 1024
});

// If texture need to be dynamic
var texture = new THREE.CanvasTexture(noise.canvas);

// If texture need to be static
var texture = new THREE.Texture(noise.convertImg());

var material = new THREE.MeshBasicMaterial({
    map: texture
});
```




## License

Based on <a href="https://github.com/rollup/rollup-starter-lib">https://github.com/rollup/rollup-starter-lib</a>
[MIT](LICENSE).

