# watasu

`Watasu` (Japanese: 渡す; English: pass on) is a simple JavaScript abstraction, that simply passes on a function call from a safe run context to the outside. This allows for a quick execution, as the program will only describe the order and values of calls in native JavaScript.

## Example

<p align="center">
  <img src="https://user-images.githubusercontent.com/53529846/154762793-cf4e54b6-f12a-4caa-bdbb-8c06628a5ea9.png" width="80%">
</p>

> This is a screenshot of the example that can be found in [`examples/index.html`](./examples/index.html). It is deployed at [`oltdaniel.eu/watasu`](https://oltdaniel.eu/watasu/).

## Usage

The project is compiled as an `esmodule`. So you can use it like:

```html
<script type="module">
  import Watasu from 'http://cdn.jsdelivr.net/gh/oltdaniel/watasu/dist/watasu.js';
  
  const watasu = new Watasu();
  watasu.loadProgram(`
  set(sum, 0);
  inc(sum);
  print("current sum is ", sum);
  `);
  
  watasu.registerCall('set', function set(name, value) {
    if (name.name === 'dataReference') {
      this._context[name.value] = this.resolveParameterValue(value);
    } else {
      throw new Error('invalid set call');
    }
  })
  watasu.registerCall('inc', function inc(name) {
    if (name.name === 'dataReference') {
      this._context[name.value]++;
    } else {
      throw new Error('invalid inc call');
    }
  })
  watasu.registerCall('print', function print(...args) {
    console.log(...this.resolveParametersValues(args));
  })
  
  while(!watasu._runner.isDone) {
    watasu.step();
  }
</script>
```

## License

Do what you'd like to do. But keep sharing it publicly.

![GitHub](https://img.shields.io/github/license/oltdaniel/watasu)
