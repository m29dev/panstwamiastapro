export const checkWord = async (word) => {
    const response = fetch(
        'https://api.allorigins.win/get?url=' +
            encodeURIComponent(`https://sjp.pl/${word}`)
    )
        .then((response) => response.json())
        .then((data) => {
            const fullHtmlText = data.contents
            const extractedText = extractAllowedWords(fullHtmlText)
            return extractedText
        })
        .catch((error) => console.error('Error:', error))

    return response
}

const extractAllowedWords = (html) => {
    const parser = new DOMParser()
    const doc = parser.parseFromString(html, 'text/html')
    let check
    let description
    let pass = false

    doc.body.childNodes.forEach((node, index) => {
        if (pass) return

        if (index === 12) {
            const checkError = node.textContent.slice(0, 24)
            console.log(checkError)

            if (checkError === 'nie występuje w słowniku') {
                check = 'false'
                description = ''
                pass = true
            }
        }

        if (index === 15) {
            check = node.textContent.slice(0, 21)
        }

        if (index === 21) {
            description = node.textContent
        }
    })

    const checkObject = {
        check,
        description,
    }

    return checkObject
}
