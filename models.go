package main

import (
	"encoding/json"
	"encoding/xml"
	"regexp"
)

type ColorsData struct {
	Version  string `json:"version"`
	Metadata struct {
	} `json:"metadata"`
	Collections CollectionsObj `json:"collections"`
}

type CollectionsObj []struct {
	Name  string   `json:"name"`
	Modes ModesObj `json:"modes"`
}

type VariablesObj []VariableObj

type VariableObj struct {
	Name    string            `json:"name"`
	Type    string            `json:"type"`
	IsAlias bool              `json:"isAlias"`
	Value   ColorValueWrapper `json:"value"`
}

type ColorValue struct {
	Collection string `json:"collection,omitempty"`
	Name       string `json:"name,omitempty"`
}

type ColorValueWrapper struct {
	ColorValue
	Value   string `json:"value"`
	Partial bool   `json:"-"`
}

func (w *ColorValueWrapper) UnmarshalJSON(data []byte) error {
	reRGB := regexp.MustCompile(`^"#(?:[0-9a-fA-F]{3}){1,2}"$`)
	reARGB := regexp.MustCompile(`^"#(?:[0-9a-fA-F]{3,4}){1,2}"$`)
	matchRGB := reRGB.Match(data)
	matchARGB := reARGB.Match(data)
	if matchRGB || matchARGB {
		w.Value = string(data)
		w.Partial = true
		return nil
	} else {
		err := json.Unmarshal(data, &w.ColorValue)
		if err != nil {
			return nil
		} else {
			return json.Unmarshal(data, &w.ColorValue)
		}
	}
}

type ModesObj []struct {
	Name      string       `json:"name"`
	Variables VariablesObj `json:"variables"`
}

type TokensColorValue struct {
	Name  string `json:"name"`
	Value string `json:"value"`
}

type XMLBaseModel struct {
	XMLName    xml.Name `xml:"resources"`
	ColorModel []XMLColorModel
}

type XMLColorModel struct {
	XMLName xml.Name `xml:"color"`
	Value   string   `xml:",chardata"`
	Name    string   `xml:"name,attr"`
}
