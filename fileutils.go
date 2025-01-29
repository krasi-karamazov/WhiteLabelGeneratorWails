package main

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
		desiredPath := filepath.Join(currentWorkingDir, dir)
		desiredFilePath := filepath.Join(desiredPath, fileName)
		_, err := os.Stat(desiredFilePath)
		if err != nil && os.IsNotExist(err) {
			mkDirErr := os.MkdirAll(desiredFilePath, os.ModePerm)
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
	if _, err := os.Stat(path); err == nil {
		err = os.Remove(path)
		if err != nil {
			return nil, err
		}
	}
	if file, err := os.Create(path); err == nil {
		return file, nil
	} else {
		return nil, err
	}
}
