import styled from 'styled-components'
import ReactAudioPlayer from 'react-audio-player'
import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  CardFooter,
  Button
} from 'shards-react'

import data from '../utils/data'

export default (props) => {
  const {
    chordType,
    currentChord,
    unusedChords,
    usedChords,
    currentChordIndex,
    generateChord,
    resetSession,
    goPreviousChord,
    chordTypeReadable
  } = props

  const chordTypeCopy = chordTypeReadable || chordType

  return (
    <StyledCard>
      <CardHeader><b>{chordTypeCopy}s</b></CardHeader>
        
        {!currentChord ? (
          <CardBody>
            <CardTitle>New {chordTypeCopy} Session </CardTitle>
            <p>Generate random {chordTypeCopy} covering all key / chord combinations.</p>
            <Button 
              onClick={() => generateChord(chordType)}
            >
              Get Started!
            </Button>
          </CardBody>
        ) : (
          <CardBody>
            <CardTitle>{currentChord}</CardTitle>
            <p>Practice the {currentChord} {chordTypeCopy} with purpouse!</p>

            <ReactAudioPlayer
              src={`/static/audio/${chordType}/${currentChord}.mp3`}
              controls
            />

            <Buttons>
              {currentChordIndex > 0 && (
                <Button 
                  onClick={() => goPreviousChord(chordType)}
                >
                  ← Back
                </Button>
              )}
              
              <Button 
                onClick={() => generateChord(chordType)}
              >
                {unusedChords.length === 0 && (currentChordIndex + 1) === usedChords.length
                  ? 'Reset Session'
                  : 'Next →'
                }
              </Button>
            </Buttons>
          </CardBody>
        )}
      
      <CardFooter>
        <span>
          Current {chordTypeCopy}: {' '}
          {usedChords.length 
            ? currentChordIndex + 1
            : 0
          }
          {' / '} 
          {data.keys.length * data[`${chordType}s`].length}
        </span>

        <a onClick={() => resetSession(chordType)}>
          <small>reset {chordTypeCopy} session</small>
        </a>
      </CardFooter>
    </StyledCard>
  )
}

const StyledCard = styled(Card)`
  margin: 20px;
  max-width: 300px;
  flex-basis: 300px;
  margin-bottom: 30px;

  @media (max-width: 768px) {
    flex-basis: 100%;
    width: 100%;
    max-width: 100%;
  }

  .card-title {
    text-transform: capitalize;
  }

  .btn:first-of-type {
    margin-right: 10px;
  }

  .card-header {
    text-transform: capitalize;
  }

  .card-footer {
    span {
      text-transform: capitalize;
    }
    a {
      display: block;
      cursor: pointer;
      text-decoration: underline;
      color: #007bff;
    }
  }

  audio {
    outline: none;
    max-width: 100%;
    margin-bottom: 1.75rem;
  }
`

const Buttons = styled.div`
  display: flex;
  justify-content: space-between;

  .btn {
    flex-basis: 45%;
  }
`