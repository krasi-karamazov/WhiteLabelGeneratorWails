package main

import (
	"context"
	"main/fileutils"
	"os"
	"strings"
)

func filesToRead() []string {
	return []string{"stage-release.properties", "playstore.properties", "non-playstore.properties", "colors", "misc_props"}
}

func propsNames() []string {
	return []string{"staging", "playstore", "nonplaystore", "colors", "misc_props"}
}

// App struct
type App struct {
	ctx context.Context
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

func readFile(path string) []string {
	_, err := os.Stat(path)

	if os.IsNotExist(err) {
		return nil
	}
	propsData, err := os.ReadFile(path)
	if err != nil {
		return nil
	}
	propsDataString := string(propsData)
	props := strings.Split(propsDataString, "\n")
	return props
}

type PropertiesData struct {
	Name string   `json:"name"`
	Data []string `json:"data"`
}

type SaveError struct {
	Error string `json:"error"`
	Type  string `json:"type"`
}

func (a *App) ReadProperties() []PropertiesData {
	var props []PropertiesData

	workingDir, err := os.Getwd()
	if err == nil {
		for i := range filesToRead() {
			path := workingDir + "\\props\\" + filesToRead()[i]
			props = append(props, PropertiesData{
				Name: propsNames()[i],
				Data: readFile(path),
			})

		}
	} else {
		println(err)
	}
	return props
}

func (a *App) Save(appName string, appPackage string, data []PropertiesData, zipFile []byte, jsonFile []byte) *SaveError {
	var saveErrorPtr *SaveError = nil
	var errorType string
	err := writePropertiesData(appName, data)
	errorType = "write_props"

	err = writeColors(appName, data)
	errorType = "write_colors"

	err = writeMisc(appName, data)
	errorType = "write_colors"

	if err != nil {
		var saveError = SaveError{
			err.Error(),
			errorType,
		}
		saveErrorPtr = &saveError
	}
	return saveErrorPtr
}

func writeMisc(appName string, data []PropertiesData) error {
	fileName := "client_flavor.xml"
	file, err := fileutils.CreateFile(appName+"\\res\\values\\", fileName)
	if err != nil {
		println(err.Error())
		return err
	}
	colorsData := getPropsByName("colors", data)
	_, err = file.WriteString(colorsData.toXmlString("color"))
	return err
}

func writeColors(appName string, data []PropertiesData) error {
	fileName := "client_flavor.xml"
	file, err := fileutils.CreateFile(appName+"\\res\\values\\", fileName)
	if err != nil {
		println(err.Error())
		return err
	}
	colorsData := getPropsByName("colors", data)
	_, err = file.WriteString(colorsData.toXmlString("color"))
	return err
}

func writePropertiesData(appName string, data []PropertiesData) error {
	fileNames := []string{appName + "-stage-release.properties", appName + "-playstore.properties", appName + "-non-playstore.properties"}

	for i := range fileNames {
		file, err := fileutils.CreateFile(appName, fileNames[i])
		if err != nil {
			return err
		}
		propsData := getPropsByName(propsNames()[i], data)
		_, err = file.WriteString(propsData.toString())
		if err != nil {
			return err
		}
	}
	return nil
}

func (p *PropertiesData) toString() string {
	var stringBuilder strings.Builder
	for i := range p.Data {
		stringBuilder.WriteString(p.Data[i] + "\n")
	}
	return stringBuilder.String()
}

func (p *PropertiesData) toXmlString(nodeType string) string {
	var stringBuilder strings.Builder
	for i := range p.Data {
		propertyParts := strings.Split(p.Data[i], "=")
		stringBuilder.WriteString("<")
		stringBuilder.WriteString(nodeType)
		stringBuilder.WriteString(" name=\"")
		stringBuilder.WriteString(strings.TrimSpace(propertyParts[0]))
		stringBuilder.WriteString("\">")
		stringBuilder.WriteString(strings.TrimSpace(propertyParts[1]))
		stringBuilder.WriteString("</")
		stringBuilder.WriteString(nodeType)
		stringBuilder.WriteString(">\n")
	}
	return stringBuilder.String()
}

func getPropsByName(name string, data []PropertiesData) *PropertiesData {
	for i := range data {
		if data[i].Name == name {
			return &data[i]
		}
	}
	return nil
}
