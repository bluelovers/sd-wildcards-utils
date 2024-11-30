# Lazy Wildcards for Stable Diffusion

    lazy wildcards for create amazing images with powerful and flexible wildcards collections!

- (lazy-wildcards on civitai)
  https://civitai.com/models/449400
- (lazy-wildcards on github)
  https://github.com/bluelovers/sd-wildcards-utils

# What are wildcards?

Think of wildcards as magic words that unlock creative possibilities. They allow you to add variety and randomness to your prompts, letting Stable Diffusion surprise you with unique results.

# Trigger Words

see https://github.com/bluelovers/sd-wildcards-utils?tab=readme-ov-file#trigger-words

```
__lazy-wildcards/prompts/dataset/face__

__lazy-wildcards/dataset/background__
__lazy-wildcards/dataset/background-color__
__lazy-wildcards/background/color-multi__, 
__lazy-wildcards/background/color-transparent__, 

__lazy-wildcards/prompts/showcase__
__lazy-wildcards/subject/scenes-showcase/World_Morph/prompts__

__lazy-wildcards/costume/costume__
__lazy-wildcards/costume/costume-color__
__lazy-wildcards/cosplay-char/*/*/prompts__
__lazy-wildcards/subject/costume/sfw-civitai/prompts__

__lazy-wildcards/prompts/hair__
__lazy-wildcards/char/haircolor__

__lazy-wildcards/subject/costume-ethnicity-body-skin-tone/dark-skinned/prompts__
{0.3::(__lazy-wildcards/subject/costume-ethnicity-body-skin-tone/dark-skinned/prompts__:1.1)|}

__lazy-wildcards/subject/costume-ethnicity-race/furry/prompts__

__lazy-wildcards/subject/costume-elem/costume-breasts/prompts__
{{__lazy-wildcards/subject/costume-ethnicity-breasts/breasts-downblouse/prompts__|__lazy-wildcards/subject/costume-ethnicity-breasts/breasts-out/prompts__}|}

__lazy-wildcards/dataset/action__

__lazy-wildcards/subject/style-elem/food/prompts__
__lazy-wildcards/dataset/food-all-multi__
__lazy-wildcards/dataset/food-all__

__lazy-wildcards/utils/scenery-no-humans__
__lazy-wildcards/utils/scenery__
{0.2::__lazy-wildcards/utils/scenery__|}

__lazy-wildcards/dataset/style__
__lazy-wildcards/subject/moment/random/prompts__
{0.1::__lazy-wildcards/subject/moment/random/prompts__|}
```

# Unofficial Fork version

- stable-diffusion-webui (branch: dev-bluelovers)
  https://github.com/bluelovers/stable-diffusion-webui/tree/dev-bluelovers
- sd-dynamic-prompts (branch: pr/infotext-001)
  https://github.com/bluelovers/sd-dynamic-prompts/tree/pr/infotext-001
- *dynamicprompts (recommend install this bugfix for unlock full power)*
  https://civitai.com/articles/6313/unofficial-dynamicprompts-bugfix
- sd-webui-agent-scheduler (branch: patch-1)
  https://github.com/bluelovers/sd-webui-agent-scheduler/tree/patch-1
- sd-webui-bilingual-localization
  https://github.com/bluelovers/sd-webui-bilingual-localization

# Extension

- make pnginfo readable
  https://github.com/bluelovers/sd-webui-pnginfo-beautify
- *recommend install this if u want upload image to civitai*
  https://github.com/bluelovers/sd-webui-pnginfo-injection

# SYNTAX

Learn the syntax

- https://github.com/adieyal/sd-dynamic-prompts/blob/main/docs/SYNTAX.md

# Credits (Requirement to Install)

We appreciate the contributions of these amazing creators who made wildcards:

- (civitai user: C0rn_Fl4k3s)
  https://civitai.com/user/C0rn_Fl4k3s/models
- (Billions of Wildcards on civitai)
  https://civitai.com/models/138970/billions-of-wildcards-character-vehicle-scenery-building-creature-scifi-fantasy-magic-all-you-want

# Other Wildcards

We appreciate the contributions of these amazing creators who made wildcards:

- ~~(Wildcards Vision Background Around the World)~~
  ~~https://civitai.com/models/934903~~
- (Chara Creator Wildcards)
  https://civitai.com/models/863333
- (Misc Wildcards Vault)
  https://civitai.com/models/272654?modelVersionId=317312

# Node.js

- [sd-wildcards-utils](https://www.npmjs.com/package/sd-wildcards-utils) - Parse Stable Diffusion wildcards source to a YAML object.
