package main

import (
	"encoding/xml"
	"strings"
)

func GenerateXML(primitivesMap map[string][]VariableObj, tokensMap map[string][]TokensColorValue, mode string) string {
	var colorsList = make([]XMLColorModel, 0)
	if mode == "light" {
		for _, color := range primitivesMap["light"] {
			colorsList = append(colorsList, generateXMLColorObject(color))
		}
		for _, color := range primitivesMap["misc"] {
			colorsList = append(colorsList, generateXMLColorObject(color))
		}
		for _, color := range tokensMap["light"] {
			colorsList = append(colorsList, generateXMLColorObjectFromToken(color))
		}
	} else {
		for _, color := range primitivesMap["dark"] {
			colorsList = append(colorsList, generateXMLColorObject(color))
		}

		for _, color := range tokensMap["light"] {
			colorsList = append(colorsList, generateXMLColorObjectFromToken(color))
		}
	}
	var baseModel = XMLBaseModel{
		ColorModel: colorsList,
	}

	out, _ := xml.MarshalIndent(baseModel, "", "  ")
	return xml.Header + string(out)
}

func generateXMLColorObject(color VariableObj) XMLColorModel {

	return XMLColorModel{
		Value: strings.ReplaceAll(color.Value.Value, "\"", ""),
		Name:  color.Name,
	}
}

func generateXMLColorObjectFromToken(color TokensColorValue) XMLColorModel {
	return XMLColorModel{
		Value: "@color/" + color.Value,
		Name:  color.Name,
	}
}
