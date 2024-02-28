/* eslint-disable @typescript-eslint/no-dynamic-delete */
export const omitIsNil = (
  obj: any = {},
  deep: boolean = false
): any => {
  Object.keys(obj).forEach(key => {
    if (obj[key] == null) {
      delete obj[key]
    }
  })

  if (deep) {
    Object.keys(obj).forEach(key => {
      if (typeof obj[key] === 'object') {
        omitIsNil(obj[key], true)
      }
    })
  }

  return obj
}
