import { Component } from 'react'
import styled, { createGlobalStyle } from 'styled-components'
import localStorage from 'local-storage'
import ReactAudioPlayer from 'react-audio-player'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'shards-ui/dist/css/shards.min.css'

import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  CardFooter,
  Button
} from 'shards-react'

import data from '../utils/data'

class Home extends Component {
  state = {
    unusedTriads: [],
    unusedSevenths: [],
    currentTriad: null,
    currentSeventh: null
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

  saveStateToLocalStorage = () => localStorage.set('appState', JSON.stringify(this.state))

  // TODO: refactor these functions so they can be shared for triads and sevenths

  startTriadSession = () => {
    const { currentTriad, unusedTriads } = this.state

    //return console.log(data.keys.forEach)

    // Generate all possible triad combinations and save them to state
    let triads = []
    data.keys.forEach(key => {
      data.triads.forEach(triad => {
        triads.push(`${key} ${triad}`)
      })
    })

    // Select a random triad to start the session with and remove it from the 
    // array of all triads
    const index = Math.floor(Math.random()*triads.length)
    const startingTriad = triads.splice(index, 1)
    
    this.setState({
      // Save the possible traids minus the one we're using to start
      unusedTriads: triads,
      // Initialize the first triad
      currentTriad: startingTriad
    })
  }

  resetTriadSession = () => {  
    this.setState({
      unusedTriads: [],
      currentTriad: null
    })
  }

  generateTriad = () => {
    const { currentTriad, unusedTriads } = this.state

    // If there are no unused triads and no current triad we're startin a new session
    if (unusedTriads.length === 0 && currentTriad === null) 
      return this.startTriadSession()

    // if it's the last triad in the session, reset the session
    if (unusedTriads.length === 0) 
      return this.resetTriadSession()

    // Get random index
    const index = Math.floor(Math.random()*unusedTriads.length)
    
    // copy the array so it can be mutated
    let triads = [...unusedTriads]

    // Set the next traid and remove it from the array
    const nextTriad = triads.splice(index, 1)

    this.setState({
      // Save the possible traids minus the one we're using next
      unusedTriads: triads,
      // Initialize the next triad
      currentTriad: nextTriad
    })
  }

  startSeventhSession = () => {
    const { currentSeventh, unusedSevenths } = this.state

    //return console.log(data.keys.forEach)

    // Generate all possible triad combinations and save them to state
    let sevenths = []
    data.keys.forEach(key => {
      data.sevenths.forEach(triad => {
        sevenths.push(`${key} ${triad}`)
      })
    })

    // Select a random triad to start the session with and remove it from the 
    // array of all triads
    const index = Math.floor(Math.random()*sevenths.length)
    const startingSeventh = sevenths.splice(index, 1)
    
    this.setState({
      // Save the possible traids minus the one we're using to start
      unusedSevenths: sevenths,
      // Initialize the first triad
      currentSeventh: startingSeventh
    })
  }

  resetSeventhSession = () => {
    this.setState({
      unusedSevenths: [],
      currentSeventh: null
    })
  }

  generateSeventh = () => {
    const { currentSeventh, unusedSevenths } = this.state

    // If there are no unused triads and no current triad we're startin a new session
    if (unusedSevenths.length === 0 && currentSeventh === null) 
      return this.startSeventhSession()

    // if it's the last triad in the session, reset the session
    if (unusedSevenths.length === 0) 
      return this.resetSeventhSession()

    // Get random index
    const index = Math.floor(Math.random()*unusedSevenths.length)
    
    // copy the array so it can be mutated
    let sevenths = [...unusedSevenths]

    // Set the next traid and remove it from the array
    const nextSeventh = sevenths.splice(index, 1)

    this.setState({
      // Save the possible traids minus the one we're using next
      unusedSevenths: sevenths,
      // Initialize the next triad
      currentSeventh: nextSeventh
    })
  }

  render() {
    const { currentTriad, unusedTriads, currentSeventh, unusedSevenths } = this.state

    return (
      <>
      <GlobalStyle />
      <Container>
        <Card>
          <CardHeader><b>Triads</b></CardHeader>
            
            {!currentTriad ? (
              <CardBody>
                <CardTitle>New Triad Session </CardTitle>
                <p>Generate random triads covering all key / traid combinations.</p>
                <Button onClick={this.generateTriad}>Get Started!</Button>
              </CardBody>
            ) : (
              <CardBody>
                <CardTitle>{currentTriad}</CardTitle>
                <p>Practice the {currentTriad} traid with purpouse!</p>
                
                <Button onClick={this.generateTriad}>
                  {unusedTriads.length === 0
                    ? 'Reset Session'
                    : 'Next!'
                  }
                </Button>
              </CardBody>
            )}
          
          <CardFooter>
            Current Triad: {' '}
            {currentTriad 
              ? (data.keys.length * data.triads.length) - unusedTriads.length
              : 0
            }
            {' / '} 
            {data.keys.length * data.triads.length}
            <a onClick={this.resetTriadSession}><small>reset traid session</small></a>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader><b>7th Chords</b></CardHeader>
          {!currentSeventh ? (
              <CardBody>
                <CardTitle>New 7th Session</CardTitle>
                <p>Generate random 7ths covering all key / chord combinations.</p>
                <Button onClick={this.generateSeventh}>Get Started!</Button>
              </CardBody>
            ) : (
              <CardBody>
                <CardTitle>{currentSeventh}</CardTitle>

                <p>Practice the {currentSeventh} chord with purpouse!</p>

                <ReactAudioPlayer
                  src={`/static/audio/${currentSeventh}.mp3`}
                  controls
                />
                
                <Button onClick={this.generateSeventh}>
                  {unusedSevenths.length === 0
                    ? 'Reset Session'
                    : 'Next!'
                  }
                </Button>
              </CardBody>
            )}
          
          <CardFooter>
            Current Seventh: {' '}
            {currentSeventh
              ? (data.keys.length * data.sevenths.length) - unusedSevenths.length
              : 0
            }
            {' / '} 
            {data.keys.length * data.sevenths.length}
            <a onClick={this.resetSeventhSession}><small>reset seventh session</small></a>
          </CardFooter>
        </Card>
      </Container>
      </>
    )
  }
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  padding-top: 200px;

  .card {
    margin: 20px;
    max-width: 300px;
    flex-basis: 300px;
  }

  .card-footer a {
    display: block;
    cursor: pointer;
    text-decoration: underline;
    color: #007bff;
  }

  audio {
    outline: none;
    max-width: 100%;
    margin-bottom: 1.75rem;
  }
`

export default(Home)

const GlobalStyle = createGlobalStyle`
 /* reset */
`