# Stable Diffusion Images Browser

This self-hosted app makes it easy to view and compare images generated with
[AUTOMATIC1111/stable-diffusion-webui](https://github.com/AUTOMATIC1111/stable-diffusion-webui).
It is inspired by the [image history extension](https://github.com/yfszzx/stable-diffusion-webui-images-browser) extension, but is currently a stand-alone
application rather than fully integrated into [stable-diffusion-webui](https://github.com/AUTOMATIC1111/stable-diffusion-webui) as an extension. That _may_ happen in the
future, but no promises.

## Features

* Sort images by creation time, seed, prompt, number of steps, etc.
* Filter images by prompt keywords
* Filter to show only images for a given seed or sampler
* Currently detects image settings from filename (see [prerequisites](#prerequisites) below) -- reading directly from image files like the [image history extension](https://github.com/yfszzx/stable-diffusion-webui-images-browser) does is planned soon

## Prerequisites

1. [NodeJS](https://nodejs.org/) must be installed on your machine. This was
developped and tested on `v19.2.0`, but other versions will likely work as well.
2. [Yarn](https://yarnpkg.com/) must be [installed](https://yarnpkg.com/getting-started/install)
on your machine. This was developed and tested on `v3.3.0`, but other versions
may work as well.
3. Clone the code in this repository to your machine using `git` or by
downloading and extracting a `zip` file of the contents.
4. In the [stable-diffusion-webui](https://github.com/AUTOMATIC1111/stable-diffusion-webui)
Settings tab under `Saving images/grids`:
    1. Set `Images filename pattern` to:
        ```
        [seed]---[prompt]---[styles]---[model_name]---[sampler]---[steps]---[cfg]---[width]---[height]---[datetime<%Y%m%d_%H%M%S>].png
        ```
    2. Uncheck `Add number to filename when saving`. This is designed to prevent
    overwriting things, but we're using the `datetime` down to the second to handle that.
    3. Apply the settings
5. Generate some new images with the new filename format from step 4 and check 
that they're named with pattern or rename some existing images manually to follow
that naming pattern.
6. Move 

## Starting the Application

1. Open a terminal and navigate to the folder to which you cloned or extracted 
the code from this repository.
2. Run `yarn start` in the terminal and wait until you see `Local: http://localhost:5173/` in the output
3. Open your web browser to http://localhost:5173/

## Planned Features

The following features are planned in the approximate order they are listed:

* Multi-dimensional grid to easily compare seed, prompt, sampler, steps, etc. 
* Online demo
* Read PNG metadata from image files themselves instead of from the image filenames
* Delete unwanted images from within app interface
* Add notes and custom tags to images that can be use for searching and filtering
* Configuration option to specify location of images folder
* Docker container for easier use and installation on servers

## Planned Internal Enhancements

* Implement styling and theming using [vanilla-extract](https://vanilla-extract.style/)
