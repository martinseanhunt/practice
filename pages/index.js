import { Component } from 'react'
import styled, { createGlobalStyle } from 'styled-components'
import localStorage from 'local-storage'
import Head from 'next/head'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'shards-ui/dist/css/shards.min.css'

import data from '../utils/data'
import { getKeynames } from '../utils/helpers'

import ChordCard from '../components/ChordCard'

class Home extends Component {
  state = {
    unusedTriads: [],
    usedTriads: [],
    currentTriadIndex: null,
    unusedSevenths: [],
    usedSevenths: [],
    currentSeventhIndex: null,
  }

  componentDidMount = () => {
    // hydrate app state from local storage
    this.setState(JSON.parse(localStorage.get('appState')))

    // add event listener to save state to localStorage
    // when user leaves/refreshes the page
    window.addEventListener(
      "beforeunload",
      this.saveStateToLocalStorage
    );
  }

  componentWillUnmount() {
    window.removeEventListener(
      "beforeunload",
      this.saveStateToLocalStorage
    );

    // saves if component has a chance to unmount
    this.saveStateToLocalStorage()
  }

  // Converts application state to JSON and saves in browsers local storage
  saveStateToLocalStorage = () => localStorage.set('appState', JSON.stringify(this.state))

  startSession = (chordType) => {
    const keyNames = getKeynames(chordType)

    // Generate all possible chord combinations and save them to an array
    let chords = []
    data.keys.forEach(key => {
      data[keyNames.chordTypePlural].forEach(chord => {
        chords.push(`${key} ${chord}`)
      })
    })

    // Select a random chord to start the session with and remove it from the 
    // array of all possible chords
    const index = Math.floor(Math.random()*chords.length)
    const startingChord = chords.splice(index, 1)
    
    this.setState({
      // Save the possible chords minus the one we're using to start
      [keyNames.unusedChords]: chords,
      // Add first chord to history array
      [keyNames.usedChords]: startingChord,
      // Start current index at 0
      [keyNames.currentChordIndex]: 0
    })
  }

  resetSession = (chordType) => {  
    const keyNames = getKeynames(chordType)

    confirm(`This will start a new ${chordType} session with a new randomized order`)
      && this.setState({
        [keyNames.unusedChords]: [],
        [keyNames.usedChords]: [],
        [keyNames.currentChordIndex]: null
      })
  }

  generateChord = (chordType) => {
    const keyNames = getKeynames(chordType)

    // Get information from state for the relevant chord type
    const currentChordIndex = this.state[keyNames.currentChordIndex]
    const unusedChords = this.state[keyNames.unusedChords]
    const usedChords = this.state[keyNames.usedChords]

    // If there are no used chords we're startin a new session for this chord type
    if (usedChords.length === 0) 
      return this.startSession(chordType)

    // If the current history index is less than the length of the array
    // of used chords, it means we're back in history and need to go forwards instead
    // of generating a new chord
    if((currentChordIndex + 1) < usedChords.length)
      return this.setState(prevState => ({
        [keyNames.currentChordIndex]: prevState[keyNames.currentChordIndex] + 1
      }))

    // if it's the last triad in the session, reset the session
    if (unusedChords.length === 0) 
      return this.resetSession(chordType)

    // Get random index
    const index = Math.floor(Math.random()*unusedChords.length)
    
    // copy the array so it can be mutated
    let chords = [...unusedChords]

    // Set the next traid and remove it from the array
    const nextChord = chords.splice(index, 1)

    this.setState(prevState => ({
      // Save the possible chords minus the one we're using next
      [keyNames.unusedChords]: chords,
      // Add next chord to history array
      [keyNames.usedChords]: [...prevState[keyNames.usedChords], ...nextChord],
      // increase current index
      [keyNames.currentChordIndex]: prevState[keyNames.currentChordIndex] + 1
    }))
  }

  goPreviousChord = (chordType) => {
    const keyNames = getKeynames(chordType)

    this.setState(prevState => ({
      [keyNames.currentChordIndex]: prevState[keyNames.currentChordIndex] - 1
    }))
  }

  render() {
    const { 
      unusedTriads, 
      usedTriads,
      currentTriadIndex,
      unusedSevenths,
      usedSevenths,
      currentSeventhIndex
    } = this.state

    const currentSeventh = usedSevenths[currentSeventhIndex]
    const currentTriad = usedTriads[currentTriadIndex]

    return (
      <>
      <Head>
        <title>Shed Town - Get in the shed!</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <GlobalStyle />
      <Container>
        <h1>Welcome To Shed Town! <br/><small>Tools For The Woodshed</small></h1>

        <MainText>✋ Hi there, this is a simple tool I made to help me with my music practice. It mixes up key / chord combinations in a random order and saves the current order &amp; position to your browsers local storage so you can leave this application and pick up where you left off when you return. This is useful for focusing on one chord a day in a random key until you've covered all combinations... It's been hugely helpful for me and I hope it can be of some use to you as well! 🎸</MainText>


        <Cards>
          <ChordCard 
            chordType='triad'
            currentChord={currentTriad}
            unusedChords={unusedTriads}
            usedChords={usedTriads}
            currentChordIndex={currentTriadIndex}
            startSession={this.startSession}
            generateChord={this.generateChord}
            resetSession={this.resetSession}
            goPreviousChord={this.goPreviousChord}
          />

          <ChordCard 
            chordType='seventh'
            chordTypeReadable='7th chord'
            currentChord={currentSeventh}
            unusedChords={unusedSevenths}
            usedChords={usedSevenths}
            currentChordIndex={currentSeventhIndex}
            startSession={this.startSession}
            generateChord={this.generateChord}
            resetSession={this.resetSession}
            goPreviousChord={this.goPreviousChord}
          />
        </Cards>
      </Container>
      </>
    )
  }
}

export default(Home)

const Container = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  padding-top: 100px;
  text-align: center;
  flex-direction: column;

  h1 {
    font-size: 1.75rem;
    line-height: 2rem;
    small {
      font-size: 1rem;
    }
  }

  @media (max-width: 768px) {
    padding-top: 50px;
  }
`

const MainText = styled.p`
  max-width: 590px;
  display: block;
  margin: 0 auto;
  padding: 10px 20px 0 20px;
`

const Cards = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  padding-top: 50px;
  text-align: left;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    padding-top: 30px;
  }
`

const GlobalStyle = createGlobalStyle`
 /* Global Styles Go Here */
`