package main

import (
	"strings"
)

func ParsePrimitives(variables VariablesObj) map[string][]VariableObj {
	var lightColors = make([]VariableObj, 0)
	var darkColors = make([]VariableObj, 0)
	var miscColors = make([]VariableObj, 0)
	var primitivesMap = make(map[string][]VariableObj)
	var lightMode = "light"
	var darkMode = "dark"
	for _, element := range variables {
		if strings.Contains(element.Name, lightMode) {
			element.Name = AlterPrimitiveName(element.Name, lightMode)
			lightColors = append(lightColors, element)
		} else if strings.Contains(element.Name, darkMode) {
			element.Name = AlterPrimitiveName(element.Name, darkMode)
			darkColors = append(darkColors, element)
		} else {
			element.Name = AlterPrimitiveName(element.Name, "")
			miscColors = append(miscColors, element)
		}

	}
	primitivesMap[lightMode] = lightColors
	primitivesMap[darkMode] = darkColors
	primitivesMap["misc"] = miscColors
	return primitivesMap
}

func ParseTokens(modes ModesObj) map[string][]TokensColorValue {
	var lightColors = make([]TokensColorValue, 0)
	var darkColors = make([]TokensColorValue, 0)
	var tokensMap = make(map[string][]TokensColorValue)

	for i, element := range modes {
		colors := element.Variables
		for _, color := range colors {
			var c TokensColorValue
			c.Value = AlterPrimitiveName(color.Value.Name, strings.ToLower(modes[i].Name))
			c.Name = AlterTokenName(color.Name)
			if strings.ToLower(modes[i].Name) == "light" {
				lightColors = append(lightColors, c)
			} else {
				darkColors = append(darkColors, c)
			}
		}
	}
	tokensMap["light"] = lightColors
	tokensMap["dark"] = darkColors
	return tokensMap
}
