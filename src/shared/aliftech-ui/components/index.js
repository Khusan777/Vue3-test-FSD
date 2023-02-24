const componentsPaths = require.context('./', true, /At\w+[/]At\w+.*$/);
let components = [];

componentsPaths.keys().forEach(component => {
  components.push(require(`${component}`));
});

components = new Set(components);

components.forEach(component => {
  exports[component?.default?.name] = component.default;
});
