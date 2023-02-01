import express, { Request, Response } from 'express'
import bodyParser from 'body-parser'
import { mkdirSync, renameSync, readFileSync, readdirSync, statSync } from 'fs'
import type { ImageData } from './src/types/ImageData.type'
import { join } from 'path'
import { existsSync } from 'fs'

const app = express()
app.use(bodyParser.json())

const moveImage = (file: string, dest: string) => {
  try {
    renameSync(join('public', file), join(dest + '/' + file))
    const txtFile = file.replace(/\.png/, '.txt')
    if(existsSync('public/' + txtFile)) {
      renameSync('public/' + txtFile, dest + '/' + txtFile)
    }
  }
  catch(e) {
    console.log('Error deleting', file)
    console.log(e)
  }
}

const readFolder = (folder: string) => {
  const IMAGE_PATH = join('./public/', folder)
  mkdirSync(IMAGE_PATH, { recursive: true })
  return readdirSync(IMAGE_PATH).reduce((acc, file) => {
      if(file.match(/\.png$/)) {
          const txtPath = join(IMAGE_PATH, file).replace(/\.png/, '.txt')
          if(existsSync(txtPath)) {
              const lines = readFileSync(txtPath, {encoding:'utf8', flag:'r'}).split('\n')
              try {
                  const details = lines.reduce(
                      (acc, line) => acc.concat(line.split(', ')),
                      [] as string[]
                  )
                  const size = details[5]?.replace(/Size: /, '')
                  const getDetail = (field: string) => (details.find((s: string) => s.match(`^${field}: `)) || '')
                    .replace(new RegExp(`^${field}: `), '')
                    .replace(/(\s|\r|\n)+$/, '')
                  const [width, height] = size.split('x')
                  const metaData = {
                      file,
                      seed: getDetail('Seed'),
                      prompt: lines[0],
                      negativePrompt: lines[1].replace(/^Negative prompt\s/, ''),
                      model: getDetail('Model hash'),
                      sampler: getDetail('Sampler'),
                      steps: parseInt(getDetail('Steps')),
                      cfg: parseFloat(getDetail('CFG scale')),
                      width,
                      height,
                      size,
                      created: statSync(txtPath).ctimeMs,
                      denoise: getDetail('Denoising strength'),
                      details
                  }
                  return acc.concat([metaData])
              }
              catch(e) {
                  console.log('Error reading', txtPath)
                  console.log(lines)
              }
          }
      }
      return acc
  }, [] as ImageData[])
}

app.get('/api/images', (req: Request, res: Response) => {
  const images = readFolder(req.query.folder + '' || 'images');
  res.send(JSON.stringify(images))
})

app.post('/api/move', ({ body: { from, to, images }}: Request, res: Response) => {
  const fromDir = join('public', from)
  const toDir = join('public', to)
  mkdirSync(toDir, { recursive: true})
  images.forEach((file: string) => {
    try {
      renameSync(join(fromDir, file), join(toDir, file))
      const txtFile = file.replace(/\.png/, '.txt')
      if(existsSync(join(fromDir, txtFile))) {
        renameSync(join(fromDir, txtFile), join(toDir, txtFile))
      }
    }
    catch(e) {
      console.log('Error moving', file)
      console.log(e)
    }
  })
  res.send('res:' + JSON.stringify(images))
})

export const handler = app