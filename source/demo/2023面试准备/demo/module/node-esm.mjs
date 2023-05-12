
console.log(import.meta.url)

import { fileURLToPath } from 'url'
import { dirname } from 'path'

console.log(fileURLToPath(import.meta.url))

console.log(dirname(fileURLToPath(import.meta.url)))


