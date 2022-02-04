import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Button from 'react-bootstrap/Button'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import Dropdown from 'react-bootstrap/Dropdown'
import Form from 'react-bootstrap/Form'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tab from 'react-bootstrap/Tab'
import Tabs from 'react-bootstrap/Tabs'
import Tooltip from 'react-bootstrap/Tooltip'
import SpatialFilter from '@/components/SpatialFilter'

const Container = styled.div`
  padding: 1rem;
  margin: 0 -0.25rem;
  display: flex;
  justify-content: space-between;
`

const PushRight = styled.div`
  margin: 0 0.25rem 0 auto;
`

const StyledDropdown = styled(Dropdown)`
  margin: 0 0.25rem;
`

const DropdownMenu = styled(Dropdown.Menu)`
  min-width: 20rem;
`

const DropdownForm = styled.form`
  padding: 0.25rem 1.5rem;
`

const TooltipOverlay = ({ message, placement = 'bottom', ...props }) => {
  return (
    <OverlayTrigger
      overlay={<Tooltip>{message}</Tooltip>}
      placement={placement}
      {...props}
    >
      {props.children}
    </OverlayTrigger>
  )
}

const LayoutTypeSwitch = ({ gridView, setGridView }) => {
  return (
    <PushRight>
      <span className="mr-2">
        <small className="font-weight-bold">Layout</small>
      </span>
      <ButtonGroup size="sm" aria-label="Basic example">
        <TooltipOverlay message="View in grid layout">
          <Button
            variant="outline-primary"
            active={gridView}
            onClick={() => setGridView(true)}
          >
            <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-grid" fill="currentColor" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="View in grid layout">
              <path fillRule="evenodd" d="M1 2.5A1.5 1.5 0 0 1 2.5 1h3A1.5 1.5 0 0 1 7 2.5v3A1.5 1.5 0 0 1 5.5 7h-3A1.5 1.5 0 0 1 1 5.5v-3zM2.5 2a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3zm6.5.5A1.5 1.5 0 0 1 10.5 1h3A1.5 1.5 0 0 1 15 2.5v3A1.5 1.5 0 0 1 13.5 7h-3A1.5 1.5 0 0 1 9 5.5v-3zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3zM1 10.5A1.5 1.5 0 0 1 2.5 9h3A1.5 1.5 0 0 1 7 10.5v3A1.5 1.5 0 0 1 5.5 15h-3A1.5 1.5 0 0 1 1 13.5v-3zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3zm6.5.5A1.5 1.5 0 0 1 10.5 9h3a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 9 13.5v-3zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3z"></path>
            </svg>
          </Button>
        </TooltipOverlay>
        <TooltipOverlay message="View in list layout">
          <Button
            variant="outline-primary"
            active={!gridView}
            onClick={() => setGridView(false)}
          >
            <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-view-list" fill="currentColor" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="View in list layout">
              <path fillRule="evenodd" d="M3 4.5h10a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2zm0 1a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1H3zM1 2a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 0 1h-13A.5.5 0 0 1 1 2zm0 12a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 0 1h-13A.5.5 0 0 1 1 14z"></path>
            </svg>
          </Button>
        </TooltipOverlay>
      </ButtonGroup>
    </PushRight>
  )
}

const getButtonText2 = ({ filterType, date1, date2 }) => {
  let text = 'Date: '
  if (filterType === 'none') {
    text += 'All'
  } else if (filterType === 'uploaded') {
    text += date1 + ' to ' + date2
  } else if (filterType === 'taken') {
    text += date1 + ' to ' + date2
  }

  return text
}

