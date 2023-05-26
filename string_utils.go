package main

import "strings"

func (p *PropertiesData) toString() string {
	var stringBuilder strings.Builder
	for i := range p.Data {
		stringBuilder.WriteString(p.Data[i] + "\n")
	}
	return stringBuilder.String()
}

func (p *PropertiesData) toXmlString() string {
	var stringBuilder strings.Builder
	for i := range p.Data {
		propertyParts := strings.Split(p.Data[i], "=")
		nodeType := getNodeType(propertyParts)
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

func getNodeType(parts []string) string {
	if strings.Contains(parts[1], "@drawable") {
		return "drawable"
	} else if parts[1] == "true" || parts[1] == "false" {
		return "bool"
	} else if strings.HasPrefix(parts[1], "#") {
		return "color"
	} else {
		return "string"
	}
}

func getPropsByName(name string, data []PropertiesData) *PropertiesData {
	for i := range data {
		if data[i].Name == name {
			return &data[i]
		}
	}
	return nil
}
