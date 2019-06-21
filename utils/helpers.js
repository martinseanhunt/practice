// capitalizes first character of string
const capitalizeString = (chordType) => 
  chordType.charAt(0).toUpperCase() + chordType.slice(1)

// Returns an object with the correct keynames to look up in state, 
// abstracting this here because repeating these is ugly and unneccesarry
const getKeynames = (chordType) => {
  const chordTypeCapitalized = capitalizeString(chordType)

  return {
    chordTypePlural: `${chordType}s`,
    unusedChords: `unused${chordTypeCapitalized}s`,
    usedChords: `used${chordTypeCapitalized}s`,
    currentChordIndex: `current${chordTypeCapitalized}Index`
  }
}


export { capitalizeString, getKeynames }