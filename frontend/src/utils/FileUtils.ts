import JSZip from "jszip";

export function getBytesFromFile(file: File): Promise<Array<number>> {
    return new Promise<Array<number>>((resolve, reject) => {
        file.stream().getReader().read().then((result) => {
            let byteArray = new Array<number>()
            // @ts-ignore
            if(result.value != undefined) {
                result.value.forEach((value) => {
                    byteArray.push(value)
                })
            }
            resolve(byteArray)
        })
    })
}

export function readZipFile(file: File): Promise<Map<string, string>> {
    return new Promise<Map<string, string>>((resolve, reject) => {
        let map = new Map<string, string>()
        JSZip.loadAsync(file).then(function(zip) {
            let mapSize = Object.keys(zip.files).length
            Object.keys(zip.files).forEach(function(filename){
                zip.files[filename].async('base64').then(function (fileData) {
                    map.set(filename, fileData)
                    if(map.size == mapSize) {
                        resolve(map)
                    }
                }).finally(() => {
                })
            });
        }).catch(reason => {
            reject("Error")
        })
    })
}