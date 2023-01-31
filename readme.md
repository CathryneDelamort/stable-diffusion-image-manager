# Stable Diffusion Image Manager

This self-hosted app makes it easy to view and compare images generated with Stable Diffusion, specifically designed to work with [AUTOMATIC1111/stable-diffusion-webui](https://github.com/AUTOMATIC1111/stable-diffusion-webui). It is inspired by the [image history extension](https://github.com/yfszzx/stable-diffusion-webui-images-browser) extension, but is currently a stand-alone application rather than fully integrated into [stable-diffusion-webui](https://github.com/AUTOMATIC1111/stable-diffusion-webui) as an extension. That _may_ happen in the future, but no promises.

## Features

* Sort images by creation time, seed, prompt, number of steps, etc.
* Group images into different folders
* Filter images by prompt keywords
* Filter to show only images for a given seed or sampler
* View image metadata under each one and quickly filter by any aspect

## Prerequisites

1. [NodeJS](https://nodejs.org/) must be installed on your machine. This was
developped and tested on `v19.2.0`, but other versions will likely work as well.
2. [Yarn](https://yarnpkg.com/) must be [installed](https://yarnpkg.com/getting-started/install)
on your machine. This was developed and tested on `v3.3.0`, but other versions
may work as well. You can _probably_ also use `npm` or `pnpm` with this project, but I haven't tried. 🤷‍♀️
3. Clone the code in this repository to your machine using `git` or by
downloading and extracting a `zip` file of the contents.
4. Install dependencies by running `yarn` within the root of this repository on your machine.
5. Enable storing of image data in text files (if you haven't already):
    1. Go to the the "Settings" tab of [stable-diffusion-webui](https://github.com/AUTOMATIC1111/stable-diffusion-webui) and go to the "Saving images/grids" section
    2. Check `Create a text file next to every image with generation parameters`
    3. Apply the settings
6. Connect your Stable Diffusion output folder to the `public/images` folder of this repository by:
    * Option 1: Setting Stable Diffusion to output to `public/images`
        1. Create an `images` folder under the `public` folder of this repository
        1. Go to the the "Settings" tab of [stable-diffusion-webui](https://github.com/AUTOMATIC1111/stable-diffusion-webui) and go to the "Paths for saving" section
        2. Enter the full path on your machine to the `public/images` folder in this repository 
            * Example: `/home/your-username/repos/stable-diffusion-image-manager/public/images`)
    * Option 2: Create a symlink at `public/images` pointing to your existing output folder
        * Example on linux: `ln -s /home/your-username/stable-diffusion-webui/outputs/txt2-img-images public/images`
7. Generate some new images and ensure they show up in `public/images` along with their associated `.txt` file

## Starting the Application

1. Open a terminal and navigate to the folder to which you cloned or extracted 
the code from this repository.
2. Run `yarn start` in the terminal and wait until you see `Local: http://localhost:5173/` in the output
3. Open your web browser to http://localhost:5173/

## Planned Features

The following features are planned in the approximate order they are listed:

* Multi-dimensional grid to easily compare seed, prompt, sampler, steps, etc. 
* Online demo
* Read PNG metadata from image files themselves instead of from text files
* Add notes and custom tags to images that can be use for searching and filtering
* Configuration option to specify location of images folder
* Docker container for easier use and installation on servers
