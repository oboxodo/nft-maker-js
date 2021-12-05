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
        { name: 'Yellow', weight: 20, incompatible: { Background: ['Midnight'] } },
      ],
    },
  ],
}

const { traits } = testConfig
const foregroundTrait = traits[1]
const redForeground = foregroundTrait.items[0]
const yellowForeground = foregroundTrait.items[2]

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

  it('confirms a proposed trait is incompatible using conflicts closure', async () => {
    let existingIncompatible = { Background: 'Midnight' }

    let result = traitIsCompatibleWithCurrentImage(
      foregroundTrait,
      redForeground,
      existingIncompatible
    )

    expect(result).toBe(false)
  })

  it('confirms a proposed trait is incompatible using incompatible rule', async () => {
    let existingIncompatible = { Background: 'Midnight' }

    let result = traitIsCompatibleWithCurrentImage(
      foregroundTrait,
      yellowForeground,
      existingIncompatible
    )

    expect(result).toBe(false)
  })
})
