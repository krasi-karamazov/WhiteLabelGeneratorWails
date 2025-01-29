import {FileWithPath} from "@mantine/dropzone";

export function checkForErrors(appName: string,
                             appPackage: string,
                             zipFile: FileWithPath,
                             jsonFile: FileWithPath): String[] {
    let errors = new Array<String>()
    if(appName.length == 0) {
        errors.push("The application name cannot be empty")
    }
    if(appPackage.length == 0) {
        errors.push("The application package cannot be empty")
    }

    /*if(zipFile == null) {
        errors.push("You need to add a zip file with the app icons")
    }*/

    if(jsonFile == null) {
        errors.push("You need to add a json file with the google services data")
    }
    return errors
}