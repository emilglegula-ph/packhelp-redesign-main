export { default as imgZoomOut } from './imgFrame.svg'
export { default as imgZoomIn } from './imgFrame1.svg'
export { default as imgSlider } from './imgSlider.svg'
export { default as imgLogo } from './imgLogo.svg'
export { default as imgChevron } from './imgVector2.svg'
export { default as imgSamples } from './imgVector3.svg'

export { default as imgFoldingBox } from './imgFrame6226.png'
export { default as imgRigidBox } from './Rigid_Box.png'
export { default as imgMailerBox } from './Mailer_Box.png'
export { default as imgShippingBox } from './Shipping_Box.png'

export { default as imgConstructionClassic } from './constructionClassic.svg'
export { default as imgConstructionHanging } from './constructionHanging.svg'
export { default as imgConstructionWithLid } from './constructionWithLid.svg'
export { default as imgConstructionWithHandle } from './constructionWithHandle.svg'
export { default as imgConstructionGable } from './constructionGable.svg'

export { default as imgClosureSnapLock } from './imgGroup4198.svg'
export { default as imgClosureAutoLock } from './imgGroup4199.svg'
export { default as imgClosureReverseTuck } from './imgGroup4200.svg'

export { default as imgWindowKraft } from './imgFrame6226.png'
export { default as imgWindow } from './imgFrame6229.png'
export { default as imgPerforation } from './imgFrame6230.png'

export { default as imgMaterialKraft } from './imgFrame6231.png'
export { default as imgMaterialWhite } from './imgFrame6232.png'
export { default as imgMaterialPremiumWhite } from './imgFrame6233.png'

export { default as imgPrintCustom } from './imgFrame6234.png'
export { default as imgPrintPlain } from './imgFrame6232.png'

export { default as imgCoverageOutside } from './imgFrame6235.png'
export { default as imgCoverageOutsideInside } from './imgFrame6236.png'

// ?inline: this is the only asset loaded via THREE.useTexture() (3D box
// material). THREE sets crossOrigin on the <img> it creates for WebGL
// textures, which turns file:// image loads into CORS-checked requests that
// Chrome always rejects (file:// origin is "null"). Inlining as a data: URI
// sidesteps that — see the same reasoning in HdriEnvironment.tsx.
export { default as imgKraftTexture } from './kraft-texture.jpg?inline'
