import express, { Request, Response } from 'express'
import bodyParser from 'body-parser'
import {
  mkdirSync,
  renameSync,
  readFileSync,
  readdirSync,
  statSync,
  lstatSync,
  symlinkSync,
  unlinkSync,
  writeFileSync
} from 'fs'
import type { ImageData } from './src/types/ImageData.type'
import { join } from 'path'
import { existsSync } from 'fs'
import defaultSettings from './src/settings.default.json'
import SettingsView from './src/SettingsView'

const SETTINGS_FILE_PATH = './settings.json'
const PUBLIC_IMAGE_DIR = './public/images'

const readSettings = () => {
  if (!existsSync(SETTINGS_FILE_PATH)) writeSettings(defaultSettings)
  return JSON.parse(readFileSync(SETTINGS_FILE_PATH, 'utf-8'))
}
const writeSettings = (settings: any) => writeFileSync(SETTINGS_FILE_PATH, JSON.stringify(settings, null, 2))

const app = express()
app.use(bodyParser.json({ limit: '1mb' }))

const readFolder = (folder: string) => {
  try {
    const IMAGE_PATH = join(PUBLIC_IMAGE_DIR, folder)
    updateImagesSymlink()
    mkdirSync(IMAGE_PATH, { recursive: true })
    return readdirSync(IMAGE_PATH).reduce((acc, file) => {
      if (file.match(/\.png$/)) {
        const txtPath = join(IMAGE_PATH, file).replace(/\.png/, '.txt') + ''
        const lines = existsSync(txtPath)
          ? readFileSync(txtPath, { encoding: 'utf8', flag: 'r' }).split('\n')
          : []
        try {
          const details = lines.reduce(
            (acc, line) => acc.concat(line.split(', ')),
            [] as string[]
          )
          const getDetail = (field: string) => (details.find((s: string) => s.match(`^${field}: `)) || '')
            ?.replace(new RegExp(`^${field}: `), '')
            ?.replace(/(\s|\r|\n)+$/, '') || ''
          const size = getDetail('Size')
          const [width, height] = (size?.split('x') || ['', '']).map(parseInt)
          const metaData = {
            cfg: parseFloat(getDetail('CFG scale')),
            checkpoint: getDetail('Model'),
            created: statSync(join(IMAGE_PATH, file)).ctimeMs,
            denoise: parseFloat(getDetail('Denoising strength')),
            faceRestoration: getDetail('Face restoration'),
            file,
            folder,
            height,
            hiresUpscaler: getDetail('Hires upscaler'),
            prompt: lines[0],
            model: getDetail('Model hash'),
            negativePrompt: lines[1]?.match(/^Negative prompt/) && lines[1].replace(/^Negative prompt: /, '') || '', 
            seed: getDetail('Seed'),
            sampler: getDetail('Sampler'),
            steps: parseInt(getDetail('Steps')),
            width,
            size
          }
          return acc.concat([metaData])
        }
        catch (e) {
          console.log('Error reading', txtPath)
          console.log(lines)
          console.log(e)
        }
      }
      return acc
    }, [] as ImageData[])
  }
  catch(e) {
    console.log(e)
    throw e
  }
}

const updateImagesSymlink = () => {
  try {
    const { imagePath } = readSettings()
    if (imagePath) {
      if (!existsSync(PUBLIC_IMAGE_DIR)) {
        symlinkSync(imagePath, PUBLIC_IMAGE_DIR, 'dir')
      }
      else if (lstatSync(PUBLIC_IMAGE_DIR).isSymbolicLink()) {
        unlinkSync(PUBLIC_IMAGE_DIR)
        symlinkSync(imagePath, PUBLIC_IMAGE_DIR, 'dir')
      }
    }
  }
  catch(e) {
    console.log(e)
    throw e
  }
}

app.get('/api/settings', (req: Request, res: Response) => {
  try {
    if (!existsSync(SETTINGS_FILE_PATH)) writeSettings(defaultSettings)
    updateImagesSymlink()
    res.send(JSON.stringify(readSettings()))
  }
  catch(e) {
    console.log(e)
    throw e
  }
})

const getFolders = (parent = ''): string[] => {
  console.log('reading', join(PUBLIC_IMAGE_DIR, parent))
  return readdirSync(join(PUBLIC_IMAGE_DIR, parent))
    .filter(f => statSync(join(PUBLIC_IMAGE_DIR, parent, f)).isDirectory())
    .map(f => join(parent, f))
    .reduce((acc, f) => {
      return acc.concat([f, ...getFolders(f)])
    }, [] as string[])
    .sort()
}

app.get('/api/folders', (req: Request, res: Response) => {
  try {
    updateImagesSymlink()
    res.send(JSON.stringify(getFolders()))
  }
  catch(e) {
    console.log(e)
    throw e
  }
})

app.post('/api/settings', (req: Request, res: Response) => {
  const { imagePath } = req.body
  if (existsSync(req.body.imagePath)) {
    writeSettings({ ...SettingsView, imagePath })
    updateImagesSymlink()
    res.send(JSON.stringify(readSettings()))
  }
  else {
    res.status(403)
    res.send(`Unable to find the directory "${imagePath}" on the system. Please check the file path and try again.`)
  }
})

app.get('/api/images', (req: Request, res: Response) => {
  try {
    const images = readFolder(req.query.folder + '')
    res.send(JSON.stringify(images))
  }
  catch(e) {
    console.log(e)
    throw e
  }
})

app.post('/api/move', ({ body: { to, images } }: Request, res: Response) => {
  const toDir = join(PUBLIC_IMAGE_DIR, to)
  mkdirSync(toDir, { recursive: true })
  images.forEach(({file, folder}: ImageData) => {
    const fromDir = join(PUBLIC_IMAGE_DIR, folder)
    try {
      renameSync(join(fromDir, file), join(toDir, file))
      const txtFile = file.replace(/\.png/, '.txt')
      if (existsSync(join(fromDir, txtFile))) {
        renameSync(join(fromDir, txtFile), join(toDir, txtFile))
      }
    }
    catch (e) {
      console.log('Error moving', file)
      console.log(e)
    }
  })
  res.send('res:' + JSON.stringify(images))
})

export const handler = app