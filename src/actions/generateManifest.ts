import fs from 'fs'
import { resolveConfiguration, validUnique } from '../util'
import { castArray, shuffle, times } from 'lodash'
import { getRandomWeightedTrait } from '../lib'
import { TraitCategory } from '../defs'

let imageData: any = []
let attempts = 0

export default function () {
  const { traits, uniques, editionSize } = resolveConfiguration()

  prepareOutputFolder()

  uniques.forEach((u: object) => {
    if (validUnique(u)) {
      imageData.push(u)
    }
  })

  times(editionSize - uniques.length, () =>
    imageData.push(createNewUniqueImage(traits))
  )

  imageData = shuffle(imageData)

  // Assign token IDs...
  imageData = imageData.map((item: any, key: number) => {
    item['tokenId'] = key + 1
    return item
  })

  fs.writeFileSync('./manifest.json', JSON.stringify(imageData, null, 2), {
    flag: 'w',
  })
}

function prepareOutputFolder() {
  let assetsDir = './assets'

  if (fs.existsSync(assetsDir)) {
    fs.rmdirSync(assetsDir, { recursive: true })
  }
}

function isCompatible(newImage: { [index: string]: any }) {
  const { traits } = resolveConfiguration()

  return Object.keys(newImage).reduce((carry, key) => {
    let trait = traits.filter((trait: TraitCategory) => trait.name == key)[0]
    let traitOption = trait.items.filter(
      // @ts-ignore
      (item: any) => item.name === newImage[key]
    )[0]

    if (!traitOption.hasOwnProperty('incompatible')) {
      return carry
    }

    return Object.keys(traitOption.incompatible).reduce(
      (innerCarry: boolean, incompatKey: string) => {
        let incompatValue = castArray(traitOption.incompatible[incompatKey])

        // @ts-ignore
        if (
          incompatValue.includes(newImage[incompatKey]) ||
          incompatValue.includes('*')
        ) {
          return false
        }

        return innerCarry
      },
      carry
    )
  }, true)
}

let maxNumberOfAttempts = 400

export function createNewUniqueImage(traits: Array<TraitCategory>): object {
  attempts++

  console.log(attempts)

  if (attempts >= maxNumberOfAttempts) {
    throw Error()
  }

  let newImage = createNewImage(traits)

  if (!imageData.includes(newImage) && isCompatible(newImage)) {
    return newImage
  }

  return createNewUniqueImage(traits)
}

export function createNewImage(traits: Array<TraitCategory>) {
  const { order } = resolveConfiguration()
  let tmp = {}

  order.forEach((trait: string) => {
    // @ts-ignore
    tmp[trait] = getRandomWeightedTrait(traits, trait)
  })

  return tmp
}
