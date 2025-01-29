import JSZip from "jszip";
import {LogPrint} from "../../wailsjs/runtime";

export function readFile(file: File): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsText(file)
        reader.onload = async (e) => {
            // @ts-ignore
            const text = (e.target.result).toString()
            return resolve(text)
        }
    })
}

export function readZipFile(file: File): Promise<Map<string, string>> {
    return new Promise<Map<string, string>>((resolve, reject) => {
        LogPrint("dkdjfkdjfkd")
        let map = new Map<string, string>()
        LogPrint(file.name)
        JSZip.loadAsync(file).then(function (zip) {

            let mapSize = Object.keys(zip.files).length
            LogPrint("mapSize")
            Object.keys(zip.files).forEach(function (filename) {
                LogPrint("zip.files")
                zip.files[filename].async('base64').then(function (fileData) {
                    LogPrint("zip.files.async")
                    map.set(filename, fileData)
                    if (map.size == mapSize) {
                        LogPrint("resolve")
                        resolve(map)
                    }
                }).finally(() => {
                    resolve(map)
                })
            });
        }).catch(reason => {
            reject("Error")
        })
    })
}