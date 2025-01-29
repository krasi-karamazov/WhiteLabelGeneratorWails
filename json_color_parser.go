package main

import (
	"encoding/json"
)

func parseColors(fileData string) (string, string, error) {
	var data *ColorsData
	var err = json.Unmarshal([]byte(fileData), &data)
	variables := data.Collections[0].Modes[0].Variables
	tokens := data.Collections[1].Modes
	var primitivesMap = ParsePrimitives(variables)
	var tokensMap = ParseTokens(tokens)

	lightXML := GenerateXML(primitivesMap, tokensMap, "light")
	darkXML := GenerateXML(primitivesMap, tokensMap, "dark")
	return lightXML, darkXML, err
}
