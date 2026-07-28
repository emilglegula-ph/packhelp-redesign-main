import {
  imgFoldingBox,
  imgRigidBox,
  imgMailerBox,
  imgShippingBox,
  imgConstructionClassic,
  imgConstructionHanging,
  imgConstructionWithLid,
  imgConstructionWithHandle,
  imgConstructionGable,
  imgClosureSnapLock,
  imgClosureAutoLock,
  imgClosureReverseTuck,
  imgWindowKraft,
  imgWindow,
  imgPerforation,
  imgMaterialKraft,
  imgMaterialWhite,
  imgMaterialPremiumWhite,
  imgPrintCustom,
  imgPrintPlain,
  imgCoverageOutside,
  imgCoverageOutsideInside,
} from '../assets/figma'

export type ChipFit = 'cover' | 'icon' | 'empty'

export interface ChipOption {
  id: string
  label: string
  image?: string
  fit: ChipFit
}

export const boxTypeOptions: ChipOption[] = [
  { id: 'folding', label: 'Folding Box', image: imgFoldingBox, fit: 'cover' },
  { id: 'rigid', label: 'Rigid Box', image: imgRigidBox, fit: 'cover' },
  { id: 'mailer', label: 'Mailer Box', image: imgMailerBox, fit: 'cover' },
  { id: 'shipping', label: 'Shipping Box', image: imgShippingBox, fit: 'cover' },
]

export const constructionOptions: ChipOption[] = [
  { id: 'classic', label: 'Classic', image: imgConstructionClassic, fit: 'cover' },
  { id: 'hanging', label: 'Hanging', image: imgConstructionHanging, fit: 'cover' },
  { id: 'with-lid', label: 'With Lid', image: imgConstructionWithLid, fit: 'cover' },
  { id: 'with-handle', label: 'With Handle', image: imgConstructionWithHandle, fit: 'cover' },
  { id: 'gable', label: 'Gable', image: imgConstructionGable, fit: 'cover' },
]

export const closureOptions: ChipOption[] = [
  { id: 'snap-lock', label: 'Snap lock', image: imgClosureSnapLock, fit: 'icon' },
  { id: 'auto-lock', label: 'Auto lock', image: imgClosureAutoLock, fit: 'icon' },
  { id: 'reverse-tuck', label: 'Reverse Tuck...', image: imgClosureReverseTuck, fit: 'icon' },
]

export const windowsOptions: ChipOption[] = [
  { id: 'kraft', label: 'Kraft', image: imgWindowKraft, fit: 'cover' },
  { id: 'window', label: 'Window', image: imgWindow, fit: 'cover' },
  { id: 'perforation', label: 'Perforation', image: imgPerforation, fit: 'cover' },
  { id: 'crease-line', label: 'Crease line', fit: 'empty' },
]

export const materialColorOptions: ChipOption[] = [
  { id: 'kraft', label: 'Kraft', image: imgMaterialKraft, fit: 'cover' },
  { id: 'white', label: 'White', image: imgMaterialWhite, fit: 'cover' },
  { id: 'premium-white', label: 'Premium white', image: imgMaterialPremiumWhite, fit: 'cover' },
]

export const printOptions: ChipOption[] = [
  { id: 'custom', label: 'Custom', image: imgPrintCustom, fit: 'cover' },
  { id: 'plain', label: 'Plain', image: imgPrintPlain, fit: 'cover' },
]

export const printCoverageOptions: ChipOption[] = [
  { id: 'outside', label: 'Outside', image: imgCoverageOutside, fit: 'cover' },
  { id: 'outside-inside', label: 'Outside + Inside', image: imgCoverageOutsideInside, fit: 'cover' },
]

export const finishOptions = [
  { id: 'goss', label: 'Goss' },
  { id: 'matt', label: 'Matt' },
]
