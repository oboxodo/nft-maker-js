import { traitIsCompatibleWithCurrentImage } from '../src/actions/generateManifest'

jest.mock('../src/util')

const testConfig = {
  name: 'Hemp',
  description: 'Sexy NFTs',
  maxAttempts: 40,
  sellerFeeBasisPoints: 500,
  creators: [
    {
      address: '1234567890',
      share: 100,
    },
  ],
  collection: {
    name: 'Hemp (1st Edition)',
    family: 'Hemp',
  },
  traits: [
    {
      name: 'Background',
      items: [
        { name: 'Midnight', weight: 20 }, // Not compatible
        { name: 'Blue', weight: 20 }, // Compatible
      ],
    },

    {
      name: 'Foreground',
      items: [
        { name: 'Red', weight: 20,
          conflicts: (traitName: string, traitValue: string) => {
            return traitName == "Background" && traitValue == "Midnight"
          }
        },
        { name: 'White', weight: 20 },
      ],
    },
  ],
}

const { traits } = testConfig
const foregroundTrait = traits[1]
const redForeground = foregroundTrait.items[0]

describe('traitIsCompatibleWithCurrentImage', () => {
  it('confirms a proposed trait is compatible', async () => {
    let existingCompatible = { Background: 'Blue' }

    let result = traitIsCompatibleWithCurrentImage(
      foregroundTrait,
      redForeground,
      existingCompatible
    )

    expect(result).toBe(true)
  })

  it('confirms a proposed trait is incompatible', async () => {
    let existingIncompatible = { Background: 'Midnight' }

    let result = traitIsCompatibleWithCurrentImage(
      foregroundTrait,
      redForeground,
      existingIncompatible
    )

    expect(result).toBe(false)
  })
})
