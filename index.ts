import { visit } from 'unist-util-visit'
import { h } from 'hastscript'

import type { Plugin } from 'unified'
import type { Element, ElementContent, Root } from 'hast'

export interface RehypeImageFigureOptions {
  className: string
}

const isImageElement = (el: ElementContent) => el.type === 'element' && el.tagName === 'img'

const rehypeImageFigure: Plugin<[RehypeImageFigureOptions?], Root> = (options) => {
  const className = (options && options.className) || 'rehype-img-figure'

  const buildFigure = ({ properties }: Element) => {
    const figure = h('figure', { class: className }, [
      h('img', { ...properties }),
      properties?.alt && (properties.alt as string).trim().length > 0
        ? h('figcaption', (properties.alt as string))
        : '',
    ])
    return figure
  }

  return (tree) => {
    visit(tree, { tagName: 'p' }, (node, index) => {
      const images = node.children.filter(n => isImageElement(n)) as Element[]

      if (images.length === 0 || index === null) return

      if (images.length === 1 && node.children.length === 1) {
        tree.children[index] = buildFigure(images[0])
      } else {
        node.children.forEach((child, index) => {
          if (isImageElement(child)) {
            node.children[index] = buildFigure(child as Element)
          }
        })
        tree.children[index] = h('div', node.children)
      }
    })
  }
}

export default rehypeImageFigure
