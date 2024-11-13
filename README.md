# README.md

    Parse Stable Diffusion wildcards source to a YAML object.

https://civitai.com/models/449400

## install

```bash
yarn add sd-wildcards-utils
yarn-tool add sd-wildcards-utils
yt add sd-wildcards-utils
```

# Demo

```typescript
import { parseWildcardsYaml, stringifyWildcardsYamlData } from 'sd-wildcards-utils';

let input = `
xxx:
  a:
    - >-
      (silhouette:1.2), jianying,
      1girl, nude,
      (in river), splash,
      ({sun rays, sunset|moonlight|dawn|twilight} background, low horizon),
      backlighting,
      contour light, body contour light, light particles,
      __lazy-wildcards/prompts/hair__,
      __lazy-wildcards/dataset/background-color__,
      (flower, falling petals, petals on liquid, petals, cherry blossom:0.8)
    - >-
      (silhouette:1.2), jianying,
      1girl, nude,
      (in river), splash,
      ({sun rays, sunset|moonlight|dawn|twilight} background, low horizon),
      backlighting,
      contour light, body contour light, light particles,
      __lazy-wildcards/prompts/hair__,
      __lazy-wildcards/dataset/background-color__,
      (flower, falling petals, petals on liquid, petals, cherry blossom:0.8)
    - "(silhouette:1.2), jianying, 1girl, nude, (in river), splash, ({sun rays, sunset|moonlight|dawn|twilight} background, low horizon), backlighting, contour light, body contour light, light particles, __lazy-wildcards/prompts/hair__, __lazy-wildcards/dataset/background-color__, (flower, falling petals, petals on liquid, petals, cherry blossom:0.8)"
    - |-
      (silhouette:1.2), jianying, 1girl, nude, (in river), splash, ({sun rays, sunset|moonlight|dawn|twilight} background, low horizon), backlighting, contour light, body contour light, light particles, __lazy-wildcards/prompts/hair__, __lazy-wildcards/dataset/background-color__, (flower, falling petals, petals on liquid, petals, cherry blossom:0.8)
`;

let doc = parseWildcardsYaml(input);
doc.contents;
let node = doc.getIn(['xxx', 'a']);
// @ts-ignore
let items = node.items;
console.dir(items, {
	depth: null,
});

console.log(`============`)

let out = doc.toString();

console.log(out)

console.log(`============`)

console.log(stringifyWildcardsYamlData(doc))
```

```yaml
============
xxx:
  a:
    - >-
      (silhouette:1.2), jianying, 1girl, nude, (in river), splash, ({sun rays,
      sunset|moonlight|dawn|twilight} background, low horizon), backlighting,
      contour light, body contour light, light particles,
      __lazy-wildcards/prompts/hair__,
      __lazy-wildcards/dataset/background-color__, (flower, falling petals,
      petals on liquid, petals, cherry blossom:0.8)
    - >-
      (silhouette:1.2), jianying, 1girl, nude, (in river), splash, ({sun rays,
      sunset|moonlight|dawn|twilight} background, low horizon), backlighting,
      contour light, body contour light, light particles,
      __lazy-wildcards/prompts/hair__,
      __lazy-wildcards/dataset/background-color__, (flower, falling petals,
      petals on liquid, petals, cherry blossom:0.8)
    - "(silhouette:1.2), jianying, 1girl, nude, (in river), splash, ({sun rays,
      sunset|moonlight|dawn|twilight} background, low horizon), backlighting,
      contour light, body contour light, light particles,
      __lazy-wildcards/prompts/hair__,
      __lazy-wildcards/dataset/background-color__, (flower, falling petals,
      petals on liquid, petals, cherry blossom:0.8)"
    - |-
      (silhouette:1.2), jianying, 1girl, nude, (in river), splash, ({sun rays, sunset|moonlight|dawn|twilight} backgroun
nd, low horizon), backlighting, contour light, body contour light, light particles, __lazy-wildcards/prompts/hair__, __la
azy-wildcards/dataset/background-color__, (flower, falling petals, petals on liquid, petals, cherry blossom:0.8)

============
xxx:
  a:
    - >-
      (silhouette:1.2), jianying, 1girl, nude, (in river), splash, ({sun rays,
      sunset|moonlight|dawn|twilight} background, low horizon), backlighting,
      contour light, body contour light, light particles,
      __lazy-wildcards/prompts/hair__,
      __lazy-wildcards/dataset/background-color__, (flower, falling petals,
      petals on liquid, petals, cherry blossom:0.8)
```

# SYNTAX

- https://github.com/adieyal/sd-dynamic-prompts/blob/main/docs/SYNTAX.md

# OTHERS

- https://eemeli.org/yaml/#yaml
- https://civitai.com/models/449400
- https://gist.github.com/bluelovers/5dd82472d21cbaa7203b36c34612434b
- https://civitai.com/user/C0rn_Fl4k3s/models
- https://civitai.com/models/138970/billions-of-wildcards-character-vehicle-scenery-building-creature-scifi-fantasy-magic-all-you-want
- https://github.com/sdbds/stable-diffusion-webui-wildcards
- https://civitai.com/models/934903
- https://civitai.com/models/863333
- https://civitai.com/models/272654?modelVersionId=317312

