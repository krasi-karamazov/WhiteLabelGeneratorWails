package fileutils

import (
	"errors"
	"os"
	"path/filepath"
)

func CreateFile(dir string, fileName string) (*os.File, error) {
	return checkIfFileExistsOtherwiseCreate(dir, fileName)
}

func checkIfFileExistsOtherwiseCreate(dir string, fileName string) (*os.File, error) {
	if currentWorkingDir, dirEr := os.Getwd(); dirEr == nil {
		desiredPath := currentWorkingDir + string(filepath.Separator) + dir
		desiredFilePath := desiredPath + string(filepath.Separator) + fileName
		_, err := os.Stat(desiredPath)
		if err != nil && os.IsNotExist(err) {
			mkDirErr := os.MkdirAll(desiredPath, os.ModePerm)
			if mkDirErr != nil {
				return nil, err
			}
			return createFile(desiredFilePath)
		} else {
			return createFile(desiredFilePath)
		}
	}
	return nil, errors.New("could not create file")
}

func createFile(path string) (*os.File, error) {
	if file, err := os.Create(path); err == nil {
		return file, nil
	} else {
		return nil, err
	}
}
