import fs from 'fs'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'
import rehypeImageFigure from './index.js'

main()

async function main() {
  const file = await unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeStringify)
    .use(rehypeImageFigure)
    .process(fs.readFileSync('./__example__/1.md'))

  console.log(String(file))
}