import { useState } from 'react'
import Form from './form'
import Voting from './voting'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Form />
      <Voting />
    </>
  )
}

export default App
