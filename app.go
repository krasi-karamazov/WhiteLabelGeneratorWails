package main

import (
	"context"
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
// ,so we can call the runtime methods
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
	propsDataString := strings.TrimSpace(string(propsData))
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
