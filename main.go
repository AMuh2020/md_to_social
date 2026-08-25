package mdtosocial

import (
	"bytes"

	"github.com/yuin/goldmark"
)

func main() {
	// Example Markdown content
	markdownContent := []byte("# Hello, Markdown!\n\nThis is a sample Markdown content.")

	var buf bytes.Buffer
	err := goldmark.Convert(markdownContent, &buf)
	if err != nil {
		panic(err)
	}

}
