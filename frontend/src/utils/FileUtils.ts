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