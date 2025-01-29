package main

import (
	"slices"
	"strings"
)

func AlterPrimitiveName(name string, mode string) string {
	nameParts := strings.Split(name, "/")
	nameParts = removeDuplicate(nameParts)
	if len(mode) > 0 {
		if slices.Contains(nameParts, mode) {
			index := slices.Index(nameParts, mode)
			nameParts = slices.Delete(nameParts, index, index+1)
		}
	}
	return strings.Join(nameParts, "_")
}

func AlterTokenName(name string) string {
	nameParts := strings.Split(name, "/")
	return nameParts[1]
}

func removeDuplicate[T comparable](sliceList []T) []T {
	allKeys := make(map[T]bool)
	list := []T{}
	for _, item := range sliceList {
		if _, value := allKeys[item]; !value {
			allKeys[item] = true
			list = append(list, item)
		}
	}
	return list
}
