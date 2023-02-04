import { createContext, PropsWithChildren, useContext, useState } from 'react'
import { sortBy } from 'sort-by-typescript'
import { findBestMatch } from 'string-similarity'
import type { ImageData } from '../types/ImageData.type'
import { useFolder } from '../DataProvider'
import { useSearch } from './Options/Search'
import { useSearchParams } from 'react-router-dom'

const ImageContext = createContext({
  images: [] as ImageData[],
  filteredImages: [] as ImageData[],
  setImages: (images: ImageData[]) => {},
  loadImages: () => {},
  checkedImages: [] as string[],
  setCheckedImages: (images: string[]) => {},
  imagesAreLoading: true,
  moveImages: (imageFiles: string[], to: string) => {},
  filters: [] as [keyof ImageData, string][],
  hideDetails: false,
  setHideDetails: (showDetails: boolean) => {}
})

export const ImagesProvider = ({ children }: PropsWithChildren) => {
  const [images, setImages] = useState<ImageData[]>([])
  const [searchParams, setSearchParams] = useSearchParams()
  const [hideDetails, setHideDetails] = useState(Boolean(searchParams.get('hideDetails')))
  const [imagesAreLoading, setImagesAreLoading] = useState(true)
  const [folder] = useFolder()
  const [search] = useSearch()
  const [checkedImages, setCheckedImages] = useState<string[]>([])
  const sort = searchParams.get('sort') || '-created'
  
  const loadImages = (markAsLoading = true) => {
    if(markAsLoading) setImagesAreLoading(true)
    fetch('/api/images?folder=' + folder).then(r => r.json())
      .then(images => {
        setImages(images)
        setImagesAreLoading(false)
      })
  }

  const moveImages = (imageFiles: string[], to: string) => {
    setImages(images.filter(({ file }) => imageFiles.indexOf(file) == -1))
    fetch('/api/move', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json'},
      body: JSON.stringify({ from: folder, to, images: imageFiles })
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
      (passing, [key, value]) => passing && image[key] === value,
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
      hideDetails: hideDetails,
      setHideDetails: (showDetails: boolean) => {
        if(showDetails) searchParams.set('hideDetails', 'true')
        else searchParams.delete('hideDetails')
        setSearchParams(searchParams)
        setHideDetails(showDetails)
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

export const useCheckedImages = (): [string[], (images: string[]) => void] => {
  const ctx = useContext(ImageContext)
  return [ctx.checkedImages, ctx.setCheckedImages]
}

export const useLoadImages = (): [() => void, boolean] => {
  const ctx = useContext(ImageContext)
  return [ctx.loadImages, ctx.imagesAreLoading]
}

export const useHideDetails = (): [boolean, (showDetails: boolean) => void] => {
  const ctx = useContext(ImageContext)
  return [ctx.hideDetails, ctx.setHideDetails]
}

export const useMoveImages = () => useContext(ImageContext).moveImages