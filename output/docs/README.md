# Lazy Wildcards for Stable Diffusion

    lazy wildcards for create amazing images with powerful and flexible wildcards collections!

- (lazy-wildcards on civitai)
  https://civitai.com/models/449400
- (lazy-wildcards on github)
  https://github.com/bluelovers/sd-wildcards-utils

## Recommend install for unlock full power

- *dynamicprompts (recommend install this bugfix for unlock full power)*<br/>
  https://civitai.com/articles/6313/unofficial-dynamicprompts-bugfix
- *recommend install this if u want upload image to civitai*<br/>
  https://github.com/bluelovers/sd-webui-pnginfo-injection

## Prompts

```md
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
__lazy-wildcards/char/haircolor-multi__
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

## Background

```md
__lazy-wildcards/dataset/background__

# real-world-location
__lazy-wildcards/subject/env-bg-real-world-location*/*/prompts__, 

# background-color
__lazy-wildcards/dataset/background-color__
__lazy-wildcards/background/color-multi__, 
__lazy-wildcards/background/color-transparent__, 
```

### Moment / Weather

```md
{0.1::__lazy-wildcards/subject/moment/random/prompts__|}

__lazy-wildcards/subject/moment/*/prompts__, 
__lazy-wildcards/subject/moment/random/prompts__, 
__lazy-wildcards/subject/moment/weather/prompts__, 
```

## World_Morph showcase

```md
# with tweak for showcase
__lazy-wildcards/subject/scenes-showcase/World_Morph/prompts__,

# core
__lazy-wildcards/subject/env-bg/World_Morph/prompts__,
```

## Food

```md
# food style
__lazy-wildcards/subject/style-elem/food/prompts__, 

# food object
__lazy-wildcards/dataset/food-all-multi__, 
__lazy-wildcards/dataset/food-all__, 
```

## Festival

```md
__lazy-wildcards/subject/env-bg/christmas/prompts__,
```

## Style

### pixel

```md
__lazy-wildcards/subject/style-art-type/pixel-game-icon/prompts__,
```

### scenery

```md
__lazy-wildcards/utils/scenery-no-humans__, 
__lazy-wildcards/utils/scenery__, 

{0.2::__lazy-wildcards/utils/scenery__|}, 
```
