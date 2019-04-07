import * as animflow from "./index"

export function locale(translation: any = {}) {
  if (translation === "sv") {
    translation = require("./locale/locale-sv.json")
  }
  return lang(animflow, undefined, translation)
}

function lang(target: any, owner: any, translation: any): any {
  if (target._lang) {
    return target._lang
  }
  if (typeof target === "object") {
    target._lang = new Proxy(target, {
      get(target: any, p: string) {
        if (!translation[p]) {
          return target[p]
        }
        return lang(target[translation[p]], target, translation)
      }
    })
    return target._lang
  }
  if (typeof target === "function") {
    target._lang = new Proxy(target, {
      apply(target: any, thisArg: any, argArray?: any) {
        let result = target.apply(owner, argArray)
        if (result) {
          return lang(result, owner, translation)
        }
        return result
      }
    })
    return target._lang
  }
}