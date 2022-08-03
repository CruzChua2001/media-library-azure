import styled from 'styled-components'

import Navbar from './@/../../../Layout/Navbar'
import Dashboard from './@/../../../dashboard/components/Dashboard'

const Container = styled.div`
  background-color: #f0f5f3;
  display: flex;
  min-height: 100vh;
  height: 100%;
`

const LeftDiv = styled.div`
  width: 20%;

  @media only screen and (max-width: 1199px) {
      width: 15%;
  }
`

const RightDiv = styled.div`
  width: 100%;
  padding: 1%;

  @media only screen and (max-width: 1399px) {
      width: 90%;
  }

  @media only screen and (max-width: 1199px) {
      width: 105%;
  }

  @media only screen and (max-width: 859px) {
      width: 100%;
  }

  @media only screen and (max-width: 799px) {
      width: 90%;
  }
`

const App = () => {
  return (
    <Container>

      <LeftDiv>
        <Navbar
          active="Dashboard"
        />
      </LeftDiv>

      <RightDiv>
        <Dashboard />
      </RightDiv>

    </Container>
  )
}

export default App
