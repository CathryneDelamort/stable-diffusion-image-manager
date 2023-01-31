#!/usr/bin/env node

const { resolve } = require('path')
const { readdirSync, writeFileSync } = require('fs')

const IMAGE_PATH = resolve(__dirname, '../public/images')


const fileMetadata = readdirSync(IMAGE_PATH).reduce((acc, file) => {
    if(file.match(/\.png$/)) {
        const [
            seed,
            prompt,
            styles,
            model,
            sampler,
            steps,
            cfg,
            width,
            height
        ] = file.replace(/(\.png)+$/, '').split('---')
        if(seed && prompt && styles && model && sampler && steps && cfg && width && height) {
            const metaData = { file, seed, prompt: prompt.replace(/_/g, ' '), styles, model, sampler, steps, cfg, width, height }
            return acc.concat([metaData])
        }
    }
    return acc
}, [])

writeFileSync(resolve(__dirname, '../public/metadata.json'), JSON.stringify(fileMetadata, null, 2))