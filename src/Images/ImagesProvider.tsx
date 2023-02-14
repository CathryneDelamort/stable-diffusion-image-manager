import { createContext, PropsWithChildren, useContext, useState } from 'react'
import { sortBy } from 'sort-by-typescript'
import { findBestMatch } from 'string-similarity'
import type { ImageData } from '../types/ImageData.type'
import { useFolder } from '../DataProvider'
import { useSearch } from './Options/Search'
import { useSearchParams } from 'react-router-dom'
import { vars } from '../styles.css'

type DisplaySize = keyof typeof vars.width

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ImageContext = createContext(null as any)

export const ImagesProvider = ({ children }: PropsWithChildren) => {
  const [images, setImages] = useState<ImageData[]>([])
  const [viewerIndex, setViewerIndex] = useState(-1)
  const [searchParams, setSearchParams] = useSearchParams()
  const [show, setShow] = useState(searchParams.getAll('show'))
  const [imagesAreLoading, setImagesAreLoading] = useState(true)
  const [folder] = useFolder()
  const [search] = useSearch()
  const [checkedImages, setCheckedImages] = useState<ImageData[]>([])
  const sort = searchParams.get('sort') || '-created'
  const [displaySize, setDisplaySize] = useState((searchParams.get('displaySize') || 'md') as DisplaySize)
  
  // TODO: Make these dynamic
  const folders = ['', 'review', 'queue', 'archive']

  const loadImages = (markAsLoading = true) => {
    if(markAsLoading) setImagesAreLoading(true)
    if(folder == '_ALL_') {
      Promise.all(folders.map(f =>
        fetch('/api/images?folder=' + f).then(r => r.json())
      ))
        .then(images => {
          setImages(images.reduce((acc, imgs) => acc.concat(imgs), []))
          setImagesAreLoading(false)
        })
    }
    else {
      fetch('/api/images?folder=' + folder).then(r => r.json())
        .then(images => {
          setImages(images)
          setImagesAreLoading(false)
        })
    }
  }

  const moveImages = (imagesToMove: ImageData[], to: string) => {
    if(folder != '_ALL_') {
      setImages(images.filter(
        image => !imagesToMove.find(i => JSON.stringify(i) == JSON.stringify(image))
      ))
    }
    fetch('/api/move', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json'},
      body: JSON.stringify({ to, images: imagesToMove })
    })
      .then(() => loadImages(false))
  }

  const filters = Array.from(searchParams)
    .filter(([key]) => key.match(/^filter-/))
    .map(([key, value]) => [key.replace(/^filter-/, ''), value]) as Array<[keyof ImageData, string]>

  const filteredImages = images.filter((image: ImageData) => {
    const searchTargets = image.prompt?.toLowerCase().split(' ') || []
    const searchSanitized = search.replace(/^\s*/, '').replace(/\s*$/, '').toLowerCase()
    const promptWords = searchSanitized.split(' ')
    const searchTests = promptWords.filter(word => word.length > 2)
      .map(word => word.match(/^-/) // word should not be present?
        ? .6 - findBestMatch(word, searchTargets).bestMatch.rating
        : findBestMatch(word, searchTargets).bestMatch.rating
      )
    return (
      searchTests.length == 0 || // there is nothing to search
      (searchSanitized.match(/^\d/) && image.seed.match(searchSanitized)) || //match seed
      Math.min(...searchTests) > .4
    ) &&
    filters.reduce(
      (passing, [key, value]) => passing && image[key] == value,
      true
    )
  }).sort(sortBy(sort))

  return (
    <ImageContext.Provider value={{ 
      images,
      filteredImages,
      setImages,
      loadImages,
      checkedImages,
      setCheckedImages,
      imagesAreLoading,
      moveImages,
      filters,
      displaySize,
      setDisplaySize: (displaySize: DisplaySize) => {
        searchParams.set('displaySize', displaySize)
        setSearchParams(searchParams)
        setDisplaySize(displaySize)
      },
      show: show,
      setShow: (newShow: string[]) => {
        searchParams.delete('show')
        newShow.forEach(s => searchParams.append('show', s))
        setSearchParams(searchParams)
        setShow(newShow)
      },
      viewerIndex,
      setViewerIndex: (index: number) => {
        setViewerIndex(index)
      },
      setViewerImage: (image: ImageData | boolean) => {
        if(image) {
          setViewerIndex(filteredImages.map(i => JSON.stringify(i)).indexOf(JSON.stringify(image)))
        }
        else setViewerIndex(-1)
      }
    }}>
      {children}
    </ImageContext.Provider>
  )
}

export const useImages = (): [ImageData[], (images: ImageData[]) => void] => {
  const ctx = useContext(ImageContext)
  return [ctx.images, ctx.setImages]
}

export const useFilteredImages = () => useContext(ImageContext).filteredImages

export const useFilters = () => useContext(ImageContext).filters

export const useCheckedImages = (): [ImageData[], (images: ImageData[]) => void] => {
  const ctx = useContext(ImageContext)
  return [ctx.checkedImages, ctx.setCheckedImages]
}

export const useLoadImages = (): [() => void, boolean] => {
  const ctx = useContext(ImageContext)
  return [ctx.loadImages, ctx.imagesAreLoading]
}

export const useMoveImages = () => useContext(ImageContext).moveImages

export const useDisplaySize = (): [DisplaySize, (displaySize: DisplaySize) => void] => {
  const ctx = useContext(ImageContext)
  return [ctx.displaySize, ctx.setDisplaySize]
}

export const useShow = () => {
  const [show] = useShowState()
  return (type: string) => show.indexOf(type) > -1
}

export const useShowState = (): [string[], (hide: string[]) => void] => {
  const ctx = useContext(ImageContext)
  return [ctx.show, ctx.setShow]
}

export const useViewerIndex = (): [number, (index: number) => void] => {
  const ctx = useContext(ImageContext)
  return [ctx.viewerIndex, ctx.setViewerIndex]
}

export const useSetViewerImage = (): (image: ImageData | boolean) => void =>
  useContext(ImageContext).setViewerImage

export const useViewerImage = (): ImageData | false => {
  const [viewerIndex] = useViewerIndex()
  const filteredImages = useFilteredImages()
  return viewerIndex > -1
    ? filteredImages[viewerIndex]
    : false
}