const FilterSettings = ({
  filters,
  setFilters,
  areas,
  gridView,
  onSetView,
}) => {
  const [key, setKey] = useState('none')
  const [currentFilters, setCurrentFilters] = useState({
    areaName: '',
    postalCode: '',
  })

  const resetCurrentFilters = () => {
    if (filters.filterType === 'none') {
      setCurrentFilters({
        uploaded: '',
        uploaded2: '',
        taken: '',
        taken2: '',
      })
    } else if (filters.filterType === 'uploaded') {
      setCurrentFilters({
        uploaded: filters.date1,
        uploaded2: filters.date2,
        taken: '',
        taken2: '',
      })
    } else if (filters.filterType === 'taken') {
      setCurrentFilters({
        uploaded: '',
        uploaded2: '',
        taken: filters.date1,
        taken2: filters.date2,
      })
    }
    setKey(filters.filterType)
  }

  // Keep our UI consistent with filter settings in slice when they are updated
  useEffect(() => {
    resetCurrentFilters()
  }, [filters])

  const handleFiltersChange = (key) => (e) => {
    const value = e.target.value
    setCurrentFilters({
      ...currentFilters,
      [key]: value,
    })
  }

  const handleToggle = (isOpen) => {
    if (!isOpen) {
      resetCurrentFilters()
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Check which tab is active and set the filter specific to it
    if (key === 'Uploaded') {
      setFilters({
        filterType: 'uploaded',
        date1: currentFilters.uploaded,
        date2: currentFilters.uploaded2,
      })
    } else if (key === 'Taken') {
      setFilters({
        filterType: 'taken',
        date1: currentFilters.taken,
        date2: currentFilters.taken2,
      })
    }
  }

  const handleReset = (e) => {
    e.preventDefault()
    setFilters({ filterType: 'none' })
  }

  // Create random unique id for form element (use a lazy initial state so that it is generated once only)
  const [formId] = useState(
    () => 'filter-form-' + Math.random().toString(36).substr(2, 9)
  )

  const dropdownButtonText2 = getButtonText2(filters)

  return (
    <Container>
      <SpatialFilter filters={filters} setFilters={setFilters} areas={areas} />
      <StyledDropdown onToggle={handleToggle}>
        <Dropdown.Toggle
          size="sm"
          variant="outline-primary"
          id="dropdown-date-filter"
        >
          {dropdownButtonText2}
        </Dropdown.Toggle>
        <DropdownMenu>
          <Dropdown.Header>Date selection</Dropdown.Header>
          <DropdownForm id={formId} onSubmit={handleSubmit}>
            <Tabs
              id="date-filter-tabs"
              className="mb-3"
              justify
              unmountOnExit={true}
              activeKey={key}
              onSelect={setKey}
            >
              <Tab
                tabClassName="nav-link-sm"
                eventKey="Uploaded"
                title="Uploaded"
              >
                <Form.Group controlId="date-input">
                  <Form.Label srOnly>Uploaded Date</Form.Label>
                    <Form.Control
                    form={formId}
                    size="sm"
                    type="date"
                    placeholder="Enter uploaded date (from)"
                    value={currentFilters.uploaded}
                    required
                    onChange={handleFiltersChange('uploaded')}

                    />
                </Form.Group>
                <Form.Group controlId="date-input">
                  <Form.Label srOnly>Uploaded Date</Form.Label>
                  <Form.Control
                    form={formId}
                    size="sm"
                    type="date"
                    placeholder="Enter uploaded date (to)"
                      value={currentFilters.uploaded2}
                    //required
                    onChange={handleFiltersChange('uploaded2')}
                  />
                </Form.Group>
              </Tab>
              <Tab
                tabClassName="nav-link-sm"
                eventKey="Taken"
                title="Taken"
              >
                <Form.Group controlId="date-input">
                  <Form.Label srOnly>Taken Date</Form.Label>
                    <Form.Control
                      form={formId}
                      size="sm"
                      type="date"
                      placeholder="Enter taken date (from)"
                      value={currentFilters.taken}
                      required
                      onChange={handleFiltersChange('taken')}
                    />
                  </Form.Group>
                  <Form.Group controlId="date-input">
                    <Form.Label srOnly>Taken Date</Form.Label>
                    <Form.Control
                      form={formId}
                      size="sm"
                      type="date"
                      placeholder="Enter taken date (to)"
                      value={currentFilters.taken2}
                      required
                      onChange={handleFiltersChange('taken2')}
                    />
                  </Form.Group>
              </Tab>
            </Tabs>
            <Button size="sm" variant="primary" type="submit">
              Apply
            </Button>
            <Button size="sm" variant="link" onClick={handleReset}>
              Reset
            </Button>
          </DropdownForm>
        </DropdownMenu>
      </StyledDropdown>
      <LayoutTypeSwitch gridView={gridView} setGridView={onSetView} />
    </Container>
  )
}

FilterSettings.propTypes = {
  filters: PropTypes.object.isRequired,
  setFilters: PropTypes.func.isRequired,
  areas: PropTypes.array.isRequired,
}

export default FilterSettings
