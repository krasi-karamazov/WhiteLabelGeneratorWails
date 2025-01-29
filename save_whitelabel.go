package main

import (
	"encoding/base64"
	"os"
	"path/filepath"
	"strings"
)

func (a *App) Save(appName string, appPackage string, data []PropertiesData, googleServicesFileData string, colorsFileData string) *SaveError {
	var saveErrorPtr *SaveError = nil
	var errorType string
	err := writePropertiesData(appName, data)
	errorType = "write_props"
	err, errType := writeClientFlavor(appName, data)
	if err != nil {
		errorType = errType
	}

	err, errType = writeFile(appName, "google-services.json", googleServicesFileData)
	if err != nil {
		errorType = errType
	}

	lightColors, darkColors, err := parseColors(colorsFileData)
	if err != nil {
		return nil
	}

	err, errType = writeFile(appName, filepath.Join("res", "values", "colors.xml"), lightColors)
	if err != nil {
		errorType = errType
	}

	err, errType = writeFile(appName, filepath.Join("res", "values-night", "colors.xml"), darkColors)
	if err != nil {
		errorType = errType
	}

	err, errType = writeGradleFile(appName, appPackage)
	if err != nil {
		errorType = errType
	}

	if err != nil {
		var saveError = SaveError{
			err.Error(),
			errorType,
		}
		saveErrorPtr = &saveError
	}
	return saveErrorPtr
}

func writeFile(appName string, fileName string, fileData string) (error, string) {
	file, err := CreateFile(appName+"\\", fileName)
	if err != nil {
		return err, "json_file_creating"
	}
	_, err = file.Write([]byte(fileData))
	defer func(file *os.File) {
		err := file.Close()
		if err != nil {
			println("Error closing JSON file")
		}
	}(file)
	if err != nil {
		return err, "json_file_writing"
	}
	if err := file.Sync(); err != nil {
		return err, "json_file_sync_err"
	}
	return nil, ""
}

func writeZipFile(appName string, zipFileNames []string, zipFileBlobs []string) (error, string) {
	for i := range zipFileNames {
		if strings.HasSuffix(zipFileNames[i], "/") {
			mkDirErr := os.MkdirAll(appName+"\\"+zipFileNames[i], os.ModePerm)
			if mkDirErr != nil {
				return mkDirErr, "zip_file"
			}
		} else {
			decodedString, err := base64.StdEncoding.DecodeString(zipFileBlobs[i])
			if err != nil {
				return err, "zip_file_decoding"
			}
			file, err := os.Create(appName + "\\" + zipFileNames[i])
			if err != nil {
				return err, ""
			}
			defer func(file *os.File) {
				err := file.Close()
				if err != nil {

				}
			}(file)
			if _, err := file.Write(decodedString); err != nil {
				return err, "zip_file_write"
			}

			if err := file.Sync(); err != nil {
				return err, "zip_file_sync_err"
			}
		}
	}
	return nil, ""
}

func writeClientFlavor(appName string, data []PropertiesData) (error, string) {
	fileName := "client_flavor.xml"
	file, err := CreateFile(filepath.Join(appName, "res", "values"), fileName)
	if err != nil {
		return err, "file_creation"
	}
	_, err = file.WriteString("<?xml version=\"1.0\" encoding=\"utf-8\"?>\r<resources>\n")
	if err != nil {
		return err, "file_xml_namespace"
	}

	err = writeMisc(file, data)
	if err != nil {
		return err, "file_misc"
	}

	_, err = file.WriteString("</resources>\r")
	if err != nil {
		return err, "file_finish"
	}
	err = file.Sync()
	if err != nil {
		return err, "file_sync"
	}
	defer func(file *os.File) {
		err := file.Close()
		if err != nil {
			println("Close error")
		}
	}(file)
	return nil, ""
}

func writeMisc(file *os.File, data []PropertiesData) error {
	miscData := getPropsByName("misc_props", data)
	_, err := file.WriteString(miscData.toXmlString())
	return err
}

func writePropertiesData(appName string, data []PropertiesData) error {
	fileNames := []string{appName + "-stage-release.properties", appName + "-playstore.properties", appName + "-non-playstore.properties"}

	for i := range fileNames {
		file, err := CreateFile(appName, fileNames[i])
		defer func(file *os.File) {
			err := file.Close()
			if err != nil {
				println("Close error")
			}
		}(file)
		if err != nil {
			return err
		}
		propsData := getPropsByName(propsNames()[i], data)
		_, err = file.WriteString(propsData.toString())
		if err != nil {
			return err
		}
		err = file.Sync()
		if err != nil {
			return err
		}
	}
	return nil
}

func writeGradleFile(appName string, appPackage string) (error, string) {
	fileData, err := os.ReadFile("props\\gradle.template")
	if err != nil {
		return err, "read_gradle_template"
	}

	fileDataAsString := string(fileData)
	appNameSet := strings.Replace(fileDataAsString, "[app-name]", appName, 1)
	appPackageSet := strings.Replace(appNameSet, "[app-package]", appPackage, 1)

	file, err := CreateFile(appName, "build.gradle")
	defer func(file *os.File) {
		err := file.Close()
		if err != nil {

		}
	}(file)
	if err != nil {
		return err, "creating_gradle_file"
	}
	_, err = file.WriteString(appPackageSet)
	if err != nil {
		return err, "writing_gradle_file"
	}
	return nil, ""
}
